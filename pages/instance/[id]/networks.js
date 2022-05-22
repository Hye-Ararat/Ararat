import Footer from "../../../components/footer"
import Navigation from "../../../components/instance/Navigation"
import prisma from "../../../lib/prisma";
import { InstanceStore } from "../../../states/instance"
import hyexd from "hyexd";
import getNodeEnc from "../../../lib/getNodeEnc";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowForward, Edit, ExpandMore } from "@mui/icons-material";
import prettyBytes from "pretty-bytes";


export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false
            }
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    const instance = await prisma.instance.findUnique({
        where: {
            id: query.id
        },
        include: {
            node: true
        }
    })
    let networks;
    const client = new hyexd("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    })
    networks = await client.instance(query.id).data;
    networks = Object.keys(networks.metadata.devices).filter(device => networks.metadata.devices[device].type === "nic");
    let instState = (await client.instance(query.id).state).metadata.network;
    return {
        props: { networks, node: instance.node.id, instState }
    }

}

export default function Networks({ networks, node, instState }) {
    console.log(networks)
    console.log(instState)
    const [attachingNic, setAttachingNic] = useState(false);
    const [nodeNets, setNetworks] = useState(null);
    const [realNodeNets, setRealNodeNets] = useState(null);
    const [tempNic, setTempNic] = useState({
        type: "nic",
        network: null
    });
    const [selected, setSelected] = useState(0)
    const [viewingAdvanced, setViewingAdvanced] = useState(null);

    const [addingNetworkForward, setAddingNetworkForward] = useState(null);
    const [networkForwards, setNetworkForwards] = useState(null);
    const [autoCompleteNetworkForwards, setAutoCompleteNetworkForwards] = useState(null);
    const [tempNetworkForward, setTempNetworkForward] = useState({});
    const instanceState = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
    };
    const mobile = useMediaQuery(useTheme().breakpoints.down("md"));
    useEffect(() => {
        axios.get(`/api/v1/nodes/${node}/networks`).then(res => {
            res.data.metadata = res.data.metadata.filter(network => network.type != "loopback" && network.type != "physical")
            setRealNodeNets(res.data.metadata);
            let tempNetworks = [];
            let tempNetworkForwards = [];
            let tempACNetworkForwards = [];
            res.data.metadata.forEach(network => {
                console.log(network)
                axios.get(`/api/v1/nodes/${node}/networks/${network.name}/forwards`).then(res => {
                    res.data.metadata.forEach(forward => {
                        tempNetworkForwards.push({
                            ...forward,
                            network: network.name
                        });
                        tempACNetworkForwards.push({
                            label: forward.listen_address,
                            value: forward.listen_address
                        })
                    })
                })
                tempNetworks.push({
                    label: network.name,
                    value: network.name
                })
            })
            setNetworks(tempNetworks)
            console.log(tempNetworkForwards)
            setTimeout(() => {
                setNetworkForwards(tempNetworkForwards);
            }, 200)
            setAutoCompleteNetworkForwards(tempACNetworkForwards);
            console.log(tempNetworkForwards);
            console.log(tempNetworks)
        })
    }, [])
    return (
        <>
            <Dialog open={attachingNic}>
                <DialogTitle>
                    <Typography align="center" fontFamily="Poppins" variant="h6">Attach a NIC</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography align="center">
                        Select a network to attach
                    </Typography>
                    <Grid container sx={{ mt: 2 }}>
                        <Autocomplete sx={{ ml: "auto", mr: "auto" }} onChange={(e, value) => {
                            console.log(value.value)
                            console.log(realNodeNets.find(network => network.name === value.value))
                            let nic = tempNic;
                            nic = { ...nic, network: value.value }
                            setTempNic({})
                            setTimeout(() => {
                                setTempNic(nic)
                            }, 50)
                        }} options={nodeNets} getOptionLabel={option => option.label} renderInput={(params) => <TextField {...params} placeholder="Select Network" sx={{ width: "258px" }} />} />
                    </Grid>
                    {tempNic.network ?
                        realNodeNets.find(network => network.name == tempNic.network).type == "bridge" ?
                            <>

                                {viewingAdvanced ? <>
                                    <Typography align="center" sx={{ mt: 1, mb: 1 }}>Advanced Configuration</Typography>
                                    <Accordion expanded={viewingAdvanced == "identification"} onClick={() => setViewingAdvanced("identification")}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography align="center" fontFamily="Poppins" variant="h6">Identification</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container direction="row">
                                                <Tooltip title="The name of the interface inside the instance">
                                                    <TextField sx={{ maxWidth: "110px", mr: 2 }} placeholder="Name" onChange={(e) => setTempNic({ ...tempNic, name: e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="The name of the interface inside the host">
                                                    <TextField sx={{ maxWidth: "110px", mr: 2 }} placeholder="Host name" onChange={(e) => setTempNic({ ...tempNic, host_name: e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="The MTU of the new interface">
                                                    <TextField sx={{ maxWidth: "100px", mr: 2 }} placeholder="MTU" onChange={(e) => setTempNic({ ...tempNic, mtu: e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="The MAC address of the new interface">
                                                    <TextField sx={{ maxWidth: "300px", mr: 2, mt: 2 }} placeholder="MAC address" onChange={(e) => setTempNic({ ...tempNic, hwaddr: e.target.value })} />
                                                </Tooltip>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={viewingAdvanced == "limits"} onClick={() => setViewingAdvanced("limits")}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography align="center" fontFamily="Poppins" variant="h6">Limits</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container direction="row">
                                                <Tooltip title="I/O Limit for incoming traffic">
                                                    <TextField sx={{ maxWidth: "130px", mr: 2 }} placeholder="Ingress Limit" onChange={(e) => setTempNic({ ...tempNic, "limits.ingress": e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="I/O Limit for outgoing traffic">
                                                    <TextField sx={{ maxWidth: "130px", mr: 2 }} placeholder="Egress Limit" onChange={(e) => setTempNic({ ...tempNic, "limits.egress": e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="I/O limit for both ingoing and outgoing traffic (set this if both are ingress and egress would be the same)">
                                                    <TextField sx={{ maxWidth: "130px", mr: 2 }} placeholder="Input/Output Limit" onChange={(e) => setTempNic({ ...tempNic, "limits.max": e.target.value })} />
                                                </Tooltip>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={viewingAdvanced == "address"} onClick={() => setViewingAdvanced("address")}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography align="center" fontFamily="Poppins" variant="h6">IP Assignment</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container direction="row">
                                                <Tooltip title="IPv4 address to assign instance through DHCP">
                                                    <TextField sx={{ maxWidth: "150px", mr: 2 }} placeholder="IPv4 Address" onChange={(e) => setTempNic({ ...tempNic, "ipv4.address": e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="IPv6 address to assign instance through DHCP">
                                                    <TextField sx={{ maxWidth: "200px", mr: 2 }} placeholder="IPv6 Address" onChange={(e) => setTempNic({ ...tempNic, "ipv6.address": e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="Comma delimited list of IPv4 static routes to add on host to NIC">
                                                    <TextField sx={{ maxWidth: "300px", mr: 2, mt: 2 }} placeholder="IPv4 Routes" onChange={(e) => setTempNic({ ...tempNic, "ipv4.routes": e.target.value })} />
                                                </Tooltip>
                                                <Tooltip title="Comma delimited list of IPv6 static routes to add on host to NIC">
                                                    <TextField sx={{ maxWidth: "500px", mr: 2, mt: 2 }} placeholder="IPv6 Routes" onChange={(e) => setTempNic({ ...tempNic, "ipv6.routes": e.target.value })} />
                                                </Tooltip>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </> : <Button sx={{ mt: 2 }} onClick={() => setViewingAdvanced("identification")}>View Advanced Options</Button>}
                            </>
                            : ""
                        : ""}
                </DialogContent>
                <DialogActions>
                    <Button variant="success" onClick={() => {
                        axios.patch("/api/v1/instances/" + instanceState.data.id, {
                            devices: {
                                ...instanceState.data.devices,
                                [tempNic.name ? tempNic.name : `eth${(Object.keys(instanceState.data.devices).filter(network => network.includes("eth"))).length}`]: tempNic
                            }
                        }).then(() => {
                            setTempNic({});
                            setViewingAdvanced(null);
                            setAttachingNic(false);
                        })
                    }}>Attach</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addingNetworkForward}>
                <DialogTitle>
                    <Typography align="center" fontFamily="Poppins" variant="h6">Attach Floating IP</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography align="center">Select a Floating IP to attach</Typography>
                    <Grid container sx={{ mt: 2 }}>
                        {autoCompleteNetworkForwards ?
                            <Autocomplete sx={{ ml: "auto", mr: "auto" }} onChange={(e, value) => {
                                console.log(value.value)
                                let netF = tempNetworkForward;
                                netF = { ...netF, listen_address: value.value, ports: [{}] }
                                setTempNetworkForward({});
                                setTimeout(() => {
                                    setTempNetworkForward(netF);
                                    console.log(netF)
                                }, 50)
                            }} options={autoCompleteNetworkForwards} getOptionLabel={option => option.label} renderInput={(params) => <TextField {...params} placeholder="Select a Network Forward" sx={{ width: "258px" }} />} />
                            : ""}
                    </Grid>

                    {tempNetworkForward.listen_address ?
                        <>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Typography align="center" fontWeight={500} fontFamily="Poppins">Open Port</Typography>
                            <Grid container sx={{ mt: 2 }}>
                                <Grid container>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Address</Typography>
                                    <Autocomplete sx={{ mb: "auto", ml: "auto" }} onChange={(e, value) => {
                                        console.log(value)
                                        let temp = tempNetworkForward;
                                        console.log(temp)
                                        setTempNetworkForward({});
                                        setTimeout(() => {
                                            setTempNetworkForward({ ...temp, ports: [{ ...temp.ports[0], target_address: value.address }] })
                                        }, 50)
                                    }
                                    } value={tempNetworkForward.ports[0] ? tempNetworkForward.ports[0] : null} options={instState[networks[selected]].addresses.filter(address => address.family == "inet")} getOptionLabel={(item) => item.address ? item.address : item.target_address ? item.target_address : ""} renderInput={(params) => <TextField {...params} variant="standard" placeholder="IP Address" sx={{ width: "248px" }} />} />
                                </Grid>
                                <Grid container sx={{ mt: 1 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Description</Typography>
                                    <TextField sx={{ mb: "auto", ml: "auto" }} placeholder="Web Server" variant="standard" onChange={(e) => {
                                        let temp = tempNetworkForward;
                                        setTempNetworkForward({ ...temp, ports: [{ ...temp.ports[0], description: e.target.value }] })
                                    }} />
                                </Grid>
                                <Grid container sx={{ mt: 1 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Protocol</Typography>
                                    <Select variant="standard" sx={{ mb: "auto", ml: "auto" }} value={tempNetworkForward.ports[0] ? tempNetworkForward.ports[0].protocol : null} onChange={(e) => {
                                        let temp = tempNetworkForward;
                                        setTempNetworkForward({ ...temp, ports: [{ ...temp.ports[0], protocol: e.target.value }] })
                                    }}>
                                        <MenuItem value="tcp">TCP</MenuItem>
                                        <MenuItem value="udp">UDP</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid container sx={{ mt: 1 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Target Port(s)</Typography>
                                    <Tooltip title="Can add mulitple ports by seperating with commas Ex: (80,81,8080-8090)">
                                        <TextField sx={{ mb: "auto", ml: "auto" }} placeholder="443" variant="standard" onChange={(e) => {
                                            let temp = tempNetworkForward;
                                            setTempNetworkForward({ ...temp, ports: [{ ...temp.ports[0], target_port: e.target.value }] })
                                        }} />
                                    </Tooltip>
                                </Grid>
                                <Grid container sx={{ mt: 1 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Listen Port(s)</Typography>
                                    <Tooltip title="Can add mulitple ports by seperating with commas Ex: (80,81,8080-8090)">
                                        <TextField sx={{ mb: "auto", ml: "auto" }} placeholder="443" variant="standard" onChange={(e) => {
                                            let temp = tempNetworkForward;
                                            setTempNetworkForward({ ...temp, ports: [{ ...temp.ports[0], listen_port: e.target.value }] })
                                        }} />
                                    </Tooltip>
                                </Grid>
                            </Grid>

                        </>
                        : ""}
                </DialogContent>
                {tempNetworkForward.ports ? tempNetworkForward.ports[0].listen_port ?
                    <DialogActions>
                        <Button variant="contained" color="success" onClick={() => {
                            axios.patch(`/api/v1/nodes/${node}/networks/${instanceState.data.devices[networks[selected]].network}/forwards/${tempNetworkForward.listen_address}`, {
                                ...tempNetworkForward
                            }).then(() => {
                                console.log("Success")
                            })
                        }}>Attach</Button>
                    </DialogActions>
                    : "" : ""}
            </Dialog>
            <Grid container direction="row" sx={{ mb: 2 }}>
                <Grid container xs={4}>
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Networks</Typography>
                </Grid>
                <Grid container xs={4} sm={4} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                    <Button color="info" variant="contained" sx={{ ml: "auto" }} onClick={() => setAttachingNic(true)}>Attach NIC</Button>
                </Grid>
            </Grid>
            {networks.length <= 0 ?
                <Grid container direction="column">
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto", mr: "auto", ml: "auto" }}>This Instance Has No Networks</Typography>
                    <Button color="primary" variant="contained" sx={{ mr: "auto", ml: "auto", mt: 1 }} onClick={() => setAttachingNic(true)}>Attach a NIC</Button>
                </Grid>
                : instanceState.data ? <Stack spacing={2} direction={mobile ? "column" : "row"} divider={mobile ? "" : <Divider orientation="vertical" flexItem />}>
                    <Grid container xs={12} sm={12} md={3}>
                        <List dense sx={{ backgroundColor: "background.paper", width: "100%" }}>
                            {networks.map((network, index) => {
                                console.log(network)
                                console.log(instanceState.data)
                                return (
                                    <ListItem selected={selected == index} disablePadding key={index} onClick={() => setSelected(index)} secondaryAction={<Checkbox sx={{ ml: "auto" }} />}>
                                        <ListItemButton>
                                            <ListItemText primary={network} secondary={instanceState.data.devices[network].network} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Grid>
                    <Grid container xs={12} sm={12} md={9} direction="column">
                        <Divider sx={{ mb: 1.5 }} />
                        <Grid container direction="row">
                            <Grid container direction="column" xs={7} sm={6.5} md={5}>
                                <Grid container direction="row">
                                    {!mobile ?
                                        <>
                                            <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>{networks[selected]}</Typography>
                                            <Typography fontWeight={400} variant="h6" color="text.secondary" sx={{ mt: "auto", mb: "auto", ml: .8 }}>{instanceState.data.devices[networks[selected]].network}</Typography>
                                        </>
                                        : ""}
                                </Grid>
                                {realNodeNets ?
                                    <Grid container direction="row" sx={{ mt: mobile ? "auto" : "", mb: mobile ? "auto" : "" }}>
                                        <>
                                            <Typography color="text.secondary" sx={{ mt: "auto", mb: "auto" }}>{realNodeNets.find(nodeNet => nodeNet.name == instanceState.data.devices[networks[selected]].network).type}</Typography>
                                            <Typography>
                                                <Divider orientation="vertical" sx={{ mr: .5, ml: .5 }} />
                                            </Typography>
                                        </>
                                        {instState ?
                                            <Tooltip title="MAC Address">
                                                <Typography color="text.secondary" sx={{ mt: "auto", mb: "auto" }}>{instState[networks[selected]].hwaddr}</Typography>
                                            </Tooltip>
                                            : ""}
                                    </Grid>
                                    : <Skeleton />}
                            </Grid>
                            <Grid container direction="row" xs={3} sm={3} md={6} sx={{ ml: "auto" }}>
                                {!mobile ?
                                    <>
                                        <Grid container direction="column" xs={4} sx={{ mt: "auto", mb: "auto" }}>
                                            {instState ?
                                                <>
                                                    <Typography variant="h5" align="center">{prettyBytes(instState[networks[selected]].counters.bytes_sent)}</Typography>
                                                    <Typography align="center">Sent</Typography>
                                                </>
                                                : ""}
                                        </Grid>
                                        <Grid container direction="column" xs={4} sx={{ ml: "auto" }}>
                                            {instState ?
                                                <>
                                                    <Typography variant="h5" align="center">{prettyBytes(instState[networks[selected]].counters.bytes_received)}</Typography>
                                                    <Typography align="center">Recieved</Typography>
                                                </>
                                                : ""}
                                        </Grid>
                                    </>
                                    : ""}
                                <Grid container direction="column" xs={12} sm={12} md={4} sx={{ ml: "auto" }}>
                                    <Tooltip title="Detach NIC">
                                        <Button variant="contained" color="error" onClick={() => {
                                            let tempDevs = { ...instanceState.data.devices };
                                            delete tempDevs[networks[selected]];
                                            console.log(tempDevs)
                                            axios.put("/api/v1/instances/" + instanceState.data.id, {
                                                devices: {
                                                    ...tempDevs
                                                }
                                            }).then((e) => {
                                                console.log(e.data)
                                                setSelected(0);
                                            })
                                        }
                                        } sx={{ mt: "auto", mb: "auto", ml: "auto" }}>Detach</Button>
                                    </Tooltip>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>IP Addresses</Typography>
                        <Paper sx={{ p: 2 }}>
                            <>
                                <Grid container direction="row">
                                    <Grid container direction="column" xs={5}>
                                        <Typography fontWeight={500}>IPv4</Typography>
                                        {instState ?
                                            instState[networks[selected]].addresses.filter(address => address.family == "inet").length <= 0 ?
                                                <Typography variant="body2">No IPv4 Addresses</Typography>
                                                :
                                                instState[networks[selected]].addresses.filter(address => address.family == "inet").map((address, index) => {
                                                    return (
                                                        <Typography key={index}>{address.address}</Typography>
                                                    )
                                                })


                                            : <Typography>Cannot Read While Offline</Typography>}

                                    </Grid>
                                    <Grid container direction="column" xs={5}>
                                        <Typography fontWeight={500}>IPv6</Typography>
                                        {instState ?
                                            instState[networks[selected]].addresses.filter(address => address.family == "inet6").length <= 0 ?
                                                <Typography variant="body2">No IPv6 Addresses</Typography>
                                                :
                                                instState[networks[selected]].addresses.filter(address => address.family == "inet6" && address.scope != "link").map((address, index) => {
                                                    return (
                                                        <Typography sx={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "100%" }} key={index}>{address.address}</Typography>
                                                    )
                                                })

                                            : <Typography>Cannot Read While Offline</Typography>}
                                    </Grid>
                                </Grid>
                            </>

                        </Paper>
                        <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Floating IPs</Typography>
                        <Paper sx={{ p: 2 }}>
                            {networkForwards ? networkForwards.filter(networkForward => networkForward.network == instanceState.data.devices[networks[selected]].network).length > 0 ?
                                <>
                                    {networkForwards.filter(networkForward => networkForward.network == instanceState.data.devices[networks[selected]].network).map((networkForward, index) => {
                                        return (
                                            <Accordion key={index} sx={{ backgroundColor: "background.default" }}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Grid container direction="column">
                                                        <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">{networkForward.description}</Typography>
                                                        <Typography sx={{ mt: "auto", mb: "auto" }} color="text.secondary" fontFamily="Poppins">{networkForward.listen_address}</Typography>
                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container direction="column">
                                                        <Typography fontWeight={600} sx={{ mb: 1 }}>Target Addresses</Typography>
                                                        <Grid container direction="column">
                                                            {instState[networks[selected]].addresses.filter(address => address.family == "inet").map((ip, index) => {
                                                                return (
                                                                    <Accordion key={index} sx={{ backgroundColor: "#080c12" }}>
                                                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                                                            <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">{ip.address}</Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails>
                                                                            <Typography varina="h6">Ports</Typography>
                                                                            {networkForward.ports.map((port, index) => {
                                                                                return (
                                                                                    <Paper key={index} sx={{ p: 1, mt: 1 }}>
                                                                                        <Grid container sx={{ mt: "auto", mb: "auto" }}>
                                                                                            <Typography variant="h6">{port.description}</Typography>
                                                                                            <Typography sx={{ ml: "auto", mt: "auto", mb: "auto", mr: 5 }}>{port.target_address}:{port.target_port} ➡️ {networkForward.listen_address}:{port.listen_port}</Typography>
                                                                                            <Button variant="contained" color="error">Delete</Button>
                                                                                        </Grid>
                                                                                    </Paper>
                                                                                )
                                                                            })}
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                )
                                                            })}
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    })}
                                </> :
                                <Grid container direction="column">
                                    <Typography fontWeight={500} align="center">No Floating IPs</Typography>
                                    <Button onClick={() => setAddingNetworkForward(true)} sx={{ mr: "auto", ml: "auto", mt: 1 }} variant="contained" color="info">Add One</Button>
                                </Grid>
                                : ""}

                        </Paper>
                        <Typography>
                            { }
                        </Typography>
                    </Grid>
                </Stack> : ""
            }
        </>
    )
}

Networks.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="networks">
                {page}
                <Footer />
            </Navigation>
        </InstanceStore.Provider>
    )
}