import { getNode, getNodes } from "@/lib/db";
import { validateSession } from "@/lib/oidc";
import { Flex, Title } from "@mantine/core-app";
import { connectOIDC } from "incus";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import StateIndicator from "./stateIndicator";
import StateButtons from "./stateButtons"
import InstanceTabs from "./instanceTabs";

export default async function Layout({ children, params }) {
    //get from cookie
    if (!cookies().has("access_token")) {
        return redirect("/authentication/login");
    }
    let accessToken = cookies().get("access_token").value
    const valid = await validateSession(accessToken);
    if (!valid) {
        return redirect("/authentication/login");
    }
    const { node, instance } = params;
    let nodeData = await getNode(node);
    const client = connectOIDC(nodeData.url, accessToken);
    let { data } = await client.get(`/instances/${instance}`);
    let instanceData = data;
    console.log(instanceData)
    instanceData = instanceData.metadata;
    console.log(instanceData)
    return (
        <>
            <Flex>
                <Flex direction="column">
                    <Title order={1}>{instanceData.config["user.name"] ? instanceData.config["user.name"] : instanceData.name}</Title>
                    <StateIndicator node={nodeData} instance={instanceData} accessToken={accessToken} />
                </Flex>
                <StateButtons node={nodeData} instance={instanceData} accessToken={accessToken} />
            </Flex>
            <InstanceTabs node={nodeData} instance={instanceData} accessToken={accessToken} />
            {children}
        </>
    )
}