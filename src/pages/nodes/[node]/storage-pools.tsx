import NodeShell from "@/components/nodes/node/NodeShell"
import mongo from "@/lib/mongo"
import { sanitizeOne } from "@/lib/db"
import { connectOIDC } from "incus"
import { Accordion, Button, Divider, Flex, Grid, Modal, Paper, Select, SimpleGrid, Tabs, Text, TextInput, Title, useMantineTheme } from "@mantine/core"
import { DataTableColumn, DataTableRow } from "@/components/DataTable"
import { use, useState } from "react"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"

export async function getServerSideProps({ params, req }) {
    let nodeData = await mongo.db().collection("Node").findOne({ name: params.node })
    let client = connectOIDC(nodeData.url, req.cookies.access_token)
    let resources = (await client.get("/resources")).data.metadata
    let pools = (await client.get("/storage-pools?recursion=1")).data.metadata
    let count = 0;
    pools.forEach(async (pool) => {
        pool.volumes = (await client.get(`/storage-pools/${pool.name}/volumes?recursion=1`)).data.metadata
        count++;
    })
    while (count < pools.length) {
        await new Promise(r => setTimeout(r, 5));
    }
    console.log(pools)
    return {
        props: {
            node: sanitizeOne(nodeData),
            resources: resources,
            pools: pools
        }
    }
}

export default function NodeStoragePools({ node, resources, pools }) {
    const [creatingStoragePool, setCreatingStoragePool] = useState(false);
    const [poolConfig, setPoolConfig] = useState({
        name: "",
        driver: "zfs",
        config: {

        }
    })
    const [selectedPool, setSelectedPool] = useState(null);
    const [creatingVolume, setCreatingVolume] = useState(false);
    const [volume, setVolume] = useState({
        name: "",
        config: {

        },
        type: "custom"
    })
    const theme = useMantineTheme();
    const router = useRouter();
    const [editingStoragePool, setEditingStoragePool] = useState(false);
    const [editingVolume, setEditingVolume] = useState(false);
    return (
        <>
            <NodeShell node={node} resources={resources} />
            <Modal title={editingStoragePool ? "Edit Storage Pool" : "Create Storage Pool"} overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} opened={creatingStoragePool} centered onClose={() => setCreatingStoragePool(false)} size="md" padding="md">
                <TextInput value={poolConfig.name} onChange={(e) => {
                    const newPoolConfig = { ...poolConfig };
                    newPoolConfig.name = e.currentTarget.value;
                    setPoolConfig(newPoolConfig);
                }} label="Name" placeholder="Name" withAsterisk />
                <TextInput value={poolConfig.description} onChange={(e) => {
                    const newPoolConfig = { ...poolConfig };
                    newPoolConfig.description = e.currentTarget.value;
                    setPoolConfig(newPoolConfig);
                }} label="Description" placeholder="Description" />
                <TextInput value={poolConfig.config["size"]} onChange={(e) => {
                    const newPoolConfig = { ...poolConfig };
                    newPoolConfig.config["size"] = e.currentTarget.value;
                    setPoolConfig(newPoolConfig);
                }} label="Size" placeholder="Leave blank for automatic. Ex: 4GB" />
                <Flex mt="md">
                    <Button onClick={async (e) => {
                        const client = connectOIDC(node.url, getCookie("access_token"));
                        if (editingStoragePool) {
                            await client.put(`/storage-pools/${poolConfig.name}`, poolConfig);
                        } else {
                            await client.post("/storage-pools", poolConfig);
                        }
                        setCreatingStoragePool(false);
                        router.push(`/nodes/${node.name}/storage-pools`)
                    }} disabled={poolConfig.name == ""} variant="light" color={editingStoragePool ? "blue" : "green"} ml="auto" my="auto">{editingStoragePool ? "Edit" : "Create"}</Button>
                </Flex>
            </Modal>
            <Modal title={editingVolume ? "Edit Volume" : "Create Volume"} overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} centered onClose={() => setCreatingVolume(false)} size="md" padding="md" opened={creatingVolume}>
                <TextInput label="Name" withAsterisk placeholder="Name" value={volume.name} onChange={(e) => {
                    const newVolume = { ...volume };
                    newVolume.name = e.currentTarget.value;
                    setVolume(newVolume);
                }} />
                <TextInput label="Size" placeholder="Size" onChange={(e) => {
                    const newVolume = { ...volume };
                    newVolume.config["size"] = e.currentTarget.value;
                    setVolume(newVolume);
                }} value={volume.config["size"]} />
                <TextInput value={volume.description} label="Description" placeholder="Description" onChange={(e) => {
                    const newVolume = { ...volume };
                    newVolume.description = e.currentTarget.value;
                    setVolume(newVolume);
                }} />
                <Select value={volume.config["snapshots.schedule"]} onChange={(e) => {
                    let newConfig = { ...volume }

                    newConfig.config["snapshots.schedule"] = e;
                    setVolume(newConfig);
                }} label="Snapshot Schedule" placeholder="Snapshot Schedule" data={[{ value: "@hourly", label: "Hourly" }, { value: "@daily", label: "Daily" }, { value: "@weekly", label: "Weekly" }, { value: "@monthly", label: "Monthly" }, { value: "@yearly", label: "Yearly" }]} />
                <TextInput value={volume.config["snapshots.expiry"]} onChange={(e) => {
                    let newConfig = { ...volume }

                    newConfig.config["snapshots.expiry"] = e.currentTarget.value;
                    setVolume(newConfig);
                }} label="Snapshot Expiry" placeholder="3d" />
                <Flex mt="md">
                    <Button onClick={async (e) => {
                        const client = connectOIDC(node.url, getCookie("access_token"));
                        if (editingVolume) {
                            await client.put(`/storage-pools/${selectedPool}/volumes/custom/${volume.name}`, volume);
                        } else {
                            await client.post(`/storage-pools/${selectedPool}/volumes`, volume);
                        }
                        setCreatingVolume(false);
                        router.push(`/nodes/${node.name}/storage-pools`)
                    }} disabled={volume.name == ""} variant="light" color={editingVolume ? "blue" : "green"} ml="auto" my="auto">{editingVolume ? "Edit" : "Create"}</Button>
                </Flex>
            </Modal>
            <Flex mt="md" mb="md">
                <Title order={4} my="auto">Storage Pools</Title>
                <Button my="auto" variant="light" color="green" ml="auto" onClick={() => {
                    const audio = new Audio("/audio/popup.mp3")
                    audio.play()
                    setEditingStoragePool(false)
                    setCreatingStoragePool(true)
                }}>Create Storage Pool</Button>
            </Flex>
            <Accordion variant="separated">
                {pools.map((pool) => {
                    return (
                        <Accordion.Item value={pool.name}>
                            <Accordion.Control>
                                <SimpleGrid cols={3}>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {pool.name}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            {pool.description ? pool.description : "No description"}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {pool.config["size"]}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            Size
                                        </Text>
                                    </div>
                                    <div>
                                        <Text fz="md" fw={550}>
                                            {pool.driver}
                                        </Text>
                                        <Text c="dimmed" fz="xs">
                                            Driver
                                        </Text>
                                    </div>        </SimpleGrid>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb='md' />
                                <Flex mb="xs">
                                    <Title order={5} my="auto">Volumes</Title>
                                    <Button onClick={() => {
                                        setSelectedPool(pool.name);
                                        const audio = new Audio("/audio/popup.mp3")
                                        audio.play()
                                        setCreatingVolume(true)

                                    }} my="auto" variant="light" color="green" ml="auto" size="xs" my="auto">Create Volume</Button>
                                </Flex>
                                {pool.volumes.filter(volume => volume.type == "custom").map((volume) => {
                                    console.log(volume)
                                    return (
                                        <Paper withBorder sx={{ padding: 10 }}>
                                            <SimpleGrid cols={4}>
                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {volume.name}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        {volume.description ? volume.description : "No description"}
                                                    </Text>
                                                </div>

                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {volume.config["size"] ? volume.config["size"] : "Unmetered"}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        Size
                                                    </Text>
                                                </div>
                                                <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    <Text fz="md" fw={550}>
                                                        {volume.config["snapshots.schedule"] ? volume.config["snapshots.schedule"] : "None"}
                                                    </Text>
                                                    <Text c="dimmed" fz="xs">
                                                        Snapshot Schedule
                                                    </Text>
                                                </div>
                                                <div style={{ marginLeft: "auto" }}>
                                                    <Flex direction={"column"}>
                                                        <Button variant="light" color="info" mb="xs" size="xs" onClick={() => {
                                                            setSelectedPool(pool.name);
                                                            setVolume(volume);
                                                            setEditingVolume(true);
                                                            const audio = new Audio("/audio/popup.mp3")
                                                            audio.play()
                                                            setCreatingVolume(true);
                                                        }}>Edit Volume</Button>
                                                        <Button onClick={async () => {
                                                            const client = connectOIDC(node.url, getCookie("access_token"));
                                                            await client.delete(`/storage-pools/${pool.name}/volumes/custom/${volume.name}`)
                                                            router.push(`/nodes/${node.name}/storage-pools`)
                                                        }} variant="light" color="red" size="xs">Delete Volume</Button>
                                                    </Flex>
                                                </div>
                                            </SimpleGrid>
                                        </Paper>
                                    )
                                })}
                                <Divider my="md" />
                                <Flex>
                                    <Button onClick={async (e) => {
                                        let client = connectOIDC(node.url, getCookie("access_token"));
                                        await client.delete(`/storage-pools/${pool.name}`)
                                        router.push(router.asPath)
                                    }} ml="auto" my="auto" variant="light" color="red" size="xs">Delete Storage Pool</Button>
                                    <Button onClick={() => {
                                        setEditingStoragePool(true);
                                        setSelectedPool(pool.name);
                                        let tempPool = { ...pool };
                                        delete tempPool.volumes;
                                        setPoolConfig(tempPool)
                                        const audio = new Audio("/audio/popup.mp3")
                                        audio.play()
                                        setCreatingStoragePool(true)
                                    }} ml="xs" my="auto" variant="light" color="blue" size="xs">Edit Storage Pool</Button>
                                </Flex>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>        </>
    )
}