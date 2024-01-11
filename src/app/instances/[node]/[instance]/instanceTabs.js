"use client";

import { Tabs } from "@mantine/core-app";
import Link from "next/link";
import { IconBox, IconFolder, IconHistory, IconHome, IconNetwork, IconSettings, IconTerminal2, IconWifi } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function InstanceTabs({ instance, node, accessToken }) {
    const [activeTab, setActiveTab] = useState(undefined)
    const pathname = usePathname();
    console.log(pathname)
    console.log(node)
    return (
        <Tabs value={pathname} sx={{ marginTop: 10 }} mt="sm" >
            <Tabs.List>
                <Link href={`/instances/${node.name}/${instance.name}`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconHome size="0.8rem" />} value={`/instances/${node.name}/${instance.name}`}>Dashboard</Tabs.Tab>
                </Link>
                <Link href={`/instances/${node.name}/${instance.name}/console`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconTerminal2 size="0.8rem" />} value={`/instances/${node.name}/${instance.name}/console`}>Console</Tabs.Tab>
                </Link>
                <Link href={`/instances/${node._id}/${instance.name}/files`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconFolder size="0.8rem" />} value={`/instances/${node._id}/${instance.name}/filesNew`}>Files</Tabs.Tab>
                </Link>
                <Link href={`/instances/${node.name}/${instance.name}/networks`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconNetwork size="0.8rem" />} value={`/instances/${node.name}/${instance.name}/networks`}>Networks</Tabs.Tab>
                </Link>
                <Link href={`/instances/${node.name}/${instance.name}/volumes`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconBox size="0.8rem" />} value={`/instances/${node.name}/${instance.name}/volumes`}>Volumes</Tabs.Tab>
                </Link>
                <Link href={`/instances/${node.name}/${instance.name}/snapshots`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconHistory size="0.8rem" />} value={`/instances/${node.name}/${instance.name}/snapshots`}>Snapshots</Tabs.Tab>
                </Link>

                <Link href={`/instances/${node.name}/${instance.name}/settings`} style={{ textDecoration: "none", color: "inherit" }} >
                    <Tabs.Tab leftSection={<IconSettings size="0.8rem" />} value={`/instances/${node.name}/${instance.name}/settings`}>Settings</Tabs.Tab>
                </Link>
            </Tabs.List>
        </Tabs>
    )
}