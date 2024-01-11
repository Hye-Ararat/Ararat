import { fetchInstance, getNodeClient } from "@/lib/lxd"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Breadcrumbs, Flex, ActionIcon, Button } from "@mantine/core-app";
import Link from "next/link";
import Create from "./create";
import { IconArrowLeft } from "@tabler/icons-react";
import File from "./file";
import { getNode } from "@/lib/db";


export default async function Files({ params, searchParams }) {
    const accessToken = cookies().get("access_token").value
    const node = await getNode(params.node)
    let instanceData = await fetchInstance(params.instance, params.node, accessToken);

    function fileLink(path) {
        return `/instance/${params.node}/${params.instance}/files?path=${path}`
    }

    let basePath = instanceData.config["user.stateless-directory"] ? instanceData.config["user.stateless-directory"] : "/"
    if (!searchParams.path) {
        if (instanceData.config["user.stateless-directory"]) {
            return redirect(fileLink(basePath))
        }
        return redirect(fileLink(basePath))
    }
    const nodeClient = await getNodeClient(params.node, accessToken);
    const files = (await nodeClient.get(`/instances/${params.instance}/files?path=${searchParams.path}`)).data.metadata
    return (
        <>
            <Flex mt="xs">
                <Link href={fileLink(searchParams.path.split("/").slice(0, -1).join("/"))}>
                    <ActionIcon color="blue" variant="light" size="md" disabled={searchParams.path == basePath}>
                        <IconArrowLeft />
                    </ActionIcon>
                </Link>
                <Breadcrumbs my="auto" ml="md">
                    {searchParams.path.split("/").map((path, index) => {
                        if (path == "") {
                            return
                        }
                        let pathString = searchParams.path.split("/").slice(0, index + 1).join("/")
                        return <Link href={fileLink(pathString)}>{path}</Link>
                    })}
                </Breadcrumbs>
                <Create path={searchParams.path} instance={instanceData} node={params.node} />
            </Flex>
            {files.map((file) => {
                return <File accessToken={accessToken} path={searchParams.path} file={file} node={node} instance={instanceData} />
            })}
        </>
    )
}