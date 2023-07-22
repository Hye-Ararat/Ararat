import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { client, validateSession } from "@/lib/oidc";
import { formatDate } from "@/lib/util";
import { LxdInstance, LxdSnapshot, NodeLxdInstance } from "@/types/instance";
import { Flex, Title, Button, TextInput, Text, Paper, SimpleGrid, Checkbox, Accordion, Divider, Loader } from "@mantine/core";
import { getCookie } from "cookies-next";
import { connectOIDC } from "js-lxd";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import prettyBytes from "pretty-bytes";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

export async function getServerSideProps({ req, res, params, query }: GetServerSidePropsContext) {
    if (!params || !params.instance || !params.node) return redirect("/instances");
    var valid = await validateSession((req.cookies as any).access_token)
    if (!valid) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return redirect("/authentication/login")
    };
    try {

        let instance: NodeLxdInstance | undefined = await fetchInstance((params.instance as string), (params.node as string), (req.cookies.access_token as string))
        if (!instance) return redirect('/instances');
        const client = connectOIDC(instance?.node.url, (req.cookies as any).access_token)
        const instanceState = await client.get(`/instances/${instance.name}/state`)
        let networks = instanceState.data.metadata.network
        console.log(networks)
        if (!networks) networks = {};
        Object.keys((instance.devices)).forEach((device) => {
            if (instance.devices[device].type != "nic") return;
            if (!Object.keys(networks).includes(device)) {
                networks[device] = {
                    addresses: [],
                    counters: {
                        bytes_sent: 0,
                        bytes_received: 0
                    },
                    type: "broadcast",
                    network: instance.devices[device].network,
                    state: "Unknown"
                }
            } else {
                networks[device].network = instance.devices[device].network
            }
        });
        console.log(networks)
        console.log(instance.devices)
        return {
            props: {
                instance: instance,
                networks
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceNetworks({ instance, networks }: { instance: NodeLxdInstance, networks: any[] }) {
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    const [floatingIps, setFloatingIps] = useState(null);
    const router = useRouter();
    useEffect(() => {
        let forwards = [];
        const client = connectOIDC(instance.node.url, access_token);
        Object.keys((networks)).forEach((network) => {
            if (networks[network].network) {
                async function getThings() {
                    if (forwards.filter((forward) => forward.network == networks[network].network).length == 0) {
                        let dat = await client.get(`/networks/${networks[network].network}/forwards?recursion=1`);
                        dat = dat.data.metadata;
                        dat[0].network = networks[network].network;
                        console.log(dat)
                        forwards.push(dat);
                        setFloatingIps(forwards);
                        console.log(forwards)
                    }
                }
                getThings();
            }
        })
    }, [])
    return (
        <>
            <InstanceShell instance={instance} />
            <Flex mt="md" mb="md">
                <Title order={4} my="auto">Networks</Title>
                <Button ml="auto" my="auto" variant="light" color="green" onClick={() => {
                    const audio = new Audio("/audio/popup.mp3");
                    audio.play();
                }}>Attack Network</Button>
            </Flex>
            <Accordion variant="separated">
            {Object.keys(networks).map((nic, index) => {
                return (
                    <Accordion.Item value={nic} key={nic}>
                        <Accordion.Control>
                        <SimpleGrid cols={6}>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {nic}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Name
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    <Flex direction="column">
                              {networks[nic].network ? networks[nic].network : "N/A"}
                                    </Flex>
                                </Text>

                                <Text c="dimmed" fz="xs">
Network                             
   </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>

                                <Flex direction="column">
                                {networks[nic].state}
                                    </Flex>                                </Text>
                                <Text c="dimmed" fz="xs">
                                    State
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>

                                <Flex direction="column">
                                {networks[nic].type}
                                    </Flex>                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Type
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {prettyBytes(networks[nic].counters.bytes_sent)}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Sent
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {prettyBytes(networks[nic].counters.bytes_received)}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Recieved
                                </Text>
                            </div>
                   
                        </SimpleGrid>
                        </Accordion.Control>
                        <Accordion.Panel>
                         {instance.devices[nic] ?
                         <>
                                                  <Divider mb="md" />
                         <Flex mb="md">
                                    <Title order={5} my="auto">Ports</Title>
                                    <Button my="auto" variant="light" color="green" ml="auto" size="xs" onClick={() => {
                                       // setSelectedNetwork(network.name)
                                        //setCreatingFloatingIp(true)
                                        const audio = new Audio("/audio/popup.mp3");
                                        audio.play();
                                    }}>Open Port</Button>
                                </Flex>
                                <Flex>
                                {floatingIps ? floatingIps.map((ips) => {
                                    return (
                                    ips.map((ip) => {
                                        return (
                                            
                                            networks[nic].addresses.map((address) => {
                                                return (
                                               JSON.stringify(ips).includes(address.address) ? 
                                               ip.ports.map((port) => {
                                                return (
                                                    <Paper withBorder style={{ padding: 10, width: "100%" }} mb={"xs"}>
                             <SimpleGrid cols={3}>
                                                                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                                        <Text fz="md" fw={550}>
                                                                            {port.target_address + ":" + port.target_port + " ➡ " + ip.listen_address + ":" + port.listen_port}
                                                                        </Text>
                                                                        <Text c="dimmed" fz="xs">
                                                                            {port.description ? port.description : "No description"}
                                                                        </Text>
                                                                    </div>
                                                                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                                        <Text fz="md" fw={550}>
                                                                            {port.protocol}
                                                                        </Text>
                                                                        <Text c="dimmed" fz="xs">
                                                                            Protocol
                                                                        </Text>
                                                                    </div>
                                                                    <div style={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}>
                                                                        <Flex direction="column" my="auto">
                                                                            <Button variant="light" color="red" size="xs" my="auto" onClick={async () => {
                                                                                const client = connectOIDC(instance.node.url, getCookie("access_token"));
                                                                                let allPorts = ip.ports;
                                                                                allPorts.splice(allPorts.indexOf(port), 1);
                                                                                await client.put(`/networks/${address.network}/forwards/${ip.listen_address}`, {
                                                                                    ports: allPorts
                                                                                });
                                                                                router.push(router.asPath)
                                                                            }}>Close Port</Button>
                                                                        </Flex>
                                                                    </div>
                                                                </SimpleGrid>
                                                    </Paper>
                                                )
                                               })
                                               : ""
                                                )
                                            })
                                        )
                                    })
                                    )
                                }): <Loader mb="md" style={{marginRight: "auto", marginLeft: "auto"}} /> }
                                </Flex>
                                </>
                                : ""}
                                <Divider mb="md" mt={instance.devices[nic] ? "md" : 0} />
                        <Title order={5}>IP Addresses</Title>
                        <SimpleGrid cols={2}>
                            <div>
                        <Title order={6}>IPv4</Title>
                        {networks[nic].addresses.filter((addr) => addr.family == "inet").map((addr) => {
                                        return <Text truncate={true}>{addr.address}</Text>
                                    })}
                                    </div>
                                    <div>
                        <Title order={6}>IPv6</Title>
                        {networks[nic].addresses.filter((addr) => addr.family == "inet6").map((addr) => {
                                        return <Text truncate={true}>{addr.address}</Text>
                                    })}
                                    </div>
                                    </SimpleGrid>
                        </Accordion.Panel>
                        </Accordion.Item>

                )
            })}
            </Accordion>
        </>
    )
}