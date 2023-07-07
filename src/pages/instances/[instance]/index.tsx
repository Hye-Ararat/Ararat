import { use, useContext, useEffect, useState } from 'react';
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
import { InstanceContext } from '@/components/AppShell';

export async function getServerSideProps({ req, res, params }: GetServerSidePropsContext) {
    // TODO: iterate nodes
    console.log(req.cookies)
    let client = connectOIDC("https://192.168.1.133:8443", (req.cookies.access_token as string))
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
    const [instanceData, setInstanceData]= useContext(InstanceContext); 
    useEffect(() => {
        setInstanceData(instance);
    }, [])
    return (
        <>
        <p>Dashboard</p>
        </>
    );
}