import { getNodeClient } from "@/lib/lxd";
import { client } from "@/lib/oidc";
import { InstanceFileContext } from "@/pages/instances/[node]/[instance]/files";
import { NodeLxdInstance } from "@/types/instance";
import { Anchor, Button, Center, Grid, Group, Menu, Paper, Popover, Stack, Text, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconBorderHorizontal, IconDownload, IconFile, IconFileFilled, IconFolder, IconFolderFilled, IconLink, IconPencil, IconTrash } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { connectOIDC } from "incus";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";


export function GridFileView({ files }: { files: string[] }) {
    return (
        <Grid gutter={20} pt={20} columns={18}>
            {files.map((file) => {
                return (
                    <GridFileViewItem file={file} />
                )
            })}
        </Grid>
    )
}
function GridFileViewItem({ file }: { file: string }) {
    const { instance, rerender }: { instance: NodeLxdInstance, rerender: () => void } = (useContext(InstanceFileContext) as any)
    const router = useRouter();
    var access_token = (getCookie("access_token") as string)
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(true)
    const [metadata, setMetadata] = useState({ type: "loading", mode: "", gid: "", modified: "", uid: "", size: 0 })
    const ref = useClickOutside(() => setOpened(false));
    let path = router.query.path as string;
    if (path == "/") path = "";
    useEffect(() => {
        fetch(`/api/instances/${instance.node.name}/${instance.name}/files?path=${path}/${file}`, {
            method: "GET"
        }).then(async (s) => {
            var body = await s.json();
            setMetadata({
                type: body["x-incus-type"],
                mode: body["x-incus-node"],
                gid: body["x-incus-gid"],
                modified: body["x-incus-modified"],
                uid: body["x-incus-uid"],
                size: body["size"]
            })
            setLoading(false)
        })
    }, [file])

    async function deleteFile() {
        const audio = new Audio("/audio/delete.wav");
        const nodeClient = connectOIDC(instance.node.url, access_token)
        nodeClient.delete(`/instances/${instance.name}/files?path=${path}/${file}`).then(s => {
            setTimeout(() => {
                rerender()
                audio.play()
            }, 50)
        }).catch(() => {
        })
    }

    return (
        <Menu opened={opened} withArrow >
            <Menu.Target>
                <Grid.Col span={2} key={file}>
                    <Anchor underline={false} onContextMenu={(e) => {
                        e.preventDefault()
                        setOpened(!opened)
                    }} onClick={() => {
                        console.log(path, file)
                        router.replace(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }} ref={ref}>
                        <Paper radius={20}>
                            <Center py={20}>
                                <Stack>
                                    <Center>
                                        {loading ?
                                            <Loader />
                                            : <>
                                                {metadata.type == "directory" ? <IconFolderFilled size={75} style={{ color: "rgb(90, 200, 250)" }} /> : (metadata.type == "symlink" ? <IconLink size={75} style={{ color: "rgb(90, 200, 250)" }} /> : <IconFileFilled size={75} style={{ color: "rgb(90, 200, 250)" }} />)}
                                            </>}
                                    </Center>
                                    <Center>
                                        <Text align="center">
                                            {file}
                                        </Text>
                                    </Center>
                                </Stack>
                            </Center>
                        </Paper>
                    </Anchor>
                </Grid.Col>
            </Menu.Target>
            <Menu.Dropdown>
                {(metadata.type == "directory" || metadata.type == "symlink") ? "" : <Menu.Item icon={<IconDownload />} onClick={() => {
                    window.open(`/api/instances/${router.query.node}/${router.query.instance}/files/download?path=${path}/${file}`, "_blank")
                }} color="blue">
                    Download
                </Menu.Item>}
                <Menu.Item icon={<IconPencil />} color="teal" onClick={() => rerender()}>
                    Rename
                </Menu.Item>
                <Menu.Item icon={<IconTrash />} color="red" onClick={deleteFile}>
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}