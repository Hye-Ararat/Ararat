import { use, useContext, useEffect, useState } from 'react';
import { Badge, Button, Flex, Tabs, Title, Text } from '@mantine/core';
import Link from 'next/link';
import { IconBox, IconFolder, IconHistory, IconHome, IconNetwork, IconServer2, IconSettings, IconTerminal2, IconWifi } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { getBadgeColor } from '@/lib/util';
import { getVendorLogo } from '@/lib/logo';

export default function NodeShell({ node, resources }: { node: any, resources: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard")
  useEffect(() => {
    if (router.pathname == "/nodes/[node]") setActiveTab("dashboard");
    if (router.pathname == "/nodes/[node]/storage-pools") setActiveTab("storage-pools");
    if (router.pathname == "/nodes/[node]/networks") setActiveTab("networks");
    if (router.pathname == "/nodes/[node]/settings") setActiveTab("settings");

  }, [router.asPath])
  return (
    <>
      <Flex>
        <div style={{marginRight: "15px", marginTop: "auto", marginBottom: "auto", maxHeight: "60px"}}>
      {getVendorLogo(resources.system.vendor, "60px")}
      </div>
        <div>
            <Flex>
          <Title order={1}>{node.name}</Title>
          </Flex>
         <Text>{resources.system.product}</Text>
        </div>

      </Flex>
      <Tabs value={activeTab} sx={{ marginTop: 10 }} >
        <Tabs.List>
          <Link href={`/nodes/${node.name}`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconHome size="0.8rem" />} value="dashboard">Dashboard</Tabs.Tab>
          </Link>
          <Link href={`/nodes/${node.name}/storage-pools`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconServer2 size="0.8rem" />} value="storage-pools">Storage Pools</Tabs.Tab>
          </Link>
          <Link href={`/nodes/${node.name}/networks`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconNetwork size="0.8rem" />} value="networks">Networks</Tabs.Tab>
          </Link>

          <Link href={`/nodes/${node.name}/settings`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconSettings size="0.8rem" />} value="settings">Settings</Tabs.Tab>
          </Link>
        </Tabs.List>
      </Tabs>
    </>
  );
}