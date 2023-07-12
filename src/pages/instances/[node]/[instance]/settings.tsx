import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { validateSession } from "@/lib/oidc";
import { NodeLxdInstance } from "@/types/instance";
import { Paper, SimpleGrid, TextInput, Textarea, Title, Text, Button, Select, Switch, Flex } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
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
        console.log(instance)
        return {
            props: {
                instance: instance
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceSettings({ instance }: { instance: NodeLxdInstance }) {
    const [instanceState, setInstanceState] = useState<NodeLxdInstance>(instance)
    return (
        <>
            <InstanceShell instance={instance} />
            <SimpleGrid mt="md" cols={2}>
            <Paper p={10} mt="md">
            <Title order={4}>General Information</Title>
            <TextInput mt="xs" label="Name" value={instanceState.name} />
            <Textarea mt="xs" label="Description" value={instanceState.description} />
            </Paper>
            <Paper p={10} mt="md">
            <Title order={4}>Image</Title>
            <Select mt="xs" label="Image" data={[]} />
            <Text size="sm" fw={500} mt="md">Actions</Text>
            <Button mt="xs" variant="light" color="red">Rebuild</Button>
            </Paper>
            <Paper p={10}>
            <Title order={4}>Limits</Title>
            <TextInput mt="xs" label="Exposed CPUs" value={instanceState.expanded_config["limits.cpu"]} />
            <TextInput mt="xs" label="Memory Limit" value={instanceState.expanded_config["limits.memory"]} />
            </Paper>
            <Paper p={10}>
            <Title order={4}>Snapshots</Title>
            <Select mt="xs" label="Snapshot Schedule" data={[]} />
            <TextInput mt="xs" label="Snapshot Expiry" value={instanceState.expanded_config["snapshots.expiry"]} />
            <Switch mt="xs" label="Take Snapshots While Stopped" />
            </Paper>
            </SimpleGrid>
            <Flex mt="md">
            <Button ml="auto" variant="light" color="red">Delete Instance</Button>
            <Button ml="sm" color="blue">Save Changes</Button>
            </Flex>
        </>
    )
}