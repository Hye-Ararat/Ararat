import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { validateSession } from "@/lib/oidc";
import { NodeLxdInstance } from "@/types/instance";
import { Paper, SimpleGrid, TextInput, Textarea, Title, Text, Button, Select, Switch, Flex } from "@mantine/core";
import { getCookie } from "cookies-next";
import { connectOIDC } from "incus";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";

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
        const client = connectOIDC(instance.node.url, req.cookies["access_token"]);
        let nodeInfo = await (await client.get("/resources")).data.metadata;
        let formattedImages = [];
        try {
            let res = await fetch("https://images.linuxcontainers.org/streams/v1/images.json", {
                method: "GET",
                cache: "no-cache"
            })
            let data = await res.json();
            let formattedImages = [];
            Object.keys(data.products).forEach((image) => {
                let supportedArch = "";
                if (nodeInfo.cpu.architecture == "x86_64") supportedArch = "amd64";
                if (nodeInfo.cpu.architecture == "aarch64") supportedArch = "arm64";
                if (data.products[image].arch !== supportedArch) return;
                formattedImages.push({
                    value: data.products[image],
                    label: data.products[image].aliases.split(",")[0],
                    title: data.products[image].os + " " + data.products[image].release_title,
                    description: data.products[image].variant + " variant",
                    os: data.products[image].os.toLowerCase(),
                    group: "Linux Containers"
                })
            })
        } catch (error) {
            console.log(instance);
            return {
                props: {
                    instance: instance,
                    images: []
                }
            }
        }

        console.log(instance)
        console.log(formattedImages)
        return {
            props: {
                instance: instance,
                images: formattedImages
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceSettings({ instance, images }: { instance: NodeLxdInstance }) {
    const [instanceState, setInstanceState] = useState<NodeLxdInstance>(instance)
    const router = useRouter();
    return (
        <>
            <InstanceShell instance={instance} />
            <SimpleGrid mt="md" cols={2}>
                <Paper p={10} mt="md">
                    <Title order={4}>General Information</Title>
                    <TextInput disabled={true} description="Changing instance name is not currently supported" onChange={(e) => setInstanceState({ ...instanceState, name: e.target.value })} mt="xs" label="Name" value={instanceState.name} />
                    <Textarea onChange={(e) => setInstanceState({ ...instanceState, description: e.currentTarget.value })} mt="xs" label="Description" value={instanceState.description} />
                </Paper>
                <Paper p={10} mt="md">
                    <Title order={4}>Image</Title>
                    <Select disabled={true} mt="xs" label="Image" data={images} description="Changing instance image is not currently supported" />
                    <Text size="sm" fw={500} mt="md">Actions</Text>
                    <Button mt="xs" variant="light" color="red">Rebuild</Button>
                </Paper>
                <Paper p={10}>
                    <Title order={4}>Limits</Title>
                    <TextInput onChange={(e) => {
                        let tempConfig = { ...instanceState };
                        tempConfig.config["limits.cpu"] = e.target.value;
                        setInstanceState(tempConfig)
                    }} mt="xs" label="Exposed CPUs" value={instanceState.config["limits.cpu"]} />
                    <TextInput onChange={(e) => {
                        let tempConfig = { ...instanceState };
                        tempConfig.config["limits.memory"] = e.target.value;
                        setInstanceState(tempConfig)
                    }} mt="xs" label="Memory Limit" value={instanceState.config["limits.memory"]} />
                </Paper>
                <Paper p={10}>
                    <Title order={4}>Snapshots</Title>
                    <Select onChange={(e) => {
                        let newConfig = { ...instanceState };
                        newConfig.config["snapshots.schedule"] = e;
                        setInstanceState(newConfig)
                    }} value={instanceState.config["snapshots.schedule"]} mt="xs" label="Snapshot Schedule" data={[{ value: "@hourly", label: "Hourly" }, { value: "@daily", label: "Daily" }, { value: "@weekly", label: "Weekly" }, { value: "@monthly", label: "Monthly" }, { value: "@yearly", label: "Yearly" }]} />
                    <TextInput onChange={(e) => {
                        let newConfig = { ...instanceState };
                        newConfig.config["snapshots.expiry"] = e.target.value;
                        setInstanceState(newConfig);
                    }} mt="xs" label="Snapshot Expiry" value={instanceState.config["snapshots.expiry"]} />
                    <Switch onChange={(e) => {
                        let newConfig = { ...instanceState };
                        newConfig.config["snapshots.stopped"] = e.target.checked ? "true" : "false";
                        setInstanceState(newConfig);
                    }} checked={instanceState.config["snapshots.stopped"] == "true"} mt="xs" label="Take Snapshots While Stopped" />
                </Paper>
            </SimpleGrid>
            <Flex mt="md">
                <Button ml="auto" variant="light" color="red" onClick={async (e) => {
                    const client = connectOIDC(instance.node.url, getCookie("access_token"));
                    await client.delete(`/instances/${instance.name}`);
                    router.push("/instances");
                }}>Delete Instance</Button>
                <Button onClick={async () => {


                    const client = connectOIDC(instance.node.url, getCookie("access_token"));
                    await client.put(`/instances/${instance.name}`, instanceState);
                    router.push(router.asPath)
                }} ml="sm" color="blue">Save Changes</Button>
            </Flex>
        </>
    )
}