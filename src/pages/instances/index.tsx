import { DataTable, DataTableColumn, DataTableRow } from "@/components/DataTable";
import CreateInstance from "@/components/instances/CreateInstance";
import { Flex, Title, Text, Group, ActionIcon, Badge, Button, Table, List } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { connectOIDC } from "js-lxd"
import prettyBytes from 'pretty-bytes';
import { getOSLogo } from "@/lib/logo";
import { LxdInstance } from "@/types/instance";
import { getCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";
import { MainContext } from "@/components/AppShell";
import { formatDate, getBadgeColor } from "@/lib/util";


export async function getServerSideProps({ req, res }: any) {
    // TODO: iterate nodes
    let client = connectOIDC("https://10.17.167.6:8443", req.cookies.access_token)
    try {
        let instances = (await client.get("/instances?recursion=2")).data.metadata
        return {
            props: {
                instances
            }
        }
    } catch (error) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return {
            redirect: {
                permanent: false,
                destination: `/authentication/login`
            },
        };
    }
}


const InstanceContext = createContext({ setActiveInstance: (instance: string) => { }, activeInstance: "" })
export default function Instances({ instances }: { instances: LxdInstance[] }) {
    var access_token = getCookie("access_token")
    // TODO: iterate nodes
    var client = connectOIDC("https://10.17.167.6:8443", (access_token as string))
    var [activeInstance, setActiveInstance] = useState<string>("")
    return (
        <>
            <Flex>
                <Title order={1}>Instances</Title>
                <CreateInstance />
            </Flex>
            <DataTable>
                <InstanceContext.Provider value={{ setActiveInstance, activeInstance }}>
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
function InstanceAside({ instance, closeAside }: { instance: LxdInstance, closeAside: () => void }) {
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

    console.log(instance)
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
                                OS
                            </Text>
                        </td>
                        <td>
                            {instance.config["image.os"] && instance.config["image.release"] ? instance.config["image.os"] + " " + instance.config["image.release"] : "Unknown OS"}
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
function InstanceTableRow({ instance }: { instance: LxdInstance }) {
    const { setAside, setAsideOpen, asideOpen } = useContext(MainContext)
    const { setActiveInstance, activeInstance } = useContext(InstanceContext)

    function closeAside() {
        setAsideOpen(false);
        setAside("")
        setActiveInstance("")
    }
    useEffect(() => {
        console.log({asideOpen,activeInstance})
    }, [asideOpen, activeInstance])
    return (
        <DataTableRow active={activeInstance == instance.config["volatile.uuid"]} onClick={() => {
            setAsideOpen(true)
            setActiveInstance(instance.config["volatile.uuid"])
            setAside(<InstanceAside instance={instance} closeAside={closeAside} />)
        }}>
            <DataTableColumn>
                <Group>
                    {getOSLogo(instance.config["image.os"] ? instance.config["image.os"].toLowerCase() : "generic", 40)}
                    <Text>
                        <div>
                            <Text fz="md" fw={550}>
                                {instance.name}
                            </Text>
                            <Text c="dimmed" fz="xs">
                                {instance.config["image.os"] && instance.config["image.release"] ? instance.config["image.os"] + " " + instance.config["image.release"] : "Unknown OS"}
                            </Text>
                        </div>
                    </Text>
                </Group>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <Badge color={getBadgeColor(instance.status)}>
                        {instance.status}
                    </Badge>
                </Text>
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
                            {instance.state ? prettyBytes(instance.state.disk.root.usage) : "0 MB"}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            Disk
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Group spacing={0} position="right">
                    <Button sx={{ mr: 40 }} component="a" href={`/instances/${instance.name}`}>Manage</Button>
                </Group>
            </DataTableColumn>
        </DataTableRow>
    )
}