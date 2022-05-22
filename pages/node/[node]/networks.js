import prisma from "../../../lib/prisma";
import hyexd from "hyexd";
import getNodeEnc from "../../../lib/getNodeEnc";
import decodeToken from "../../../lib/decodeToken";
import SideLayout, { reformatItemList } from "../../../components/sideLayout";
import { NodeStore } from "../../../states/node";
import Navigation from "../../../components/node/navigation";
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Paper, Typography, Tooltip, TextField, Switch, Select, MenuItem, Autocomplete, Fade } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import SingleFieldDialog from "../../../components/singleFieldDialog";
import { ExpandMore } from "@mui/icons-material";
import prettyBytes from "pretty-bytes";
import MultiFieldDialog from "../../../components/multiFieldDialog";
import { useRouter } from "next/router";

export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    const user_data = decodeToken(req.cookies.access_token);
    const node = await prisma.node.findUnique({
        where: {
            id: query.node,
        }
    })
    let networks;
    const client = new hyexd("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii"),
    })
    networks = (await client.networks(true)).metadata.filter(net => net.managed === true);
    await Promise.all(networks.map(async (net, index) => {
        let netState = await client.network(net.name).state;
        networks[index].state = netState.metadata;
        networks[index].leases = (await client.network(net.name).leases).metadata;
        networks[index].forwards = (await client.network(net.name).forwards).metadata;
        let names = [];
        networks[index].leases.forEach(lease => {
            names.push(lease.hostname);
        });
        let newLeases = [];
        if (new Set(names).size !== names.length) {
            names.forEach((name, ind) => {
                if (names.filter(n => n === name).length > 1) {
                    let lease = networks[index].leases.filter(lease => lease.hostname === name)[1];
                    lease.address2 = networks[index].leases.filter(lease => lease.hostname === name)[0].address
                    newLeases.push(lease);
                    delete names[ind];
                }
            });
            await Promise.all(newLeases.map(async lease => {
                let inst;
                try {
                    inst = await prisma.instance.findUnique({
                        where: {
                            id: lease.hostname,
                        }
                    })
                } catch (error) {

                }
                if (inst) {
                    let instance = (await client.instance(lease.hostname).data).metadata;
                    instance.state = (await client.instance(lease.hostname).state).metadata;
                    instance.name = inst.name;
                    let total_in = 0;
                    let total_out = 0;
                    Object.keys(instance.state.network).forEach(key => {
                        total_in += instance.state.network[key].counters.bytes_received;
                        total_out += instance.state.network[key].counters.bytes_sent;
                    });
                    instance.state.total_in = total_in;
                    instance.state.total_out = total_out;
                    newLeases.filter(l => l.hostname === lease.hostname)[0].instance = instance;
                }

            }));
            networks[index].leases = newLeases;
        }

    }))
    return { props: { node, networks } }
}

function CreateNetworkForward({ open, node, selectedNetwork }) {
    const [ipAddress, setIpAddress] = useState("");
    return (
        <SingleFieldDialog
            title="Add Floating IP"
            description="What IP Address would you like to use?"
            placeholder="IP Address"
            action={<Button variant="contained" color="success" onClick={() => {
                axios.post(`/api/v1/nodes/${node.id}/networks/${selectedNetwork.name}/forwards`, {
                    name: "",
                    listen_address: ipAddress,
                    ports: []
                })
            }}>Add Floating IP</Button>}
            open={open}
            stateManager={setIpAddress}
        />
    )
}

function OpenFloatingIPPort({ open, node, selectedNetwork, selectedForward, setOpen }) {
    const router = useRouter();
    const [address, setAddress] = useState(null);
    const [description, setDescription] = useState(null);
    const [protocol, setProtocol] = useState("tcp");
    const [targetPort, setTargetPort] = useState(null);
    const [listenPort, setListenPort] = useState(null);
    return (
        <MultiFieldDialog open={open} title="Open Port" fields={[
            {
                name: "Address", input: <Autocomplete sx={{ ml: "auto" }} onChange={(e, value) => {
                    setAddress(value ? value.address : null);
                }} options={selectedNetwork.leases} getOptionLabel={option => option.instance ? option.instance.name + ` (${option.address})` : option.address} renderInput={(params) => <TextField variant="standard" {...params} placeholder="IP Address" sx={{ width: "244px" }} />} />
            },
            { name: "Description", input: <TextField onChange={(e) => setDescription(e.target.value)} variant="standard" sx={{ mb: "auto", ml: "auto" }} placeholder={"Description"} /> },
            {
                name: "Protocol", input: <Select onChange={(e) => setProtocol(e.target.value)} value={protocol} variant="standard" sx={{ mb: "auto", ml: "auto" }}>
                    <MenuItem value="tcp">TCP</MenuItem>
                    <MenuItem value="udp">UDP</MenuItem>
                </Select>
            },
            { name: "Target Port(s)", input: <TextField onChange={(e) => setTargetPort(e.target.value)} variant="standard" sx={{ mb: "auto", ml: "auto" }} placeholder="443" /> },
            { name: "Listen Port(s)", input: <TextField onChange={(e) => setListenPort(e.target.value)} variant="standard" sx={{ mb: "auto", ml: "auto" }} placeholder="443" /> }]}
            action={description && address && protocol && targetPort && listenPort ? <Button variant="contained" color="success" onClick={() => {
                axios.patch(`/api/v1/nodes/${node.id}/networks/${selectedNetwork.name}/forwards/${selectedForward.listen_address}`, {
                    ports: [
                        ...selectedForward.ports,
                        {
                            target_address: address,
                            target_port: targetPort,
                            protocol,
                            listen_port: listenPort,
                            description
                        }
                    ]
                }).then(() => {
                    setAddress(null);
                    setDescription(null);
                    setProtocol("tcp");
                    setTargetPort(null);
                    setListenPort(null);
                    setOpen(false);
                    router.replace(router.asPath)
                })
            }}>Open Port</Button> : ""}
        />
    )
}

export default function Networks({ node, networks }) {
    const router = useRouter();
    const [creatingNetwork, setCreatingNetwork] = useState(false);
    const [creatingNetworkForward, setCreatingNetworkForward] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [openingFloatingIPPort, setOpeningFloatingIPPort] = useState(false);
    const [selectedForward, setSelectedForward] = useState(null);
    return (
        <>
            <Grid container direction="row" sx={{ mb: 2 }}>
                <Grid container xs={4}>
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Networks</Typography>
                </Grid>
                <Grid container xs={4} sm={4} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                    <Button color="info" variant="contained" sx={{ ml: "auto" }} onClick={() => setCreatingNetwork(true)}>Create Network</Button>
                </Grid>
            </Grid>
            <CreateNetworkForward selectedNetwork={selectedNetwork} node={node} open={creatingNetworkForward} />
            {selectedNetwork ?
                <OpenFloatingIPPort setOpen={setOpeningFloatingIPPort} open={openingFloatingIPPort} node={node} selectedNetwork={selectedNetwork} selectedForward={selectedForward} />
                : ""}
            <SideLayout listItems={reformatItemList(networks, "name", "name", "type", "used_by")} thirdItemFormatter={(item) => {
                return networks.find(net => net.name === item).config["ipv4.address"] + " " + networks.find(net => net.name === item).config["ipv6.address"];
            }} FarAction={(id) => {
                return (
                    <Button sx={{ ml: "auto", mt: "auto", mb: "auto" }} variant="contained" color="error">Delete</Button>
                )
            }} FarSection={({ id }) => {
                return (
                    <>
                        <Grid container direction="column" xs={6} sx={{ mt: "auto", mb: "auto", ml: "auto" }}>
                            <Typography variant="h6" align="center">{prettyBytes(networks.find(net => net.name == id).state.counters.bytes_sent)}</Typography>
                            <Typography align="center">Sent</Typography>
                        </Grid>
                        <Grid container direction="column" xs={6} sx={{ mt: "auto", mb: "auto", ml: "auto" }}>
                            <Typography variant="h6" align="center">{prettyBytes(networks.find(net => net.name == id).state.counters.bytes_received)}</Typography>
                            <Typography align="center">Recieved</Typography>
                        </Grid>
                    </>
                )
            }} sections={[
                {
                    title: "Floating IPs",
                    action: (item) => {
                        setSelectedNetwork(networks.find(net => net.name === item));
                        return (
                            <Button onClick={() => setCreatingNetworkForward(true)} sx={{ ml: "auto", mt: "auto", mb: "auto" }} variant="contained" color="info">Add Floating IP</Button>
                        )
                    },
                    formatter: (item) => {
                        setSelectedNetwork(networks.find(net => net.name === item));
                        return (
                            <>
                                {networks.find(net => net.name === item).forwards.length > 0 ? networks.find(net => net.name === item).forwards.map((forward, index) => {
                                    return (
                                        <Accordion key={index} sx={{ backgroundColor: "background.default" }}>
                                            <AccordionSummary onClick={(e) => setSelectedForward(forward)} expandIcon={<ExpandMore />}>
                                                <Grid container direction="column">
                                                    <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">{forward.listen_address}</Typography>
                                                    <Typography sx={{ mt: "auto", mb: "auto" }} color="text.secondary" fontFamily="Poppins">{forward.description}</Typography>

                                                </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container direction="column">
                                                    <Grid container direction="row">
                                                        <Typography fontWeight={600} sx={{ mb: "auto", mt: "auto" }}>Ports</Typography>
                                                        <Button sx={{ ml: "auto", mb: "auto", mt: "auto" }} variant="contained" color="info" onClick={() => setOpeningFloatingIPPort(true)}>Open Port</Button>
                                                    </Grid>
                                                    {forward.ports.length == 0 ?
                                                        <Fade in={forward.ports.length == 0}>
                                                            <Paper sx={{ p: 2, mt: 1, mr: 15, ml: 15 }}>
                                                                <Grid container direction="column">
                                                                    <Typography fontWeight={500} align="center">No Ports Open</Typography>
                                                                    <Button sx={{ ml: "auto", mr: "auto", mt: 1 }} variant="contained" color="info" onClick={() => setOpeningFloatingIPPort(true)}>Open Port</Button>
                                                                </Grid>
                                                            </Paper>
                                                        </Fade>

                                                        : ""}
                                                    {forward.ports.map((port, index) => {
                                                        return (
                                                            <Fade key={index} in={true}>
                                                                <Paper sx={{ p: 1, mt: 1 }}>
                                                                    <Grid container sx={{ mt: "auto", mb: "auto" }}>
                                                                        <Typography variant="h6">{port.description}</Typography>
                                                                        <Typography sx={{ ml: "auto", mt: "auto", mb: "auto", mr: 5 }}>{port.target_address}:{port.target_port} ➡️ {forward.listen_address}:{port.listen_port}</Typography>
                                                                        <Button variant="contained" size="small" color="error" onClick={() => {
                                                                            axios.patch(`/api/v1/nodes/${node.id}/networks/${selectedNetwork.name}/forwards/${forward.listen_address}`, {
                                                                                ports: [
                                                                                    ...forward.ports.filter((p, i) => i !== index)
                                                                                ]
                                                                            }).then(() => router.replace(router.asPath));

                                                                        }}>Delete</Button>
                                                                    </Grid>
                                                                </Paper>
                                                            </Fade>
                                                        )
                                                    })}
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })
                                    : <Grid container direction="column">
                                        <Typography fontWeight={500} align="center">No Floating IPs</Typography>
                                        <Button onClick={() => setCreatingNetworkForward(true)} sx={{ mr: "auto", ml: "auto", mt: 1 }} variant="contained" color="info">Add One</Button>
                                    </Grid>}
                                {

                                }
                            </>
                        )
                    }
                },
                {
                    title: "Connected Devices", formatter: (item) => {
                        return (
                            networks.find(net => net.name === item).leases.map(lease => {
                                return (
                                    <>
                                        <Paper sx={{ backgroundColor: "background.default", mt: 1, mb: 1, p: 2 }}>
                                            <Grid container>
                                                <Grid container direction="row">
                                                    <Typography fontWeight="bold" sx={{ mr: .5 }}>{lease.instance ? lease.instance.name : lease.hostname}</Typography>
                                                    <Tooltip title="MAC Address">
                                                        <Typography color="text.secondary">{lease.hwaddr}</Typography>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid container direction="row">
                                                    <Grid container direction="column" xs={3}>
                                                        <Typography fontWeight={500} sx={{ mr: .5 }}>IP Address{lease.instance ? "" : "es"}</Typography>
                                                        <Typography sx={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "100%" }} color="text.secondary">{lease.address}</Typography>
                                                        <Typography sx={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "100%" }} color="text.secondary">{lease.address2}</Typography>
                                                    </Grid>
                                                    {lease.instance ?
                                                        <>
                                                            <Grid container direction="column" xs={3}>
                                                                <Typography fontWeight={500} sx={{ mr: .5 }}>Interface</Typography>
                                                                {Object.keys(lease.instance.state.network).map((key, index) => {
                                                                    return (
                                                                        lease.instance.state.network[key].addresses.map((address, index) => {
                                                                            return (
                                                                                (lease.instance.state.network[key].addresses[index].address == lease.address) || (lease.instance.state.network[key].addresses[index].address == lease.address2) ?
                                                                                    <>
                                                                                        <Typography color="text.secondary">{key}</Typography>
                                                                                    </> : ""
                                                                            )
                                                                        })
                                                                    )
                                                                })}
                                                            </Grid>
                                                            <Grid container direction="column" xs={4} sx={{ ml: "auto" }}>
                                                                <Typography align="center" fontWeight={500} sx={{ mr: .5 }}>Traffic</Typography>
                                                                <Grid container direction="row">
                                                                    <Grid container direction="column" xs={6}>
                                                                        <Typography variant="h6" align="center">{prettyBytes(lease.instance.state.total_out)}</Typography>
                                                                        <Typography align="center">Sent</Typography>
                                                                    </Grid>
                                                                    <Grid container direction="column" xs={6}>
                                                                        <Typography variant="h6" align="center">{prettyBytes(lease.instance.state.total_in)}</Typography>
                                                                        <Typography align="center">Recieved</Typography>
                                                                    </Grid>
                                                                </Grid>

                                                            </Grid>
                                                        </>
                                                        : ""}

                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </>
                                );
                            })
                        )
                    }
                }]} />
        </>
    )
}

Networks.getLayout = (page) => {
    return (
        <NodeStore.Provider>
            <Navigation page="networks">{page}</Navigation>
        </NodeStore.Provider>
    )
}