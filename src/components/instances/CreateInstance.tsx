import { Accordion, Avatar, Button, Flex, Group, Modal, NumberInput, Select, Switch, Tabs, Text, TextInput, Textarea, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { IconCheck, IconCube, IconForbid2, IconHistory, IconListDetails, IconNetwork, IconServer2, IconSettings, IconShield, IconWifi, IconX } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { getOSLogo, getVendorLogo } from "@/lib/logo";
import { ImageServer, Node } from "@/types/db"
import { connectOIDC } from "incus";
import nookies from "nookies";
import { openWebsocket } from "@/lib/lxdClient";
import { LxdStoragePool } from "@/types/storage";

export default function CreateInstance({ nodes, imageServers }: { nodes: Node[], imageServers: ImageServer[] }) {
    const [createInstance, setCreatingInstance] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [node, setNode] = useState<Node>();
    const [images, setImages] = useState([]);
    const [nodesData, setNodesData] = useState([]);
    const [instanceConfig, setInstanceConfig] = useState({
        devices: {
            root: {
                path: "/",
                type: "disk"
            }
        },
        config: {}
    });
    const [storagePools, setStoragePools] = useState<{
        value: string,
        label: string,
        title: string,
        description: string
    }[]>([]);
    const theme = useMantineTheme();
    useEffect(() => {
        if (createInstance) {
            let aud = new Audio("/audio/createInstance.m4a")
            aud.play()
            aud.loop = true;
            setAudio(aud);
        } else {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [createInstance])
    useEffect(() => {
        let nodesArr = [];
        nodes.forEach(async (node) => {
            const lxdClient = connectOIDC(node.url, nookies.get(null).access_token);
            let info = await lxdClient.get("/resources")
            let nodeData = info.data.metadata;
            nodeData.name = node.name;
            console.log(nodeData)
            nodesArr.push(nodeData);
            setNodesData(nodesArr);
        })
    }, [])
    useEffect(() => {
        let lxdClient = connectOIDC(null, null);
        async function getImages() {
            console.log(node.url)
            let info = await lxdClient.get("/resources")
            let nodeData = info.data.metadata;
            console.log(nodeData)
            let formattedImages = [];
            imageServers.forEach(async (imageServer) => {
                let res1 = await fetch(`/api/image_servers/${imageServer["_id"]}`, {
                    method: "GET",
                    cache: "no-cache",
                });
                let dat1 = await res1.json();
                Object.keys(dat1.index).forEach(async (imageType) => {
                    let res1 = await fetch(`/api/image_servers/${imageServer["_id"]}?path=${dat1.index[imageType].path}`, {
                        method: "GET",
                        cache: "no-cache",
                    });
                    let data = await res1.json();
                    Object.keys(data.products).forEach((image) => {
                        if (!data.products[image].aliases) return;
                        let supportedArch = "";
                        if (nodeData.cpu.architecture == "x86_64") supportedArch = "amd64";
                        if (nodeData.cpu.architecture == "aarch64") supportedArch = "arm64";
                        if (data.products[image].arch !== supportedArch) return;
                        formattedImages.push({
                            value: data.products[image],
                            label: data.products[image].aliases.split(",")[0],
                            title: data.products[image].os + " " + data.products[image].release_title,
                            description: data.products[image].variant ? data.products[image].variant + " variant" : "No variant",
                            os: data.products[image].os.toLowerCase(),
                            group: imageServer.name
                        })
                    })
                    setImages(formattedImages);
                })


            })

        }

        async function getStoragePools() {
            let pools = await lxdClient.get("/storage-pools?recursion=1");
            let formattedPools: {
                value: string,
                label: string,
                title: string,
                description: string
            }[] = [];
            (pools.data.metadata as LxdStoragePool[]).forEach((pool) => {
                formattedPools.push({
                    value: pool.name,
                    label: pool.name,
                    title: pool.name,
                    description: pool.description
                })
            })
            setStoragePools(formattedPools);
        }
        if (node) {
            lxdClient = connectOIDC(node.url, nookies.get().access_token)
            getImages();
            getStoragePools()
        }

    }, [node])
    const [isReady, setIsReady] = useState(false);
    const [instanceNameError, setInstanceNameError] = useState(undefined);
    const [supportedTypes, setSupportedTypes] = useState([]);
    useEffect(() => {
        if (!instanceConfig.devices.root) return setIsReady(false);
        if (!(instanceConfig.devices.root as any)["pool"]) return setIsReady(false);
        if (!(instanceConfig as any).source) return setIsReady(false);
        setIsReady(true)
    }, [instanceConfig])
    return (
        <>
            <Button my="auto" onClick={() => setCreatingInstance(true)} sx={{ marginLeft: "auto" }}>Create Instance</Button>
            <Modal size="xl" overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} opened={createInstance} onClose={() => setCreatingInstance(false)} title="Create Instance" centered>
                <Tabs defaultValue="details">
                    <Tabs.List>
                        <Tabs.Tab icon={<IconListDetails size="0.8rem" />} value="details">Details</Tabs.Tab>
                        <Tabs.Tab icon={<IconServer2 size="0.8rem" />} value="storage">Storage</Tabs.Tab>
                        <Tabs.Tab icon={<IconNetwork size="0.8rem" />} value="networks">Networks</Tabs.Tab>
                        <Tabs.Tab icon={<IconForbid2 size="0.8rem" />} value="limits">Limits</Tabs.Tab>
                        <Tabs.Tab icon={<IconShield size="0.8rem" />} value="security">Security</Tabs.Tab>
                        <Tabs.Tab icon={<IconHistory size="0.8rem" />} value="snapshots">Snapshots</Tabs.Tab>
                        <Tabs.Tab icon={<IconSettings size="0.8rem" />} value="advanced">Advanced</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="details">
                        <TextInput value={instanceConfig.name ? instanceConfig.name : ""} error={instanceNameError} onChange={(e) => {
                            const newInstanceConfig = { ...instanceConfig }
                            setInstanceNameError(undefined);
                            const audio = new Audio("/audio/ding.wav")
                            let value = e.currentTarget.value;
                            if (value.length > 63) {
                                setInstanceNameError("Instance name must be less than 63 characters");
                                audio.play();
                                return;
                            }
                            if (value.startsWith("-") || /^\d/.test(value)) {
                                setInstanceNameError("Instance name cannot start with a number or a dash");
                                audio.play()
                                return;
                            }
                            newInstanceConfig.name = value;
                            setInstanceConfig(newInstanceConfig);
                        }} placeholder="Instance Name" label="Instance Name" />
                        <Textarea onChange={(e) => {
                            const newInstanceConfig = { ...instanceConfig }
                            newInstanceConfig.description = e.currentTarget.value;
                            setInstanceConfig(newInstanceConfig);
                        }} placeholder="Instance Description" label="Instance Description" />
                        <Select itemComponent={SelectNode} withAsterisk onChange={(e) => setNode(nodes.filter((node) => node.name == e)[0])} label="Node" placeholder="Node" data={nodes.map(node => ({ name: node.name, vendor: nodesData.length == nodes.length ? nodesData.filter((dat) => node.name == dat.name)[0].system.vendor : "", value: node.name, label: node.name, description: nodesData.length == nodes.length ? nodesData.filter((dat) => node.name == dat.name)[0].system.product : "" }))} />
                        <Select onChange={(e) => {
                            let newInstanceConfig = { ...instanceConfig }
                            newInstanceConfig.source = {
                                type: "image",
                                alias: e.aliases.split(",")[0],
                                protocol: "simplestreams",
                                server: "https://images.linuxcontainers.org"
                            }
                            console.log(e)
                            let types = [];
                            if (!JSON.stringify(e).includes("stateless")) {
                                if (JSON.stringify(e).includes("disk-kvm") || JSON.stringify(e).includes("qcow2")) {
                                    types.push({ value: "virtual-machine", label: "Virtual Machine" });
                                }
                                if (JSON.stringify(e).includes("root.tar")) {
                                    types.push({ value: "container", label: "N-VPS" });
                                }

                            } else {
                                newInstanceConfig.type = "container";
                            }
                            if (types.length == 1) {
                                newInstanceConfig.type = types[0].value;
                            }
                            setSupportedTypes(types);
                            setInstanceConfig(newInstanceConfig);
                        }} withAsterisk disabled={!node} itemComponent={Image} nothingFound="No images that match your query were found" searchable label="Image" placeholder="Image" data={images} />
                        <Select onChange={(e) => {
                            let newInstanceConfig = { ...instanceConfig }
                            newInstanceConfig.type = e;
                            setInstanceConfig(newInstanceConfig);
                        }} value={instanceConfig.type} disabled={!instanceConfig.source} data={supportedTypes} label="Instance Type" placeholder="Instance Type" withAsterisk />
                    </Tabs.Panel>

                    <Tabs.Panel value="storage">
                        <Title order={4} mt="md" mb="xs">Disks</Title>
                        <Accordion variant="contained">
                            {Object.keys(instanceConfig.devices).map((device) => {
                                return (
                                    instanceConfig.devices[device].type == "disk" ?
                                        <Volume node={node} storagePools={storagePools} name={device} instanceConfig={instanceConfig} setInstanceConfig={setInstanceConfig} />
                                        : ""
                                )
                            })}
                        </Accordion>
                        <Flex mt="xs">
                            <Button onClick={() => {
                                let newConfig = { ...instanceConfig }
                                newConfig.devices["newDisk"] = {
                                    type: "disk"
                                }
                                setInstanceConfig(newConfig);
                            }} ml="auto" color="green" variant="light">Add Volume</Button>
                        </Flex>
                    </Tabs.Panel>

                    <Tabs.Panel value="networks">
                        <Title order={4} mt="md" mb="xs">Networks</Title>
                        <Accordion variant="contained">
                            {Object.keys(instanceConfig.devices).map((device) => {
                                return (
                                    instanceConfig.devices[device].type == "nic" ?
                                        <Network node={node} name={device} instanceConfig={instanceConfig} setInstanceConfig={setInstanceConfig} />
                                        : ""
                                )
                            })}
                        </Accordion>
                        <Flex mt="xs">
                            <Button onClick={() => {
                                let newConfig = { ...instanceConfig }
                                newConfig.devices["newNic"] = {
                                    type: "nic"
                                }
                                setInstanceConfig(newConfig);
                            }} ml="auto" color="green" variant="light">Add Network</Button>
                        </Flex>
                    </Tabs.Panel>
                    <Tabs.Panel value="limits">
                        <NumberInput value={instanceConfig.config ? instanceConfig.config["limits.cpu"] ? parseInt(instanceConfig.config["limits.cpu"]) : "" : ""} onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["limits.cpu"] = e.toString();
                            setInstanceConfig(newConfig);
                        }} label="Exposed CPUs" placeholder="Leave blank for unmetered" />
                        <TextInput value={instanceConfig.config ? instanceConfig.config["limits.memory"] : ""} onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["limits.memory"] = e.currentTarget.value;
                            setInstanceConfig(newConfig);
                        }} label="Memory Limit" placeholder="Leave blank for unmetered" />
                    </Tabs.Panel>
                    <Tabs.Panel value="security">
                        <Switch onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["security.protection.delete"] = e.target.checked;
                            setInstanceConfig(newConfig);
                        }} checked={instanceConfig.config["security.protection.delete"]} color="teal" mt="xl" label="Deletion Prevention" description="Prevents the instance from being deleted" />
                        {instanceConfig.type == "virtual-machine" ?
                            <>
                                <Switch onChange={(e) => {
                                    let newConfig = { ...instanceConfig }
                                    if (!newConfig.config) {
                                        newConfig.config = {}
                                    }
                                    newConfig.config["security.secureboot"] = e.target.checked;
                                    setInstanceConfig(newConfig);
                                }} checked={instanceConfig.config["security.secureboot"]} color="teal" mt="sm" label="Secure Boot" description="Controls whether UEFI secure boot is enabled with default Microsoft keys" />
                            </>
                            : ""}
                        {instanceConfig.type == "container" ?
                            <>
                                <Switch onChange={(e) => {
                                    let newConfig = { ...instanceConfig }
                                    if (!newConfig.config) {
                                        newConfig.config = {}
                                    }
                                    newConfig.config["security.nesting"] = e.target.checked;
                                    setInstanceConfig(newConfig);
                                }} checked={instanceConfig.config["security.nesting"]} color="teal" mt="sm" label="Nesting" description="Controls whether nesting is enabled for this container" />
                                <Switch onChange={(e) => {
                                    let newConfig = { ...instanceConfig }
                                    if (!newConfig.config) {
                                        newConfig.config = {}
                                    }
                                    newConfig.config["security.privileged"] = e.target.checked;
                                    setInstanceConfig(newConfig);
                                }} checked={instanceConfig.config["security.privileged"]} color="teal" mt="sm" label="Privileged" description="Controls whether to run the instance in privileged mode" />
                            </>
                            : ""}
                    </Tabs.Panel>
                    <Tabs.Panel value="snapshots">
                        <Select value={instanceConfig.config ? instanceConfig.config["snapshots.schedule"] : ""} onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["snapshots.schedule"] = e;
                            setInstanceConfig(newConfig);
                        }} mt="sm" label="Snapshot Schedule" placeholder="Snapshot Schedule" data={[{ value: "@hourly", label: "Hourly" }, { value: "@daily", label: "Daily" }, { value: "@weekly", label: "Weekly" }, { value: "@monthly", label: "Monthly" }, { value: "@yearly", label: "Yearly" }]} />
                        <Switch checked={instanceConfig.config ? instanceConfig.config["snapshots.schedule.stopped"] : false} onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["snapshots.schedule.stopped"] = e.currentTarget.checked;
                            setInstanceConfig(newConfig);
                        }} color="teal" mt="sm" label="Take Snapshots While Stopped" />
                        <TextInput value={instanceConfig.config ? instanceConfig.config["snapshots.expiry"] : ""} onChange={(e) => {
                            let newConfig = { ...instanceConfig }
                            if (!newConfig.config) {
                                newConfig.config = {}
                            }
                            newConfig.config["snapshots.expiry"] = e.currentTarget.value;
                            setInstanceConfig(newConfig);
                        }} mt="sm" label="Snapshot Expiry" placeholder="3d" />
                    </Tabs.Panel>
                    <Tabs.Panel value="advanced">
                        <Editor onChange={(e) => {
                            console.log(e)
                            let newConfig = { ...instanceConfig };
                            newConfig = JSON.parse(e)
                            setInstanceConfig(newConfig);
                        }} theme="vs-dark" height="50vh" defaultLanguage="json" value={JSON.stringify(instanceConfig, null, 4)} />
                    </Tabs.Panel>
                </Tabs>
                <Flex mt="sm">
                    <Button onClick={async () => {
                        const client = connectOIDC(node.url, nookies.get().access_token);
                        let res = await client.post(`/instances`, instanceConfig)
                        setCreatingInstance(false);

                    }} disabled={!isReady} ml="auto">Create Instance</Button>
                </Flex>
            </Modal>
        </>
    )
}

interface ImageProps extends React.ComponentPropsWithoutRef<'div'> {
    os: string;
    label: string;
    description: string;
}
const Image = forwardRef<HTMLDivElement, ImageProps>(
    ({ title, os, label, description, ...others }: ImageProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {getOSLogo(os)}

                <div>
                    <Text size="sm">{title}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);


interface NodeProps extends React.ComponentPropsWithoutRef<'div'> {
    value: string;
    name: string;
    vendor: string;
    description: string;
}
const SelectNode = forwardRef<HTMLDivElement, NodeProps>(
    ({ value, name, vendor, description, ...others }: NodeProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {getVendorLogo(vendor)}

                <div>
                    <Text size="sm">{name}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

interface StoragePoolProps extends React.ComponentPropsWithoutRef<'div'> {
    os: string;
    label: string;
    description: string;
}
const StoragePool = forwardRef<HTMLDivElement, StoragePoolProps>(
    ({ label, description, ...others }: ImageProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <IconServer2 />

                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

export function Network({ name, instanceConfig, setInstanceConfig, node }) {
    const [networks, setNetworks] = useState([])
    useEffect(() => {
        if (node) {
            let lxdClient = connectOIDC(node.url, nookies.get().access_token);
            lxdClient.get("/networks?recursion=1").then((res) => {
                let nets = res.data.metadata;
                nets = nets.filter((net) => net.type == "bridge")
                let formattedNets = [];
                for (let net in nets) {
                    console.log(nets[net])
                    formattedNets.push({ label: nets[net].name, value: nets[net].name, data: nets[net] })
                }
                setNetworks(formattedNets)
            })
        }
    }, [node])
    const [error, setError] = useState<string | undefined>()
    return (
        <Accordion.Item value={name}>
            <Accordion.Control>
                <TextInput onChange={(e) => {
                    if (e.target.value == "") return;
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[e.target.value] = instanceConfig.devices[name]
                    delete newConfig.devices[name];
                    setInstanceConfig(newConfig)
                }} value={name} placeholder="eth0" />
            </Accordion.Control>
            <Accordion.Panel>
                <Select searchable value={instanceConfig.devices[name]["network"]} onChange={(e) => {
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[name]["network"] = e
                    console.log(newConfig)
                    setInstanceConfig(newConfig)
                }} itemComponent={NetworkSelect} withAsterisk label="Network" placeholder="Select a network" data={networks} disabled={!node} />
                <TextInput value={instanceConfig.devices[name]["ipv4.address"]} onChange={(e) => {
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[name]["ipv4.address"] = e.currentTarget.value
                    setInstanceConfig(newConfig)
                }} placeholder="Leave blank for DHCP" label="IPv4 Address" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[name]["ipv6.address"] = e.currentTarget.value
                    setInstanceConfig(newConfig)
                }} value={instanceConfig.devices[name]["ipv6.address"]} placeholder="Leave blank for DHCP" label="IPv6 Address" />
                <TextInput onChange={(e) => {
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[name]["limits.egress"] = e.currentTarget.value
                    setInstanceConfig(newConfig)
                }} value={instanceConfig.devices[name]["limits.egress"]} placeholder="Leave blank for unmetered, measured in bit/s" label="Egress Limit" />
                <TextInput value={instanceConfig.devices[name]["limits.ingress"]} onChange={(e) => {
                    let newConfig = { ...instanceConfig }
                    newConfig.devices[name]["limits.ingress"] = e.currentTarget.value
                    setInstanceConfig(newConfig)
                }} placeholder="Leave blank for unmetered, measured in bit/s" label="Ingress Limit" />
                <Flex mt="md">
                    <Button ml="auto" onClick={() => {
                        let newConfig = { ...instanceConfig }
                        delete newConfig.devices[name]
                        setInstanceConfig(newConfig)
                    }} color="red" variant="light">Delete Network</Button>
                </Flex>
            </Accordion.Panel>
        </Accordion.Item>
    )
}


interface NetworkSelectProps extends React.ComponentPropsWithoutRef<'div'> {
    value: any;
    data: string;
}
const NetworkSelect = forwardRef<HTMLDivElement, NetworkSelectProps>(
    ({ value, data, ...others }: NetworkSelectProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <IconNetwork />

                <div>
                    <Text size="sm">{value}</Text>
                    <Text size="xs" opacity={0.65}>
                        {data.config["ipv4.address"]}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

interface VolumeSelectProps extends React.ComponentPropsWithoutRef<'div'> {
    os: string;
    label: string;
    description: string;
}
const VolumeSelect = forwardRef<HTMLDivElement, VolumeSelectProps>(
    ({ label, description, ...others }: ImageProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <IconCube />

                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);
function Volume({ name, instanceConfig, setInstanceConfig, storagePools, node }) {
    const [error, setError] = useState<string | undefined>()
    const [mountPointErr, setMountpointErr] = useState<string | undefined>()
    const [volumes, setVolumes] = useState([]);
    useEffect(() => {
        if (!node) return;
        if (!instanceConfig.devices[name].pool) return;
        async function getVolumes() {
            let client = connectOIDC(node.url, nookies.get().access_token);
            let volumes = (await client.get(`/storage-pools/${instanceConfig.devices[name].pool}/volumes?recursion=1`)).data.metadata;
            let formattedVolumes = [];
            for (let volume of volumes) {
                if (volume.type == "custom") {
                    console.log(volume)
                    formattedVolumes.push({ value: volume.name, label: volume.name, description: volume.config["size"] ? volume.config["size"] : "Unmetered" })
                }
            }
            setVolumes(formattedVolumes);
        }
        getVolumes();
    }, [instanceConfig.devices[name].pool])
    return (
        <Accordion.Item value={name}>
            <Accordion.Control>
                <TextInput disabled={name == "root"} onChange={(e) => {
                    if (e.currentTarget.value == "") return;
                    let newConfig = { ...instanceConfig };
                    let oldDevice = instanceConfig.devices[name];
                    delete newConfig.devices[name];
                    newConfig.devices[e.currentTarget.value] = oldDevice;
                    setInstanceConfig(newConfig);
                }} value={name} placeholder="device name" />
            </Accordion.Control>
            <Accordion.Panel>
                <Select onChange={(e) => {
                    let newConfig = { ...instanceConfig };
                    newConfig.devices[name].pool = e
                    setInstanceConfig(newConfig);
                }} disabled={!node} itemComponent={StoragePool} withAsterisk label="Storage Pool" placeholder="Storage Pool" data={storagePools} />
                {name != "root" ?
                    <Select onChange={(e) => {
                        let newConfig = { ...instanceConfig };
                        newConfig.devices[name].source = e
                        setInstanceConfig(newConfig);
                    }} disabled={!instanceConfig.devices[name].pool} itemComponent={VolumeSelect} withAsterisk label="Volume" placeholder="Volume" data={volumes} />
                    : ""}
                <TextInput error={mountPointErr} onChange={(e) => {
                    setMountpointErr(undefined)
                    let newConfig = { ...instanceConfig };
                    let currentVal = e.currentTarget.value;
                    if (currentVal != "") {
                        if (e.currentTarget.value == "/") {
                            setMountpointErr("Mountpoint cannot be / (must be /example for example)")
                            let audio = new Audio("/audio/ding.wav")
                            audio.play();
                        }
                    }
                    newConfig.devices[name].path = currentVal;
                    setInstanceConfig(newConfig);
                }} withAsterisk disabled={name == "root"} label="Mountpoint" placeholder="Mountpoint" value={instanceConfig.devices[name].path} />
                {name != "root" ? "" :
                    <TextInput error={error} onChange={(e) => {
                        setError(undefined)
                        let newConfig = { ...instanceConfig };
                        let currentVal = e.currentTarget.value;
                        if (currentVal != "") {
                            let supportedUnits = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"]
                            let endedWith = false;
                            supportedUnits.forEach((unit) => {
                                if (currentVal.endsWith(unit)) endedWith = true;
                            });

                            if (!endedWith) {
                                setError("Size must end with a supported unit")
                                let audio = new Audio("/audio/ding.wav")
                                audio.play();
                            }
                        }
                        newConfig.devices[name].size = e.currentTarget.value;
                        setInstanceConfig(newConfig);
                    }} label="Size" placeholder="Leave blank for unmetered" value={instanceConfig.devices[name].size ? instanceConfig.devices[name].size : undefined} />
                }
                <Flex>
                    <Button onClick={() => {
                        let newConfig = { ...instanceConfig };
                        delete newConfig.devices[name];
                        setInstanceConfig(newConfig);
                    }} color="red" variant="light" mt="sm" ml="auto" disabled={name == "root"}>Remove Volume</Button>
                </Flex>
            </Accordion.Panel>
        </Accordion.Item>
    )
}