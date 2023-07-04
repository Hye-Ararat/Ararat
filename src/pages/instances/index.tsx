import { DataTable, DataTableColumn, DataTableRow } from "@/components/DataTable";
import CreateInstance from "@/components/instances/CreateInstance";
import { Flex, Title, Text, Group, ActionIcon, Badge, Button } from "@mantine/core";
import { IconPencil, IconPlayerPlay, IconPlayerStop, IconTrash } from "@tabler/icons-react";
import { connectOIDC } from "js-lxd"
import { SiUbuntu } from "@icons-pack/react-simple-icons"
import prettyBytes from 'pretty-bytes';
import { getOSLogo } from "@/lib/logo";
import { LxdInstance, LxdInstanceAction, LxdInstanceState } from "@/types/instance";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
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

function getBadgeColor(status: string) {
    switch (status) {
        case "Running":
            return "green";
        case "Error":
            return "red";
        case "Freezing":
            return "blue";
        case "Frozen":
            return "blue";
        case "Restarting":
            return "yellow";
        case "Starting":
            return "darkgreen";
        case "Stopped":
            return "red";
        case "Stopping":
            return "darkred";
        default:
            return "gray";
    }
}

export default function Instances({ instances }: { instances: LxdInstance[] }) {
    var access_token = getCookie("access_token")
    // TODO: iterate nodes
    var client = connectOIDC("https://10.17.167.6:8443", (access_token as string))

    function changeInstanceState(instance: string, action: LxdInstanceAction, force?: boolean) {
        client.put(`/instances/${instance}/state`, {
            action,
            force: force ?? false
        })
    }

    return (
        <>
            <Flex>
                <Title order={1}>Instances</Title>
                <CreateInstance />
            </Flex>
            <DataTable>
                {instances.map((instance) => {
                    return (
                        <InstanceTableRow instance={instance} />
                    )
                })}
            </DataTable>
        </>
    )
}
function InstanceTableRow({ instance }: { instance: LxdInstance }) {
    var access_token = getCookie("access_token")
    // TODO: iterate nodes
    var client = connectOIDC("https://10.17.167.6:8443", (access_token as string))
    var [cpuUsage, setCpuUsage] = useState(0);
    useEffect(() => {
        client.get("/instances/" + instance.name + "?recursion=1").then(async ({ data }) => {
            var startTime = Date.now()
            var lxdData = await client.get("/resources");
            console.log(lxdData)
            var instanceData: any = data.metadata;
            var cpu_ns = instanceData.state?.cpu.usage;
            var s: string = instanceData.config["limits.cpu"]
            var cpuCount = s ? parseFloat(s) : lxdData.data.metadata.cpu.total
            var multiplier = (100000 / cpuCount) * 2
            
            var usage1 = instanceData.state.cpu.usage / 1000000000
            client.get("/instances/" + instance.name + "?recursion=1").then(({ data }) => {
                var usage2 = data.metadata.state.cpu.usage / 1000000000
                var cpu_usage = ((usage2 - usage1) / (Date.now() - startTime)) * multiplier
                console.log(cpu_usage)
            })
        })
    }, [])
    return (
        <DataTableRow>
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
                    <Button sx={{ mr: 40 }}>Manage</Button>
                </Group>
            </DataTableColumn>
        </DataTableRow>
    )
}