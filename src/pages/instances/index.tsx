import { DataTable, DataTableColumn, DataTableRow } from "@/components/DataTable";
import CreateInstance from "@/components/instances/CreateInstance";
import { Flex, Title, Text, Group, ActionIcon, Badge, Button, Table, List, Checkbox } from "@mantine/core";
import { IconPlayerPlay, IconPlayerSkipForward, IconPlayerStop, IconTrash, IconX } from "@tabler/icons-react";
import { connectOIDC } from "js-lxd"
import prettyBytes from 'pretty-bytes';
import { getOSLogo } from "@/lib/logo";
import { LxdInstance, NodeLxdInstance } from "@/types/instance";
import { getCookie } from "cookies-next";
import { createContext, useContext, useState } from "react";
import { MainContext } from "@/components/AppShell";
import { formatDate, getBadgeColor } from "@/lib/util";
import Link from "next/link";
import { client, client as oidcClient, validateSession } from "@/lib/oidc"
import mongo from "@/lib/mongo";
import { ImageServer, Node } from "@/types/db";
import { fetchAllInstances } from "@/lib/lxd";
import { getImageServers, getNodes } from "@/lib/db";
import nookies from "nookies";
import { useRouter } from "next/router";

export async function getServerSideProps({ req, res }: any) {
    const valid = await validateSession(req.cookies.access_token)
    if (!valid) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return {
            redirect: {
                permanent: false,
                destination: `/authentication/login`
            },
        }
    };
    const nodes = await getNodes();
    const instances = await fetchAllInstances(req.cookies.access_token)
    const imageServers = await getImageServers();

    return {
        props: {
            instances,
            nodes,
            imageServers
        }
    }
}


const InstanceContext = createContext({ setActiveInstance: (instance: string) => { }, activeInstance: "", selectedInstances: ([] as { id: string, checked: boolean }[]), setSelectedInstances: (instances: { id: string, checked: boolean }[]) => { } })

export default function Instances({ instances, nodes, imageServers }: { instances: NodeLxdInstance[], nodes: Node[], imageServers: ImageServer[] }) {
    var access_token = getCookie("access_token")
    var [activeInstance, setActiveInstance] = useState<string>("")
    var initialCheckedInstances = ([] as { id: string, checked: boolean }[])
    instances.forEach(inst => initialCheckedInstances.push({ id: inst.config["volatile.uuid"], checked: false }))
    var [selectedInstances, setSelectedInstances] = useState<{ id: string, checked: boolean }[]>(initialCheckedInstances)
    const router = useRouter();
    return (
        <>
            <Flex>
                <Title order={1}>Instances</Title>
                <div style={{ marginLeft: "auto" }}>
                    {selectedInstances.filter(s => s.checked == true).length > 0 ? <>
                        <Group>
                            <ActionIcon color="green" variant="light" size={"lg"}>
                                <IconPlayerPlay size={"1.2rem"} />
                            </ActionIcon>
                            <ActionIcon color="yellow" variant="light" size={"lg"}>
                                <IconPlayerSkipForward size={"1.2rem"} />
                            </ActionIcon>
                            <ActionIcon color="red" variant="light" size={"lg"}>
                                <IconPlayerStop size={"1.2rem"} />
                            </ActionIcon>
                            <ActionIcon color="red" variant="light" size={"lg"}>
                                <IconTrash onClick={(e) => {
                                    let selected = selectedInstances.filter(s => s.checked == true);
                                    let fullInstances = instances.filter(i => selected.map(s => s.id).includes(i.config["volatile.uuid"]))
                                    let count = 0;
                                    let waitDone = new Promise((resolve, reject) => {
                                        let interval = setInterval(() => {
                                            clearInterval(interval);
                                            return resolve(count == fullInstances.length)
                                        }, 100);
                                    })
                                    fullInstances.forEach(async (instance) => {
                                        let client = connectOIDC(instance.node.url, nookies.get().access_token);
                                        await client.delete(`/instances/${instance.name}`);
                                        count++;
                                    });
                                    waitDone.then(() => {
                                        router.reload();
                                    })
                                }} size={"1.2rem"} />
                            </ActionIcon>
                            <Button variant="light" onClick={() => {
                                setSelectedInstances(initialCheckedInstances)
                            }}>Cancel</Button>
                        </Group>

                    </> : ""}
                    {selectedInstances.filter(s => s.checked == true).length == 0 ? <>
                        <CreateInstance nodes={nodes} imageServers={imageServers} />
                    </> : ""}

                </div>

            </Flex>
            <DataTable>
                <InstanceContext.Provider value={{ setActiveInstance, activeInstance, selectedInstances, setSelectedInstances }}>
                    {instances.map((instance) => {
                        return (
                            <InstanceTableRow instance={instance} />
                        )
                    })}
                </InstanceContext.Provider>
            </DataTable>
        </>
    )
}
function InstanceAside({ instance, closeAside }: { instance: NodeLxdInstance, closeAside: () => void }) {
    if (instance.state?.network) {
        var interfaces = Object.keys((instance.state?.network))
        var ips: string[] = []
        interfaces.forEach(netIfaceKey => {
            //@ts-expect-error
            var netIface = instance.state.network[netIfaceKey];
            var mappedAddresses = netIface.addresses.filter(s => s.family == "inet").map((ifaceaddr) => {
                return `${ifaceaddr.address}/${ifaceaddr.netmask}`
            })
            ips = ips.concat(mappedAddresses)
        })
    } else {
        var ips = ["Unknown"]
    }

    return (
        <>

            <Text pb={"md"}>
                <Group>
                    <Text fw={700} fz="lg">
                        Instance Details
                    </Text>
                    <Flex align={"flex-end"} direction={"row"} ml={"auto"}>
                        <ActionIcon onClick={closeAside}>
                            <IconX />
                        </ActionIcon>
                    </Flex>

                </Group>
            </Text>


            <Table>
                <tbody>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Name
                            </Text>
                        </td>
                        <td>
                            {instance.name}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Node
                            </Text>
                        </td>
                        <td>
                            {instance.node.name}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Status
                            </Text>
                        </td>
                        <td>
                            <Badge color={getBadgeColor(instance.status)}>
                                {instance.status}
                            </Badge>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Type
                            </Text>
                        </td>
                        <td>
                            <Badge color={instance.type == "virtual-machine" ? "teal" : "indigo"}>
                                {instance.type == "virtual-machine" ? "Virtual Machine" : "Container"}
                            </Badge>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                OS
                            </Text>
                        </td>
                        <td>
                            <Group>
                                {getOSLogo(instance.config["image.os"] ? instance.config["image.os"].toLowerCase() : "generic", 13)}
                                {instance.config["image.os"] && instance.config["image.release"] ? instance.config["image.os"] + " " + instance.config["image.release"] : "Unknown OS"}
                            </Group>

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Architecture
                            </Text>
                        </td>
                        <td>
                            {instance.config["image.architecture"] ? instance.config["image.architecture"] : "Unknown Architecture"}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Adresses
                            </Text>
                        </td>
                        <td>
                            <List>
                                {ips.map(ip => {
                                    return (
                                        <List.Item>
                                            {ip}
                                        </List.Item>
                                    )
                                })}
                            </List>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Created
                            </Text>
                        </td>
                        <td>
                            {formatDate(new Date(instance.created_at))}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Last Used
                            </Text>
                        </td>
                        <td>
                            {formatDate(new Date(instance.last_used_at))}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>

    )
}
function InstanceTableRow({ instance }: { instance: NodeLxdInstance }) {
    const { setAside, setAsideOpen } = useContext(MainContext)
    const { setActiveInstance, activeInstance, setSelectedInstances, selectedInstances } = useContext(InstanceContext)

    function closeAside() {
        setAsideOpen(false);
        setAside("")
        setActiveInstance("")
    }
    function setSelect(checked: boolean) {
        if (checked == false) {
            var i = selectedInstances.findIndex(s => s.id == instance.config["volatile.uuid"])
            var tmp = [...selectedInstances]
            tmp[i].checked = false
            setSelectedInstances(tmp)
        } else {
            var i = selectedInstances.findIndex(s => s.id == instance.config["volatile.uuid"])
            var tmp = [...selectedInstances]
            tmp[i].checked = true
            setSelectedInstances(tmp)
        }
    }
    return (
        <DataTableRow active={activeInstance == instance.config["volatile.uuid"]} onClick={() => {
            setAsideOpen(true)
            setActiveInstance(instance.config["volatile.uuid"])
            setAside(<InstanceAside instance={instance} closeAside={closeAside} />)
        }}>
            <DataTableColumn>
                <Group>
                    <Checkbox checked={selectedInstances.find(s => s.id == instance.config["volatile.uuid"])?.checked} onChange={(event) => {
                        setSelect(event.currentTarget.checked)
                    }} />
                    {getOSLogo(instance.config["image.os"] ? instance.config["image.os"].toLowerCase() : "generic", 40)}
                    <Text>
                        <div>
                            <Text fz="md" fw={550}>
                                {instance.name}
                            </Text>
                            <Text c="dimmed" fz="xs">
                                {instance.description ? instance.description : instance.config["image.os"] && instance.config["image.release"] ? instance.config["image.os"] + " " + instance.config["image.release"] : "Unknown OS"}
                            </Text>
                        </div>
                    </Text>
                </Group>
            </DataTableColumn>
            <DataTableColumn>
                <Group>
                    <Badge color={getBadgeColor(instance.status)}>
                        {instance.status}
                    </Badge>
                    <Badge color={instance.type == "virtual-machine" ? "teal" : "indigo"}>
                        {instance.type == "virtual-machine" ? "Virtual Machine" : "Container"}
                    </Badge>
                </Group>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {instance.state ? instance.state.cpu.usage : "0%"}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            CPU
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {instance.state ? prettyBytes(instance.state.memory.usage) : "0 MB"}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            Memory
                        </Text>
                    </div>
                </Text>

            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {instance.state ? instance.state.disk ? prettyBytes(instance.state.disk.root.usage) : "MB" : "0 MB"}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            Disk
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Group spacing={0} position="right">
                    <Link onClick={(e) => {
                        closeAside();
                        setTimeout(() => {
                            closeAside();
                        }, Number.MIN_VALUE)
                    }} href={`/instances/${instance.node.name}/${instance.name}`}>
                        <Button sx={{ mr: 40 }}>Manage</Button>
                    </Link>
                </Group>
            </DataTableColumn>
        </DataTableRow>
    )
}