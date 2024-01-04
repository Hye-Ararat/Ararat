import { getNodeClient } from "@/lib/lxd";
import { client } from "@/lib/oidc";
import { InstanceFileContext } from "@/pages/instances/[node]/[instance]/files";
import { NodeLxdInstance } from "@/types/instance";
import { Anchor, Button, Center, Grid, Group, Menu, Paper, Popover, Stack, Text, Tooltip, UnstyledButton, Loader, Table, ActionIcon, Checkbox, Flex, Dialog, Title } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconFileUpload, IconFileZip } from "@tabler/icons-react";
import { IconBorderHorizontal, IconDotsVertical, IconDownload, IconFile, IconFileFilled, IconFolder, IconFolderFilled, IconLink, IconPencil, IconTrash, IconZip } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { connectOIDC } from "incus";
import Link from "next/link";
import { useRouter } from "next/router";
import { tmpdir } from "os";
import prettyBytes from "pretty-bytes";
import { useContext, useEffect, useState } from "react";
import { Dropzone } from "@mantine/dropzone"


export function ListFileView({ files, path }: { files: string[], path: string }) {
    var access_token = (getCookie("access_token") as string)
    const { instance, rerender }: { instance: NodeLxdInstance, rerender: () => void } = (useContext(InstanceFileContext) as any)
    var initialCheckedFiles = ([] as { id: string, checked: boolean }[])
    files.forEach(file => initialCheckedFiles.push({ id: file, checked: false }))
    var [selectedFiles, setSelectedFiles] = useState<{ id: string, checked: boolean }[]>(initialCheckedFiles)
    const [leftValue, setLeftValue] = useState(0);
    const [unzipStatus, setUnzipStatus] = useState("")
    useEffect(() => {
        setLeftValue((window.innerWidth / 2) - (111 / 2))
    }, [])
    return (
        <>
            {unzipStatus}
            <Dropzone.FullScreen style={{ height: "100%" }} onDrop={(files) => console.log(files)} >
                <Flex direction="column" style={{ width: "100%", height: "100%" }} my="auto" mx="auto">
                    <IconFileUpload size={128} style={{ color: "rgb(90, 200, 250)", marginLeft: "auto", marginRight: "auto", marginTop: "30vh" }} />
                    <Title order={2} mx="auto" mt="sm">Drop Files Here</Title>
                </Flex>
            </Dropzone.FullScreen >
            <Table striped highlightOnHover>
                <thead >
                    <tr>
                        <td>
                            <Checkbox pl={10} my={10} style={{ cursor: "pointer" }} disabled={files.length == 0} checked={(selectedFiles.filter(s => s.checked == true).length > 0)} indeterminate={((selectedFiles.filter(s => s.checked == true).length > 0) && (selectedFiles.filter(s => s.checked == true).length != files.length))} onChange={(change) => {
                                var tmp = [...selectedFiles]
                                tmp = tmp.map(f => { return { id: f.id, checked: change.currentTarget.checked } })
                                setSelectedFiles(tmp)
                            }} />
                        </td>
                        <td>
                            <Text ml={8}>
                                Name
                            </Text>

                        </td>
                        <td>
                            <Text ml={8}>
                                Type
                            </Text>

                        </td>
                        <td>
                            <Text ml={8}>
                                Last modified
                            </Text>

                        </td>
                        <td>
                            <Text ml={8}>
                                Size
                            </Text>

                        </td>
                        <td>
                            <Text ml={8}>
                                Mode
                            </Text>

                        </td>
                    </tr>
                </thead>
                <tbody>

                    {files.map((file) => {
                        return <ListFileViewItem setUnzipStatus={setUnzipStatus} file={file} setSelectedFiles={setSelectedFiles} selectedFiles={selectedFiles} />
                    })}

                </tbody>
            </Table >
            <Flex>
                <Dialog transition={"pop"} opened={selectedFiles.filter(s => s.checked == true).length > 0} sx={{ width: 111 }} radius="md" position={{ bottom: 80, left: leftValue }}>
                    <Button onClick={() => {
                        async function deleteFiles() {
                            var files = selectedFiles;
                            var client = connectOIDC((instance?.node.url as string), access_token)
                            Promise.all(files.map((file) => {
                                client.delete(`/instances/${instance.name}/files?path=${path}/${file.id}`).then(s => {
                                    setTimeout(() => {
                                        rerender()

                                    }, 50)
                                }).catch(() => {
                                })
                            }))
                        }
                        deleteFiles()
                        var tmp = [...selectedFiles]
                        tmp = tmp.map(f => { return { id: f.id, checked: false } })
                        setSelectedFiles(tmp)
                    }} color="red">Delete</Button>
                </Dialog>
            </Flex>


            {/* {selectedFiles.filter(s => s.checked == true).length > 0 ? <>

                <Group ml={"auto"}>
                    <Button color="red" variant="light" leftIcon={<IconTrash />} onClick={() => {
                        async function deleteFiles() {
                            var files = selectedFiles;
                            var client = connectOIDC((instance?.node.url as string), access_token)
                            Promise.all(files.map((file) => {
                                client.delete(`/instances/${instance.name}/files?path=${path}/${file.id}`).then(s => {
                                    setTimeout(() => {
                                        rerender()

                                    }, 50)
                                }).catch(() => {
                                })
                            }))
                        }
                        deleteFiles()
                        var tmp = [...selectedFiles]
                        tmp = tmp.map(f => { return { id: f.id, checked: false } })
                        setSelectedFiles(tmp)
                    }}>
                        Delete
                    </Button>
                </Group>
            </> : ""} */}
        </>

    )
}
function ListFileViewItem({ file, setSelectedFiles, selectedFiles, setUnzipStatus }: { file: string, selectedFiles: { id: string, checked: boolean }[], setSelectedFiles: (files: { id: string, checked: boolean }[]) => void }) {
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
            console.log(body)
            setMetadata({
                type: body["x-incus-type"],
                mode: body["x-incus-mode"],
                gid: body["x-incus-gid"],
                modified: body["x-incus-modified"],
                uid: body["x-incus-uid"],
                size: body.size
            })
            setLoading(false)
        })
    }, [])

    async function deleteFile() {
        const nodeClient = connectOIDC(instance.node.url, access_token)
        nodeClient.delete(`/instances/${instance.name}/files?path=${path}/${file}`).then(s => {
            setTimeout(() => {
                rerender()
            }, 50)
        }).catch(() => {
        })
    }
    async function unzipFile() {
        const ws = new WebSocket(`${instance.node.url.replace("8443", "3001").replace("https", "wss")}/instances/${instance.name}/files/unzip?path=${path}/${file}`)
        ws.onmessage = (ev) => {
            setUnzipStatus(ev.data)
        }
    }

    function setSelect(checked: boolean) {
        if (checked == false) {
            var i = selectedFiles.findIndex(s => s.id == file)
            var tmp = [...selectedFiles]
            tmp[i].checked = false
            setSelectedFiles(tmp)
        } else {
            var i = selectedFiles.findIndex(s => s.id == file)
            var tmp = [...selectedFiles]
            tmp[i].checked = true
            setSelectedFiles(tmp)
        }
    }

    return (
        <Menu opened={opened} withArrow >
            <Menu.Target>
                <tr onContextMenu={(e) => {
                    e.preventDefault()
                    setOpened(!opened)
                }} ref={ref} style={{ cursor: "pointer" }}>
                    <td >
                        <Group>
                            <Checkbox checked={selectedFiles.find(s => s.id == file)?.checked} onChange={(change) => {
                                setSelect(change.currentTarget.checked)
                            }} />

                            {loading ?
                                <Loader size={28} />
                                : <>
                                    {metadata.type == "directory" ? <IconFolderFilled size={28} style={{ color: "rgb(90, 200, 250)" }} /> : (metadata.type == "symlink" ? <IconLink size={28} style={{ color: "rgb(90, 200, 250)" }} /> : <IconFileFilled size={28} style={{ color: "rgb(90, 200, 250)" }} />)}
                                </>}
                        </Group>

                    </td>
                    <td onClick={() => {
                        console.log(path, file)
                        router.push(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }}>
                        {file}
                    </td>
                    <td onClick={() => {
                        console.log(path, file)
                        router.push(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }}>
                        {loading ?
                            <Loader size={28} />
                            : <>
                                {metadata.type}
                            </>}
                    </td>
                    <td onClick={() => {
                        console.log(path, file)
                        router.push(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }}>
                        {loading ?
                            <Loader size={28} />
                            : <>
                                {metadata.modified}
                            </>}
                    </td>
                    <td onClick={() => {
                        console.log(path, file)
                        router.push(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }}>
                        {loading ?
                            <Loader size={28} />
                            : <>
                                {prettyBytes(metadata.size)}
                            </>}
                    </td>
                    <td onClick={() => {
                        console.log(path, file)
                        router.push(`/instances/${router.query.node}/${router.query.instance}/files?path=${path}/${file}`)
                    }}>
                        {loading ?
                            <Loader size={28} />
                            : <>
                                {metadata.mode}
                            </>}
                    </td>
                </tr>
            </Menu.Target>
            <Menu.Dropdown>
                {(metadata.type == "directory" || metadata.type == "symlink") ? "" : <Menu.Item icon={<IconDownload />} color="blue">
                    Download
                </Menu.Item>}
                {file.endsWith(".zip") ?
                    <Menu.Item icon={<IconFileZip />} color="yellow" onClick={() => unzipFile()}>
                        Unzip
                    </Menu.Item>
                    : ""}
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