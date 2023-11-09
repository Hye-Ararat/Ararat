import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance, getNodeClient } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { client, validateSession } from "@/lib/oidc";
import { NodeLxdInstance } from "@/types/instance";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import Editor, { Monaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import { connectOIDC } from "incus";
import { getCookie } from "cookies-next";
import { monacoTheme } from "@/lib/theme";
import { relativeDirMove } from "@/lib/util";
import { Group, ActionIcon, Breadcrumbs, SegmentedControl, Center, Menu, Button, Loader, Progress, MantineTheme, useMantineTheme, Stack } from "@mantine/core";
import { IconArrowLeft, IconLayoutGrid, IconLayoutList, IconReload, IconPlus, IconFolder, IconFile, IconUpload, IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import path from "path";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { isBinaryFile } from "arraybuffer-isbinary"
import { AxiosResponse } from "axios"
import https from "https"
import { IncomingMessage } from "http";
import { Node } from "@/types/db"
import mongo from "@/lib/mongo";
import request from "request"

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
        var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
        var node = nodes.find(n => n.name == params.node)

        var r = request(`${node?.url}/1.0/instances/${(params as ParsedUrlQuery).instance}/files?path=${query.path}`, {
            headers: {
                Authorization: `Bearer ${req.cookies.access_token}`,
                "X-Incus-oidc": "true",
            },
            rejectUnauthorized: false
        });

        var { headers, isText }: any = await new Promise((resolve, reject) => {
            r.on('response', response => {
                response.on("data", (c) => {
                    resolve({ headers: response.headers, isText: !isBinaryFile(c) })
                    r.abort()
                })
            }).on("error", err => { });
        })


        var fileData: any = headers
        if (fileData["x-incus-type"] == "file") {
            return {
                props: {
                    instance,
                    file: fileData,
                    fileName: (query.path as string).split("/")[(query.path as string).split("/").length - 1],
                    fileUrl: `/instances/${(params as ParsedUrlQuery).instance}/files?path=${query.path}`,
                    isBinary: !isText
                }
            }
        } else {
            return redirect(`/instances/${params.node}/${params.instance}/files?path=${query.path}`)
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceFileEditor({ file, instance, fileUrl, fileName, isBinary }: { isBinary: boolean, file: any, instance: NodeLxdInstance, fileUrl: string, fileName: string }) {
    const theme = useMantineTheme()
    const router = useRouter()
    var access_token = (getCookie("access_token") as string)
    var [value, setValue] = useState<string>()
    var [initialValue, setInitialValue] = useState<string>()
    var [monacoEditor, setMonacoEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
    var [progress, setProgress] = useState(0)
    var client = connectOIDC(instance.node.url, access_token)
    async function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
        setMonacoEditor(editor)
        var data = await client.get(fileUrl, {
            onDownloadProgress: (event) => {
                setProgress((event.progress as number))
                console.log(event)
            },
        })
        setProgress(100)
        setInitialValue(data.data)
        setValue(data.data)
        const model = monaco.editor.createModel(
            data.data,
            undefined, // language
            monaco.Uri.file(fileName) // uri
        )
        console.log(model.getLanguageId())
        editor.setModel(model)
        monaco.editor.defineTheme("hye-dark", monacoTheme)
        monaco.editor.setTheme("hye-dark")
    }
    async function saveFile(content: any) {
        const nodeClient = connectOIDC(instance.node.url, access_token)
        setProgress(0)
        nodeClient.post(fileUrl, content.toString(), {
            onUploadProgress: (event) => {
                setProgress((event.progress as number))
            },
            headers: {
                "Content-Type": "application/octet-stream"
            }
        }).then(s => {
            setProgress(100)
        }).catch(() => {

        })
    }
    var splitPath = (router.query.path as string).split("/")
    splitPath.shift()
    return (
        <>
            <InstanceShell instance={instance} />
            <Group spacing={10} mt={"sm"} mb={"sm"}>
                <ActionIcon color="blue" variant="light" size={"md"} onClick={() => {
                    router.replace(`/instances/${(instance.node.name)}/${instance.name}/files?path=${path.resolve((router.query.path as string), relativeDirMove(1))}`)
                }}>
                    <IconArrowLeft />
                </ActionIcon>
                <Breadcrumbs ml={10}>
                    {splitPath.map((d, i) => {
                        return (
                            <Link style={{ textDecoration: "none", color: theme.colorScheme == "dark" ? "#fff" : "rgb(0, 0, 0)" }} href={`/instances/${(instance.node.name)}/${instance.name}/files?path=${path.resolve((router.query.path as string), relativeDirMove(((router.query.path as string).split("/").length - 1) - i))}`}>
                                {d}
                            </Link>
                        )
                    })}
                </Breadcrumbs>


                <ActionIcon size={34} variant="light" disabled={!monacoEditor} onClick={async () => {
                    console.log("reload")
                    if (monacoEditor) {
                        console.log("editor")
                        var data = await client.get(fileUrl, {
                            onDownloadProgress: (event) => {
                                setProgress((event.progress as number))
                                console.log(event)
                            },
                        })
                        setProgress(100)
                        monacoEditor.setValue(data.data)
                    }
                }} color="blue" ml={"auto"}>
                    <IconReload />
                </ActionIcon>
                <ActionIcon size={34} variant="light" color="green" disabled={(value == initialValue) || !monacoEditor} onClick={() => {
                    console.log(value)
                    saveFile(value)
                }}>
                    <IconDeviceFloppy />
                </ActionIcon>
            </Group>
            {file["content-length"] > 500000000 ?
                <Stack>
                    <Center>
                        {isBinary ? "Binary files cannot be displayed in the editor, instead" : "Files bigger than 500MB are not supported by the built in editor, instead"}
                    </Center>
                    <Center>
                        <Button onClick={() => {
                            var u = new URL(fileUrl, "http://test/")
                            window.open(`/api/instances/${(instance.node.name)}/${instance.name}/files/download${u.search}`, "_blank")
                        }}>Download</Button>
                    </Center>
                </Stack>
                :
                <>
                    {progress == 100 ? "" : <Progress value={progress} mb="sm" />}
                    <Editor height={"78%"} onMount={handleEditorDidMount} loading={<Center><Loader /></Center>} onChange={(newValue) => {
                        setValue(newValue)
                    }} theme="hye-dark" />
                </>
            }

        </>
    )
}