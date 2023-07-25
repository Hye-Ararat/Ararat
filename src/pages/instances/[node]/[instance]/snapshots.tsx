import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { client, validateSession } from "@/lib/oidc";
import { formatDate } from "@/lib/util";
import { LxdInstance, LxdSnapshot, NodeLxdInstance } from "@/types/instance";
import { Flex, Title, Button, TextInput, Text, Paper, SimpleGrid, Checkbox } from "@mantine/core";
import { getCookie } from "cookies-next";
import { connectOIDC } from "js-lxd";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import prettyBytes from "pretty-bytes";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

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
        const client = connectOIDC(instance?.node.url, (req.cookies as any).access_token)
        var snapshots = (await client.get(`/instances/${instance.name}/snapshots?recursion=1`)).data.metadata
        return {
            props: {
                instance: instance,
                snapshots
            }
        }
    } catch (error) {
        console.log(error)
        return redirect(`/instances`);
    }
}

export default function InstanceSnapshots({ instance, snapshots }: { instance: NodeLxdInstance, snapshots: any[] }) {
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    var [snapshotName, setSnapshotName] = useState<string>()
    const [snapshotTimes, setSnapshotTimes] = useState<any[]>([]);
    useEffect(() => {
        let snapDates: any[] = [];
        snapshots.forEach((snapshot) => {
            let date = formatDate(new Date(snapshot.created_at));
            snapDates.push(date);
        });
        setSnapshotTimes(snapDates);
    }, [])
    const router = useRouter();
    return (
        <>
            <InstanceShell instance={instance} />
            <Flex mt="md" mb="md">
                <Title order={4} my="auto">Snapshots</Title>
                <TextInput ml="auto" mr={10} placeholder="Snapshot Name" onChange={(s) => setSnapshotName(s.currentTarget.value)}></TextInput>
                <Button my="auto" variant="light" color="green" onClick={() => {
                    console.log(snapshotName)
                    if (snapshotName) {
                        client.post(`/instances/${instance.name}/snapshots`, {
                            name: snapshotName
                        }).then((s) => {
                            console.log(s)
                            router.push(window.location.pathname);

                        })
                    }
                }}>Take Snapshot</Button>
            </Flex>
            {snapshots.map((snapshot, index) => {
                return (
                    <Paper style={{ padding: 10, marginBottom: 10 }}>
                        <SimpleGrid cols={5}>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {snapshot.name}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Name
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text>
                                    <Checkbox readOnly checked={snapshot.stateful} indeterminate={!snapshot.statef}></Checkbox>
                                </Text>

                                <Text c="dimmed" fz="xs">
                                    Stateful
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>

                                    {prettyBytes(snapshot.size)}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Size
                                </Text>
                            </div>
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                <Text fz="md" fw={550}>
                                    {snapshotTimes[index] ? snapshotTimes[index] : ""}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                    Created At
                                </Text>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                <Flex direction={"column"}>
                                    <Button size="xs" mb="xs" variant="light" onClick={async () => {
                                        await client.put(`/instances/${instance.name}`, {
                                            restore: snapshot.name,
                                            stateful: false
                                        });
                                        router.push(router.asPath);
                                    }}>
                                        Restore Snapshot
                                    </Button>
                                    <Button size="xs" variant="light" color="red" onClick={async () => {
                                        await client.delete(`/instances/${instance.name}/snapshots/${snapshot.name}`);
                                        router.push(router.asPath);
                                    }}>
                                        Delete Snapshot
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