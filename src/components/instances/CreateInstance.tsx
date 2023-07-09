import { Accordion, Button, Flex, Modal, NumberInput, Select, Switch, Tabs, TextInput, Textarea, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { IconCheck, IconForbid2, IconHistory, IconListDetails, IconNetwork, IconServer2, IconSettings, IconShield, IconWifi, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function CreateInstance({nodes}) {
    const [createInstance, setCreatingInstance] = useState(false);
    const [audio, setAudio] = useState(null);
    const [node, setNode] = useState(null);
    const [instanceConfig, setInstanceConfig] = useState({
        devices: {
            root: {
                path: "/",
                type: "disk"
            }
        }
    });
    const theme = useMantineTheme();
    useEffect(() => {
        if (createInstance) {
            let aud = new Audio("/audio/createInstance.m4a")
            aud.volume = 0.60;
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
    const [isReady, setIsReady] = useState(false);
    const [instanceNameError, setInstanceNameError] = useState(undefined);
    useEffect(() => {
        if (!instanceConfig.devices.root) return setIsReady(false);
        if (!instanceConfig.devices.root["pool"]) return setIsReady(false);
        if (!instanceConfig.source) return setIsReady(false);
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
                            const newInstanceConfig = {...instanceConfig}
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
                        <Textarea placeholder="Instance Description" label="Instance Description" />
                        <Select onChange={(e) => setNode(e)} label="Node" placeholder="Node" data={[{ value: "us-dal-1", label: "us-dal-1" }]} />
                        <Select label="Image" placeholder="Image" data={[{ value: "ubuntu", label: "Ubuntu Focal" }]} />
                    </Tabs.Panel>

                    <Tabs.Panel value="storage">
                        <Title order={4} mt="md" mb="xs">Disks</Title>
                        <Accordion variant="contained">
                            {Object.keys(instanceConfig.devices).map((device) => {
                                return (
                                    instanceConfig.devices[device].type == "disk" ?
                                        <Volume name={device} instanceConfig={instanceConfig} setInstanceConfig={setInstanceConfig} />
                                        : ""
                                )
                            })}
                        </Accordion>
                        <Flex mt="xs">
                            <Button onClick={() => {
                                let newConfig = {...instanceConfig}
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
                                    <Network name={device} instanceConfig={instanceConfig} setInstanceConfig={setInstanceConfig} />
                                    : ""
                            )
                           })}
                        </Accordion>
                        <Flex mt="xs">
                            <Button onClick={() => {
                                let newConfig = {...instanceConfig}
                                newConfig.devices["newNic"] = {
                                    type: "nic"
                                }
                                setInstanceConfig(newConfig);
                            }} ml="auto" color="green" variant="light">Add Network</Button>
                        </Flex>
                    </Tabs.Panel>
                    <Tabs.Panel value="limits">
                        <NumberInput label="Exposed CPUs" placeholder="Leave blank for unmetered" />
                        <TextInput label="Memory Limit" placeholder="Leave blank for unmetered" />
                    </Tabs.Panel>
                    <Tabs.Panel value="security">
                        <Switch color="teal" mt="xl" label="Deletion Prevention" description="Prevents the instance from being deleted" />
                        <Switch color="teal" mt="sm" label="Secure Boot" description="Controls whether UEFI secure boot is enabled with default Microsoft keys" />
                        <Switch color="teal" mt="sm" label="AMD SEV" description="Controls whether AMD SEV (Secure Encrypted Virtualization) is enabled for this VM" />
                        <Switch color="teal" mt="sm" label="AMD SEV-ES" description="Contols whether AMD SEV-ES (SEV Encrypted State) is enabled for this VM" />
                    </Tabs.Panel>
                    <Tabs.Panel value="snapshots">
                        <Select mt="sm" label="Snapshot Schedule" placeholder="Snapshot Schedule" data={[{value: "@hourly", label: "Hourly"}, {value: "@daily", label: "Daily"}, {value: "@weekly", label: "Weekly"}, {value: "@monthly", label: "Monthly"},{value: "@yearly", label: "Yearly"}]} />
                        <Switch color="teal" mt="sm" label="Take Snapshots While Stopped"/>
                        <TextInput mt="sm" label="Snapshot Expiry" placeholder="3d" />
                    </Tabs.Panel>
                    <Tabs.Panel value="advanced">
                            <Editor onChange={(e) => {
                        console.log(e)
                        let newConfig = {...instanceConfig};
                        newConfig = JSON.parse(e)
                        setInstanceConfig(newConfig);
                    }}  theme="vs-dark" height="50vh" defaultLanguage="json" value={JSON.stringify(instanceConfig, null, 4)} />
                    </Tabs.Panel>
                </Tabs>
                <Flex mt="sm">
                    <Button disabled={!isReady} ml="auto" onClick={() => setCreatingInstance(false)}>Create Instance</Button>
                </Flex>
            </Modal>
        </>
    )
}

function Network({name, instanceConfig, setInstanceConfig}) {
    const [error, setError] = useState<string | undefined>()
    return (
        <Accordion.Item value={name}>
            <Accordion.Control>
                <TextInput value={name} placeholder="eth0" />
            </Accordion.Control>
        </Accordion.Item>
    )
}

function Volume({ name, instanceConfig, setInstanceConfig }) {
    const [error,setError] = useState<string | undefined>()
    const [mountPointErr, setMountpointErr] = useState<string | undefined>()
    return (
        <Accordion.Item value={name}>
            <Accordion.Control>
                <TextInput disabled={name == "root"} onChange={(e) => {
                    if (e.currentTarget.value == "") return;
                    let newConfig = {...instanceConfig};
                    let oldDevice = instanceConfig.devices[name];
                    delete newConfig.devices[name];
                    newConfig.devices[e.currentTarget.value] = oldDevice;
                    setInstanceConfig(newConfig);
                }} value={name} placeholder="device name" />
            </Accordion.Control>
            <Accordion.Panel>
            <Select withAsterisk label="Storage Pool" placeholder="Storage Pool" data={[{value: "default", label: "default"}]} />
            {name != "root" ?
            <Select withAsterisk label="Volume" placeholder="Volume" data={[{value: "test", label: "test"}]} />
            : "" }
                <TextInput error={mountPointErr} onChange={(e) => {
                    setMountpointErr(undefined)
                    let newConfig = {...instanceConfig};
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
                
                <TextInput error={error} onChange={(e) => {
                    setError(undefined)
                    let newConfig = {...instanceConfig};
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
                <Flex>
                <Button onClick={() => {
                    let newConfig = {...instanceConfig};
                    delete newConfig.devices[name];
                    setInstanceConfig(newConfig);
                }} color="red" variant="light" mt="sm" ml="auto" disabled={name == "root"}>Remove Volume</Button>
                </Flex>
            </Accordion.Panel>
        </Accordion.Item>
    )
}