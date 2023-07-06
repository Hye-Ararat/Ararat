import { use, useEffect, useState } from 'react';
import { Badge, Button, Flex, Tabs, Title } from '@mantine/core';
import Link from 'next/link';
import { IconBox, IconFolder, IconHistory, IconHome, IconNetwork, IconSettings, IconTerminal2, IconWifi } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { connectOIDC } from 'js-lxd';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { LxdInstance } from '@/types/instance';
import { InstanceDashboard } from '@/components/instances/instance/InstanceDashboard';
import { InstanceConsole } from '@/components/instances/instance/InstanceConsole';
import { InstanceFiles } from '@/components/instances/instance/InstancesFiles';
import { InstanceVolumes } from '@/components/instances/instance/InstanceVolumes';
import { InstanceSnapshots } from '@/components/instances/instance/InstanceSnapshots';
import { InstanceSettings } from '@/components/instances/instance/InstanceSettings';
import { InstanceNetworks } from '@/components/instances/instance/InstanceNetworks';
import { capitalizeFirstLetter, getBadgeColor } from '@/lib/util';

export async function getServerSideProps({ req, res, params }: GetServerSidePropsContext) {
    // TODO: iterate nodes
    console.log(req.cookies)
    let client = connectOIDC("https://10.17.167.6:8443", (req.cookies.access_token as string))
    try {
        let instance = (await client.get(`/instances/${(params as ParsedUrlQuery).instance}?recursion=1`)).data.metadata
        return {
            props: {
                instance
            }
        }
    } catch (error) {
        res.setHeader("Set-Cookie", ["access_token=deleted; Max-Age=0"])
        return {
            redirect: {
                permanent: false,
                destination: `/authentication/login`
            },
        };
    }
}

export default function Instance({ instance }: { instance: LxdInstance }) {
    return (
        <>
            <Flex>
                <div>
                    <Title order={1}>{instance.name}</Title>
                    <Badge color={getBadgeColor(instance.status)}>{capitalizeFirstLetter(instance.status)}</Badge>
                </div>
                <Button variant="filled" color="green" sx={{ marginLeft: "auto", marginRight: 10, marginTop: "auto", marginBottom: "auto" }} disabled={(instance.status == "Running")}>Start</Button>
                <Button variant="filled" sx={{ marginRight: 10, marginTop: "auto", marginBottom: "auto" }} color="red" disabled={(instance.status == "Stopped")}>Stop</Button>
                <Button variant="filled" sx={{ marginTop: "auto", marginBottom: "auto" }} color="yellow" disabled={(instance.status == "Stopped")}>Restart</Button>

            </Flex>
            <Tabs sx={{ marginTop: 10 }} defaultValue={"dashboard"}>
                <Tabs.List>
                    <Tabs.Tab icon={<IconHome size="0.8rem" />} value="dashboard">Dashboard</Tabs.Tab>
                    <Tabs.Tab icon={<IconTerminal2 size="0.8rem" />} value="console">Console</Tabs.Tab>
                    <Tabs.Tab icon={<IconFolder size="0.8rem" />} value="files">Files</Tabs.Tab>
                    <Tabs.Tab icon={<IconNetwork size="0.8rem" />} value="networks">Networks</Tabs.Tab>
                    <Tabs.Tab icon={<IconBox size="0.8rem" />} value="volumes">Volumes</Tabs.Tab>
                    <Tabs.Tab icon={<IconHistory size="0.8rem" />} value="snapshots">Snapshots</Tabs.Tab>
                    <Tabs.Tab icon={<IconSettings size="0.8rem" />} value="settings">Settings</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="dashboard">
                    <InstanceDashboard instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="console">
                    <InstanceConsole instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="files">
                    <InstanceFiles instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="networks">
                    <InstanceNetworks instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="volumes">
                    <InstanceVolumes instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="snapshots">
                    <InstanceSnapshots instance={instance} />
                </Tabs.Panel>
                <Tabs.Panel value="settings">
                    <InstanceSettings instance={instance} />
                </Tabs.Panel>
            </Tabs>
        </>
    );
}