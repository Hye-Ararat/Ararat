import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { validateSession } from "@/lib/oidc";
import { LxdInstance, NodeLxdInstance } from "@/types/instance";
import axios from "axios";
import { Accordion, Button, Divider, Flex, Paper, SimpleGrid, Title, Text, Stack, Modal, Center, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { LxdVolumeAndState } from "@/types/storage";
import prettyBytes from "pretty-bytes";
import { capitalizeFirstLetter } from "@/lib/util";
import Link from "next/link";
import { DataTable, DataTableRow } from "@/components/DataTable";
import { connectOIDC } from "js-lxd";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { AttachVolumeModal } from "@/components/instances/instance/volumes/AttachVolumeModal";

var url = process.env.URL
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
        var volumes = (await axios.get(`http://${url}/api/instances/${(params.node as string)}/${(params.instance as string)}/volumes`, {
            headers: {
                Cookie: `access_token=${req.cookies.access_token}`
            }
        })).data
        return {
            props: {
                instance: instance,
                volumes: volumes,
                panelURL: url
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceVolumes({ instance, volumes, panelURL }: { instance: NodeLxdInstance, volumes: any, panelURL: string }) {
    var access_token = (getCookie("access_token") as string)
    const theme = useMantineTheme()
    const [attachOpen, setAttachOpen] = useState(false)
    const client = connectOIDC(instance.node.url, access_token)
    console.log(volumes)
    return (
        <>
            <InstanceShell instance={instance} />
            <Modal opened={attachOpen} overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3
            }} style={{ height: "30vh", overflowY: undefined }} centered size={"lg"} onClose={() => setAttachOpen(false)} title="Attach Volume">

                <AttachVolumeModal instance={instance} url={panelURL} />


            </Modal>

            <Flex mt="md" mb="md">
                <Title order={4} my="auto">Volumes</Title>
                <Button my="auto" variant="light" color="green" ml="auto" onClick={() => {
                    setAttachOpen(true)
                }}>Attach Volume</Button>
            </Flex>

            {volumes.map((volume: LxdVolumeAndState) => {
                return (
                    <Paper style={{ padding: 10, marginBottom: 10 }}>
                        <SimpleGrid cols={6}>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {volume.name}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    {volume.description == "" ? "No description" : volume.description}
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                {volume.device ? <Link style={{ fontWeight: 550, textDecoration: "none", color: "rgb(193, 194, 197)" }} href={`/instances/${instance.node.name}/${instance.name}/files?path=${volume.device.path}`}>
                                    {volume.device.path}
                                </Link> : <Text>
                                    ?
                                </Text>}

                                <Text c="dimmed" fz="xs">
                                    Mountpoint
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {volume.status.usage.total == 0 ? "∞" : prettyBytes(volume.status.usage.total)}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Size
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {prettyBytes(volume.status.usage.used)}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Usage
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {volume.type ? (volume.type == "custom" ? "Additional" : "Primary") : "Unknown"}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Type
                                </Text>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                <Flex direction={"column"}>
                                    <Button size="xs" mb="xs" variant="light">
                                        Edit Volume
                                    </Button>
                                    <Button size="xs" variant="light" color="red" disabled={volume.key == "root"} onClick={async () => {
                                        var inst: LxdInstance = (await client.get(`/instances/${instance.name}`)).data.metadata
                                        delete inst.devices[volume.key]
                                        await client.put(`/instances/${instance.name}`, inst)
                                    }}>
                                        Detach Volume
                                    </Button>
                                </Flex>
                            </div>
                        </SimpleGrid>
                    </Paper>

                )
            })}



        </>
    )
}