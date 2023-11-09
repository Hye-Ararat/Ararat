import { LxdInstance, NodeLxdInstance } from "@/types/instance";
import {
    ActionIcon,
    Anchor,
    Breadcrumbs,
    Button,
    Group,
    Menu,
    SegmentedControl,
    Center,
    Modal,
    TextInput,
    Flex,
    Progress,
    Stack,
    Text
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconFile, IconFolder, IconLayoutGrid, IconLayoutList, IconPlus, IconReload, IconUpload } from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import { GridFileView } from "@/components/instances/instance/files/GridFileView";
import { ListFileView } from "@/components/instances/instance/files/ListFileView";
import { connectOIDC } from "incus";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { useTheme } from "@emotion/react";
import { AxiosError } from "axios"
import { useRouter } from "next/router";
import path from "path";
import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance, getNodeClient } from "@/lib/lxd";
import { client, validateSession } from "@/lib/oidc";
import { redirect } from "@/lib/next";
import { relativeDirMove } from "@/lib/util";
import Link from "next/link";
import { createContext } from "react";
import { getCookie } from "cookies-next";

export const InstanceFileContext = createContext<{ instance: NodeLxdInstance | null, setInstance: (instance: NodeLxdInstance) => void, rerender: () => void }>({ instance: null, setInstance: (instance: NodeLxdInstance) => { }, rerender: () => { } })

export async function getServerSideProps({ req, res, params, query }: GetServerSidePropsContext) {
    if (!params || !params.instance || !params.node) return redirect("/instances");
    var valid = await validateSession((req.cookies as any).access_token)
    if (!valid) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return redirect("/authentication/login")
    };
    if (!query.path) {
        return redirect(`/instances/${params.node}/${(params as ParsedUrlQuery).instance}/files?path=/`)
    }
    try {
        let instance: NodeLxdInstance | undefined = await fetchInstance((params.instance as string), (params.node as string), (req.cookies.access_token as string))
        if (!instance) return { redirect: { permanent: true, destination: `/instances` } };
        let nodeClient = await getNodeClient((params.node as string), (req.cookies.access_token as string))
        let rawFiles = (await nodeClient.get(`/instances/${(params as ParsedUrlQuery).instance}/files?path=${query.path}`))
        if (rawFiles.headers["x-incus-type"] == "symlink") {
            var redirFile: string = rawFiles.data
            return redirect(`/instances/${params.node}/${params.instance}/files?path=${redirFile}`);
        } else if (rawFiles.headers["x-incus-type"] == "directory") {
            let files = rawFiles.data.metadata
            return {
                props: {
                    instance: instance,
                    files,
                    path: query.path,
                    isFile: false
                }
            }
        } else if (rawFiles.headers["x-incus-type"] == "file") {
            return redirect(`/instances/${params.node}/${params.instance}/files/editor?path=${query.path}`)
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
    return redirect(`/instances`);
}



export default function InstanceFiles({ instance, files, path: folderPath }: { instance: NodeLxdInstance, files: string[], path: string }) {
    var access_token = (getCookie("access_token") as string)
    const [inst, setInst] = useState(instance);
    const [isUploading, setIsUploading] = useState(false)
    const [uploadDataDone, setUploadDataDone] = useState(0)
    const inputFile = useRef<HTMLInputElement | null>(null)
    const router = useRouter()
    let [fileView, setFileView] = useState<string>("grid")
    const [filesState, setFilesState] = useState(files)
    useEffect(() => {
        setFilesState(files)
    }, [folderPath])
    const [creatingFile, setCreatingFile] = useState(false);
    const [fileCreateErr, setFileCreateErr] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (creatingFile) {
            let audio = new Audio("/audio/popup.mp3");
            audio.play();
        }
    }, [creatingFile])
    const theme: any = useTheme()

    async function rerender() {
        var client = await connectOIDC(instance.node.url, access_token)
        client.get(`/instances/${instance.name}/files?path=${folderPath}`).then(({ data }) => {
            var newFiles = data.metadata
            setFilesState(newFiles)
        })
    }
    useEffect(() => {
        if (uploadDataDone == 100) {
            setIsUploading(false)
            setUploadDataDone(0)
            rerender()
        }
    }, [uploadDataDone])
    function onProgress(event: any) {
        setUploadDataDone((event.progress as number) * 100)
    }
    function doUpload(file: FileList) {
        if (!file || file.length == 0) return;
        var fileArray = Array.from(file);
        console.log(fileArray.map((s) => { return { name: s.name, progress: 0 } }))
        setIsUploading(true)
        var f = fileArray[0]
        const nodeClient = connectOIDC(instance.node.url, access_token)
        f.arrayBuffer().then((d) => {
            nodeClient.post(`/instances/${instance.name}/files?path=${folderPath}/${f.name}`, d, {
                onUploadProgress: onProgress,
                headers: {
                    "Content-Type": "application/octet-stream"
                }
            }).then(s => {
                console.log("Done")
            }).catch(() => {

            })
        })


    }
    return (
        <>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(f) => { if (!f.currentTarget.files) return; doUpload(f.currentTarget.files) }} />
            <InstanceShell instance={instance} />
            <Modal centered overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} opened={creatingFile} onClose={() => setCreatingFile(false)} title="Create File">
                <TextInput error={fileCreateErr} placeholder="File Name" onChange={(e) => {
                    let audio = new Audio("/audio/ding.wav");
                    setFileCreateErr(undefined);
                    if (e.currentTarget.value.includes("/")) {
                        setFileCreateErr("File name cannot contain /");
                        audio.play();
                    }
                }} />
                <Flex mt="md">
                    <Button disabled={!!fileCreateErr} ml="auto" color="green" variant="light" onClick={() => setCreatingFile(false)}>Create</Button>
                </Flex>
            </Modal>
            <Group spacing={10} mt={"sm"}>
                <ActionIcon color="blue" variant="light" size={"md"} disabled={router.query.path == "/"} onClick={() => {
                    router.replace(`/instances/${(instance.node.name)}/${instance.name}/files?path=${path.resolve((router.query.path as string), relativeDirMove(1))}`)
                }}>
                    <IconArrowLeft />
                </ActionIcon>
                <Breadcrumbs ml={10}>
                    {(router.query.path as string).split("/").map((d, i) => {
                        return (
                            <Link style={{ textDecoration: "none", color: "lightblue" }} href={`/instances/${(instance.node.name)}/${instance.name}/files?path=${path.resolve((router.query.path as string), relativeDirMove(((router.query.path as string).split("/").length - 1) - i))}`}>
                                {d}
                            </Link>
                        )
                    })}
                </Breadcrumbs>
                <SegmentedControl sx={{ marginLeft: "auto" }} color="blue" data={[
                    { label: (<Center><IconLayoutGrid /></Center>), value: "grid" },
                    { label: (<Center><IconLayoutList /></Center>), value: "list" }
                ]} onChange={setFileView} value={fileView} />
                <ActionIcon size={34} variant="light" onClick={rerender} color="blue">
                    <IconReload />
                </ActionIcon>
                <Menu>
                    <Menu.Target>
                        <Button leftIcon={<IconPlus />} color="green" variant="light">
                            Create
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item icon={<IconFolder />}>
                            Directory
                        </Menu.Item>
                        <Menu.Item onClick={() => setCreatingFile(true)} icon={<IconFile />}>
                            File
                        </Menu.Item>
                        <Menu.Item icon={<IconUpload />} onClick={() => {
                            (inputFile.current as HTMLInputElement).click();
                        }}>
                            Upload
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

            </Group>
            {isUploading ? <Progress value={uploadDataDone} mt={10} /> : ""}
            <InstanceFileContext.Provider value={{ setInstance: setInst, instance: inst, rerender }}>
                {fileView == "grid" ? <GridFileView files={filesState.sort((a, b) => a.localeCompare(b))} /> : (fileView == "list" ? <ListFileView files={filesState.sort((a, b) => a.localeCompare(b))} path={folderPath} /> : "")}
            </InstanceFileContext.Provider>
        </>

    )
}