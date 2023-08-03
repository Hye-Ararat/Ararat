import InstanceShell from "@/components/instances/instance/InstanceShell";
import { fetchInstance } from "@/lib/lxd";
import { redirect } from "@/lib/next";
import { validateSession } from "@/lib/oidc";
import { NodeLxdInstance } from "@/types/instance";
import { Center, Flex, SegmentedControl, Title } from "@mantine/core";
import { IconAppWindow, IconTerminal } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
const InstanceTextConsole = dynamic(() => import('@/components/instances/instance/console/InstanceTextConsole'), {
    loading: () => <p>Loading...</p>,
    ssr: false
})
const InstanceVGAConsole = dynamic(() => import('@/components/instances/instance/console/InstanceVGAConsole'), {
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
            <Flex mt={"xs"}>
                <Title mt="auto" mb="auto" order={3}>Console</Title>
                <SegmentedControl value={consoleType} color="blue" onChange={setConsoleType} data={[
                    { "label": (<Center><IconAppWindow /></Center>), value: "spice", disabled: instance.type == "container" },
                    { "label": (<Center><IconTerminal /></Center>), value: "serial" }
                ]} ml={"auto"} />
            </Flex>
            <div style={{ display: (consoleType == "serial" ? null : "none" as any) }}>
                <InstanceTextConsole instance={instance} />
            </div>
            {consoleType == "spice" ? <InstanceVGAConsole instance={instance} /> : ""}



        </>
    )
}