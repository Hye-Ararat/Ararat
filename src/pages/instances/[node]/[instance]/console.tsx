import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { validateSession } from "@/lib/oidc";
import { NodeLxdInstance } from "@/types/instance";
import { Button, Group, SegmentedControl } from "@mantine/core";
import { IconPlug } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
const InstanceTextConsole = dynamic(() => import('@/components/instances/instance/console/InstanceTextConsole'), {
    loading: () => <p>Loading...</p>,
    ssr: false
})

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

export default function InstanceConsole({ instance }: { instance: NodeLxdInstance }) {
    var [consoleType, setConsoleType] = useState<string>("serial")
    return (
        <>
            <InstanceShell instance={instance} />
            <Group mt={"xs"}>
                <Button color="green" leftIcon={<IconPlug />}>
                    Connect
                </Button>
                <SegmentedControl value={consoleType} color="blue" onChange={setConsoleType} data={[
                    { "label": "Graphical", value: "spice", disabled: instance.type == "container" },
                    { "label": "Text", value: "serial" }
                ]} ml={"auto"} />
            </Group>
            {consoleType == "serial" ?
                <InstanceTextConsole instance={instance} />
                :
                <>
                    AAAAAAAAAAAAAAAAAAA
                </>
            }
        </>
    )
}