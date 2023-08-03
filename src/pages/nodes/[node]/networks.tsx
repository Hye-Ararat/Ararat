import NodeShell from "@/components/nodes/node/NodeShell"
import mongo from "@/lib/mongo"
import { sanitizeOne } from "@/lib/db"
import { connectOIDC } from "js-lxd"
import { Accordion, Button, Flex, SimpleGrid, Title, Text, Divider, Paper, Modal, useMantineTheme, TextInput, Switch, Select, Autocomplete } from "@mantine/core"
import prettyBytes from "pretty-bytes"
import { useState } from "react"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"

export async function getServerSideProps({ params, req }) {
    let nodeData = await mongo.db().collection("Node").findOne({ name: params.node })
    let client = connectOIDC(nodeData.url, req.cookies.access_token)
    let resources = (await client.get("/resources")).data.metadata
    let networks = (await client.get("/networks?recursion=1")).data.metadata;
    let count = 0;
    for (let network of networks) {
        if (network.managed) {
            let floatingIps = (await client.get(`/networks/${network.name}/forwards?recursion=1`)).data.metadata;;
            let state = (await client.get(`/networks/${network.name}/state`)).data.metadata;
            let leases = (await client.get(`/networks/${network.name}/leases`)).data.metadata;
            let expandedUsedBy = [];
            network.leases = leases;
            network.state = state;
            network.floatingIps = floatingIps;
            count++;
        }
    }

    while (count < networks.filter((network) => network.managed).length) {
        await new Promise(r => setTimeout(r, 5));
    }

    console.log(networks)
    return {
        props: {
            node: sanitizeOne(nodeData),
            resources: resources,
            networks: networks
        }
    }
}

export default function NodeDashboard({ node, resources, networks }) {
    const theme = useMantineTheme();
    const [creatingNetwork, setCreatingNetwork] = useState(false);
    const [editingNetwork, setEditingNetwork] = useState(false)
    const [networkConfig, setNetworkConfig] = useState({
        name: "",
        type: "bridge",
        config: {
            "ipv4.nat": "true",
            "ipv6.nat": "true"
        }
    })
    const [creatingFloatingIp, setCreatingFloatingIp] = useState(false);
    const [editingFloatingIp, setEditingFloatingIp] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [floatingIpConfig, setFloatingIpConfig] = useState({
    })
    const [creatingForward, setCreatingForward] = useState(false);
    const [editingForward, setEditingForward] = useState(false);
    const [selectedFloatingIp, setSelectedFloatingIp] = useState(null);
    const [forwardConfig, setForwardConfig] = useState({
        protocol: "tcp"
    })
    const router = useRouter();
    return (
        <>
            <NodeShell node={node} resources={resources} />
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} onClose={() => setCreatingNetwork(false)} opened={creatingNetwork} title={editingNetwork ? "Edit Network" : "Create Network"}>
                <TextInput onChange={(e) => {
                    let newConfig = { ...networkConfig };
                    newConfig.name = e.currentTarget.value;
                    setNetworkConfig(newConfig);
                }} value={networkConfig.name} withAsterisk label="Name" placeholder="Name" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...networkConfig };
                    newConfig.description = e.currentTarget.value;
                    setNetworkConfig(newConfig);
                }} value={networkConfig.description} label="Description" placeholder="Description" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...networkConfig };
                    newConfig.config["ipv4.address"] = e.currentTarget.value;
                    setNetworkConfig(newConfig);
                }} value={networkConfig.config["ipv4.address"]} label="IPv4 Address" placeholder="Leave blank for auto, type none for none" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...networkConfig };
                    newConfig.config["ipv6.address"] = e.currentTarget.value;
                    setNetworkConfig(newConfig);
                }} value={networkConfig.config["ipv6.address"]} label="IPv6 Address" placeholder="Leave blank for auto, type none for none" />
                <Switch onChange={(e) => {
                    let newConfig = { ...networkConfig };
                    newConfig.config["ipv4.nat"] = e.currentTarget.checked ? "true" : "false";
                    setNetworkConfig(newConfig);
                }} checked={networkConfig.config["ipv4.nat"] == "true" ? true : false} mt="xs" label="IPv4 NAT" />
                <Switch checked={networkConfig.config["ipv6.nat"] == "true" ? true : false} mt="xs" label="IPv6 NAT" />
                <Flex mt="md">
                    <Button onClick={async () => {
                        let client = connectOIDC(node.url, getCookie("access_token"));
                        if (editingNetwork) {
                            await client.put(`/networks/${networkConfig.name}`, networkConfig);
                        } else {
                            await client.post("/networks", networkConfig);
                        }
                        setCreatingNetwork(false);
                        router.push(router.asPath)
                    }
                    } variant="light" color={editingNetwork ? "blue" : "green"} ml="auto">{editingNetwork ? "Edit" : "Create"}</Button>
                </Flex>
            </Modal>
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} onClose={() => setCreatingFloatingIp(false)} opened={creatingFloatingIp} title={`${editingFloatingIp ? "Edit" : "Create"} Floating IP`}>
                <TextInput disabled={editingFloatingIp} value={floatingIpConfig.listen_address} onChange={(e) => {
                    let newConfig = { ...floatingIpConfig };
                    newConfig.listen_address = e.currentTarget.value;
                    setFloatingIpConfig(newConfig);
                }} withAsterisk label="Address" placeholder="Address you want to add" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...floatingIpConfig };
                    newConfig.description = e.currentTarget.value;
                    setFloatingIpConfig(newConfig);
                }} value={floatingIpConfig.description} label="Description" placeholder="Description" />
                <Flex mt="xs">
                    <Button disabled={!floatingIpConfig.listen_address} variant="light" color="green" ml="auto" onClick={async () => {
                        setCreatingFloatingIp(false);
                        const client = connectOIDC(node.url, getCookie("access_token"));
                        if (editingFloatingIp) {
                            await client.put(`/networks/${selectedNetwork}/forwards/${floatingIpConfig.listen_address}`, floatingIpConfig);
                        } else {
                            await client.post(`/networks/${selectedNetwork}/forwards`, floatingIpConfig);
                        }
                        router.push(router.asPath);
                    }}>{editingFloatingIp ? "Edit" : "Create"}</Button>
                </Flex>
            </Modal>
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} onClose={() => setCreatingForward(false)} opened={creatingForward} title={`${editingForward ? "Edit" : "Create"} Forward`}>
                <Autocomplete onChange={(e) => {
                    let newConfig = { ...forwardConfig };
                    newConfig.target_address = e;
                    setForwardConfig(newConfig);
                }} withAsterisk data={[]} placeholder="Target Address" label="Target Address" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...forwardConfig };
                    newConfig.target_port = e.currentTarget.value;
                    setForwardConfig(newConfig);
                }} withAsterisk placeholder="Target Port(s) (Ex: 25565-25575, or 25565,25566, or 443)" label="Target Port(s)" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...forwardConfig };
                    newConfig.listen_port = e.currentTarget.value;
                    setForwardConfig(newConfig);
                }} withAsterisk placeholder="Listen Port(s) (Ex: 25565-25575, or 25565,25566, or 443)" label="Listen Port(s)" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...forwardConfig };
                    newConfig.description = e.currentTarget.value;
                    setForwardConfig(newConfig);
                }} placeholder="Description" label="Description" />
                <Select value={forwardConfig.protocol} data={[{ label: "TCP", value: "tcp" }, { label: "UDP", value: "udp" }]} onChange={(e) => {
                    let newConfig = { ...forwardConfig };
                    newConfig.protocol = e;
                    setForwardConfig(newConfig);
                }} label="Protocol" />
                <Flex mt="xs">
                <Button onClick={() => {
                    let existingPorts = networks.filter(network => network.name == selectedNetwork)[0].floatingIps.filter(floatingIp => floatingIp.listen_address == selectedFloatingIp)[0].ports;
                    existingPorts.push(forwardConfig);
                    let client = connectOIDC(node.url, getCookie("access_token"));
                    client.put(`/networks/${selectedNetwork}/forwards/${selectedFloatingIp}`, {
                        ports: existingPorts
                    });
                    setCreatingForward(false);
                    router.push(router.asPath);
                }} variant="light" color="green" ml="auto">Create</Button>
                </Flex>
                </Modal>
            <Flex my="md">
                <Title order={4} my="auto">Networks</Title>
                <Button onClick={() => {
                    const audio = new Audio("/audio/popup.mp3");
                    audio.play();
                    setCreatingNetwork(true);
                }} my="auto" variant="light" color="green" ml="auto">Create Network</Button>
            </Flex>
            <Accordion variant="separated">
                {networks.filter(network => network.managed == true).map((network) => {
                    return (
                        <Accordion.Item value={network.name}>
                            <Accordion.Control>
                                <SimpleGrid cols={6}>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {network.name}
                                        </Text>
                                        <Text c="dimmed" fz="xs" truncate={true}>
                                            {network.description ? network.description : "No description"}
                                        </Text>

                                    </div>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {network.leases.length}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            Connected Devices
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550} truncate={true}>
                                            {network.config["ipv4.address"] ? network.config["ipv4.address"] : "No IPv4 Address"}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            IPv4 Address
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550} truncate={true}>
                                            {network.config["ipv6.address"] ? network.config["ipv6.address"] : "No IPv6 Address"}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            IPv6 Address
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {prettyBytes(network.state.counters["bytes_sent"])}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            Sent
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {prettyBytes(network.state.counters["bytes_received"])}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            Received
                                        </Text>
                                    </div>
                                </SimpleGrid>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb="md" />
                                <Flex mb="md">
                                    <Title order={5} my="auto">Floating IPs</Title>
                                    <Button my="auto" variant="light" color="green" ml="auto" size="xs" onClick={() => {
                                        setSelectedNetwork(network.name)
                                        setCreatingFloatingIp(true)
                                        const audio = new Audio("/audio/popup.mp3");
                                        audio.play();
                                    }}>Create Floating IP</Button>
                                </Flex>
                                <Accordion variant="separated">
                                    {network.floatingIps.map((floatingIp) => {
                                        return (
                                            <Accordion.Item value={network.name}>
                                                <Accordion.Control>
                                                    <SimpleGrid cols={2}>
                                                        <div>
                                                            <Text fz="md" fw={550}>
                                                                {floatingIp.listen_address}
                                                            </Text>
                                                            <Text c="dimmed" fz="xs" truncate={true}>
                                                                {floatingIp.description ? floatingIp.description : "No description"}
                                                            </Text>
                                                        </div>
                                                        <div>
                                                            <Text fz="md" fw={550}>
                                                                {floatingIp.ports.length}
                                                            </Text>
                                                            <Text c="dimmed" fz="xs">
                                                                Forwards
                                                            </Text>
                                                        </div>
                                                    </SimpleGrid>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    <Divider mb="md" />
                                                    <Flex my="xs">
                                                        <Title order={5}>Forwards</Title>
                                                        <Button onClick={() => {
                                                            setSelectedNetwork(network.name);
                                                            setEditingForward(false);
                                                            setSelectedFloatingIp(floatingIp.listen_address);
                                                            const audio = new Audio("/audio/popup.mp3");
                                                            setCreatingForward(true);
                                                            audio.play();
                                                        }} my="auto" variant="light" color="green" ml="auto" size="xs">Create Forward</Button>
                                                    </Flex>
                                                    {floatingIp.ports.map((port) => {
                                                        return (
                                                            <Paper withBorder style={{ padding: 10 }} mb={"xs"}>
                                                                <SimpleGrid cols={3}>
                                                                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                                        <Text fz="md" fw={550}>
                                                                            {port.target_address + ":" + port.target_port + " ➡ " + floatingIp.listen_address + ":" + port.listen_port}
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
                                                                                const client = connectOIDC(node.url, getCookie("access_token"));
                                                                                let allPorts = floatingIp.ports;
                                                                                allPorts.splice(allPorts.indexOf(port), 1);
                                                                                await client.put(`/networks/${network.name}/forwards/${floatingIp.listen_address}`, {
                                                                                    ports: allPorts
                                                                                });
                                                                                router.push(router.asPath)
                                                                            }}>Delete Forward</Button>
                                                                        </Flex>
                                                                    </div>
                                                                </SimpleGrid>
                                                            </Paper>
                                                        )
                                                    })}
                                                    <Divider my="md" />
                                                    <Flex>
                                                        <Button variant="light" color="red" ml="auto" size="xs" onClick={async () => {
                                                            const client = connectOIDC(node.url, getCookie("access_token"));
                                                            await client.delete(`/networks/${network.name}/forwards/${floatingIp.listen_address}`);
                                                            router.push(router.asPath)
                                                        }}>Delete Floating IP</Button>
                                                        <Button variant="light" color="blue" ml="xs" size="xs" onClick={() => {
                                                            setEditingFloatingIp(true);
                                                            setSelectedNetwork(network.name);
                                                            setFloatingIpConfig(floatingIp)
                                                            const audio = new Audio("/audio/popup.mp3");
                                                            audio.play();
                                                            setCreatingFloatingIp(true);
                                                        }}>Edit Floating IP</Button>
                                                    </Flex>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        )
                                    })}
                                </Accordion>
                                <Flex my="md">
                                    <Title order={5} my="auto">Connected Devices</Title>
                                </Flex>
                                {network.leases.map((lease) => {
                                    return (
                                        <Paper withBorder style={{ padding: 10 }} mb={"xs"}>
                                            <SimpleGrid cols={3}>
                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {lease.hostname}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        {lease.hwaddr}
                                                    </Text>
                                                </div>
                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {lease.address}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        IP Address
                                                    </Text>
                                                </div>
                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {lease.type}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        Type
                                                    </Text>
                                                </div>

                                            </SimpleGrid>
                                        </Paper>
                                    )
                                })}
                                <Divider my="md" />

                                <Flex>
                                    <Button variant="light" color="red" ml="auto" size="xs" onClick={async () => {
                                        let client = connectOIDC(node.url, getCookie("access_token"));
                                        setCreatingNetwork(false);
                                        await client.delete(`/networks/${network.name}`)
                                        router.push(router.asPath)
                                    }}>Delete Network</Button>
                                    <Button onClick={() => {
                                        setEditingNetwork(true);
                                        let tempNetwork = { ...network };
                                        delete tempNetwork.volumes;
                                        delete tempNetwork.floatingIps;
                                        delete tempNetwork.leases;
                                        delete tempNetwork.state;
                                        setNetworkConfig(tempNetwork);
                                        const audio = new Audio("/audio/popup.mp3");
                                        audio.play();
                                        setCreatingNetwork(true)
                                    }} variant="light" color="blue" ml="xs" size="xs">Edit Network</Button>
                                </Flex>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>
        </>
    )
}