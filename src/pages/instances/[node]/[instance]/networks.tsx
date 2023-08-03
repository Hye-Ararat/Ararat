import { Network } from "@/components/instances/CreateInstance";
import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { client, validateSession } from "@/lib/oidc";
import { formatDate } from "@/lib/util";
import { LxdInstance, LxdSnapshot, NodeLxdInstance } from "@/types/instance";
import { Flex, Title, Button, TextInput, Text, Paper, SimpleGrid, Checkbox, Accordion, Divider, Loader, Modal, useMantineTheme, Autocomplete, Select } from "@mantine/core";
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
        const allNetworks = (await client.get(`/networks?recursion=1`)).data.metadata;
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
                networks,
                allNetworks
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceNetworks({ instance, networks, allNetworks }: { instance: NodeLxdInstance, networks: any[], allNetworks: any[] }) {
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    const [floatingIps, setFloatingIps] = useState(null);
    const [openingPort, setOpeningPort] = useState(false);
    const [attachNetwork, setAttachNetwork] = useState(false);
    const [selectedNic, setSelectedNic] = useState(null);
    const [autocompleteIps, setAutocompleteIps] = useState([]);
    const [supportedFloatingIps, setSupportedFloating] = useState([]);
    const [selectedListen, setSelectedListen] = useState(null);
    const [portConfig, setPortConfig] = useState({
        protocol: "tcp"
    })
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
                        if (dat[0]) {
                            dat[0].network = networks[network].network;
                        }
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
    useEffect(() => {
        if (selectedNic) {
            let addresses = networks[selectedNic].addresses;
            let formattedAddrs = [];
            addresses.forEach((address) => {
                formattedAddrs.push({ label: address.address, value: address.address })
            })
            setAutocompleteIps(formattedAddrs);
            let network = networks[selectedNic].network;
            let supportedFloating = [];
            floatingIps.forEach((floatingIp) => {
                floatingIp.forEach((ip) => {
                    if (ip.network == network) {
                        supportedFloating.push({ label: ip.listen_address, value: ip.listen_address });
                    }
                })
            })
            setSupportedFloating(supportedFloating);
        }
    }, [selectedNic])
    const theme = useMantineTheme();
    var [currentConfig, setCurrentConfig] = useState({
        architecture: instance.architecture,
        config: instance.config,
        devices: instance.devices,
        empheral: instance.ephemeral,
        profiles: instance.profiles,
        stateful: instance.stateful,
        description: instance.description
    })
    const [newDeviceConfig, setNewDeviceConfig] = useState({
        type: "nic"
    })
    const [newDeviceName, setNewDeviceName] = useState(null);
    const [formattedNetworks, setFormattedNetworks] = useState()
    useEffect(() => {
        let formatted = [];
        allNetworks.forEach((network) => {
            if (network.managed) {
            formatted.push({label: network.name, value: network.name})
            }
        })
        setFormattedNetworks(formatted);
    }, [])
    return (
        <>
            <InstanceShell instance={instance} />
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} onClose={() => setAttachNetwork(false)} opened={attachNetwork} title={`Attach network`}>
                <>
                <TextInput value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} label="Interface Name" placeholder="eth0" />
                <Select onChange={(e) => {
                    let newConf = {...newDeviceConfig};
                    newConf.network = e;
                    setNewDeviceConfig(newConf);
                }} value={newDeviceConfig.network} label="Network" placeholder="Network" data={formattedNetworks} />
                <TextInput onChange={(e) => {
                    let newConf = {...newDeviceConfig};
                    newConf["address.ipv4"] = e.target.value;
                    setNewDeviceConfig(newConf)
                }} value={newDeviceConfig["address.ipv4"]} label="IPv4 Address" placeholder="Leave blank for DHCP" />
                <TextInput onChange={(e) => {
                        let newConf = {...newDeviceConfig};
                        newConf["address.ipv6"] = e.target.value;
                        setNewDeviceConfig(newConf)
                }} value={newDeviceConfig["address.ipv6"]} label="IPv6 Address" placeholder="Leave blank for DHCP" />
                <TextInput onChange={(e) => {
                        let newConf = {...newDeviceConfig};
                        newConf["limits.egress"] = e.target.value;
                        setNewDeviceConfig(newConf)
                }} value={newDeviceConfig["limits.egress"]} label="Egress Limit" placeholder="Leave blank for unmetered, measured in bit/s" />
                <TextInput onChange={(e) => {
                        let newConf = {...newDeviceConfig};
                        newConf["limits.ingress"] = e.target.value;
                        setNewDeviceConfig(newConf)
                }} value={newDeviceConfig["limits.ingress"]} label="Ingress Limit" placeholder="Leave blank for unmetered, measured in bit/s" />
                <Flex>
                    <Button onClick={async (e) => {
                        const client = connectOIDC(instance.node.url, access_token);
                        let newDevs = {...instance.devices}
                        newDevs[newDeviceName] = newDeviceConfig;
                        let conf = {...instance};
                        conf.devices = newDevs
                        await client.put(`/instances/${instance.name}`, conf)
                        setAttachNetwork(false);
                        router.push(router.asPath)
                    }} variant="light" color="green" ml="auto" mt="sm">Attach Network</Button>
                </Flex>
                </>
            </Modal>
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} onClose={() => setOpeningPort(false)} opened={openingPort} title={`${false ? "Edit" : "Open"} Port`}>
                <Select onChange={(e) => {
                    setSelectedListen(e)
                }} withAsterisk placeholder="Listen Address" label="Listen Address" data={supportedFloatingIps} />
                <TextInput onChange={(e) => {
                    let newConf = { ...portConfig };
                    newConf.listen_port = e.target.value;
                    setPortConfig(newConf)
                }} withAsterisk placeholder="Listen Port(s) (Ex: 25565-25575, or 25565,25566, or 443)" label="Listen Port(s)" />
                <Autocomplete onChange={(e) => {
                    let newConf = { ...portConfig };
                    newConf.target_address = e;
                    setPortConfig(newConf)
                }} withAsterisk placeholder="Target Address" label="Target Address" data={autocompleteIps} />
                <TextInput onChange={(e) => {
                    let newConf = { ...portConfig };
                    newConf.target_port = e.target.value;
                    setPortConfig(newConf)
                }} withAsterisk placeholder="Target Port(s) (Ex: 25565-25575, or 25565,25566, or 443)" label="Target Port(s)" />





                <Select withAsterisk value={portConfig.protocol} data={[{ label: "TCP", value: "tcp" }, { label: "UDP", value: "udp" }]} onChange={(e) => {
                    let newConf = { ...portConfig };
                    newConf.protocol = e;
                    setPortConfig(newConf)
                }} label="Protocol" />
                <TextInput onChange={(e) => {
                    let newConf = { ...portConfig };
                    newConf.description = e.target.value;
                    setPortConfig(newConf)
                }} placeholder="Description" label="Description" />
                <Flex>
                    <Button variant="light" color="green" ml="auto" mt="xs" onClick={async () => {
                        const client = connectOIDC(instance.node.url, access_token);
                        const existingConfig = (await client.get(`/networks/${instance.devices[selectedNic].network}/forwards/${selectedListen}`)).data.metadata
                        let ports = [...existingConfig.ports, portConfig]
                        await client.put(`/networks/${instance.devices[selectedNic].network}/forwards/${selectedListen}`, {
                            ports: ports
                        })
                        setOpeningPort(false);
                        router.push(router.asPath)
                    }}>Open Port</Button>
                </Flex>
            </Modal>
            <Flex mt="md" mb="md">
                <Title order={4} my="auto">Networks</Title>
                <Button ml="auto" my="auto" variant="light" color="green" onClick={() => {
                    const audio = new Audio("/audio/popup.mp3");
                    audio.play();
                    setAttachNetwork(true)
                }}>Attach Network</Button>
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
                                                setSelectedNic(nic)
                                                setOpeningPort(true)
                                                const audio = new Audio("/audio/popup.mp3");
                                                audio.play();
                                            }}>Open Port</Button>
                                        </Flex>
                                        <Flex direction="column">
                                            {floatingIps ? floatingIps.map((ips) => {
                                                return (
                                                    ips.map((ip) => {
                                                        return (

                                                            networks[nic].addresses.map((address) => {
                                                                return (
                                                                    JSON.stringify(ips).includes(address.address) ?
                                                                        ip.ports.map((port, index) => {
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
                                                                                                    console.log(ip)
                                                                                                    let allPorts = ip.ports;
                                                                                                    allPorts.splice(index, 1);
                                                                                                    console.log(allPorts)
                                                                                                    await client.put(`/networks/${instance.devices[nic].network}/forwards/${ip.listen_address}`, {
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
                                            }) : <Loader mb="md" style={{ marginRight: "auto", marginLeft: "auto" }} />}
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
                                {instance.devices[nic] ?
                                    <>
                                        <Divider my="md" />
                                        <Flex>
                                            <Button size="xs" ml="auto" variant="light" color="red">Detach Network</Button>
                                            <Button size="xs" ml="sm" variant="light" color="blue">Edit nic</Button>
                                        </Flex>
                                    </>
                                    : ""}
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>
        </>
    )
}