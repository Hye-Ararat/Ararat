import { use, useEffect, useState } from 'react';
import { Badge, Button, Flex, Tabs, Title } from '@mantine/core';
import Link from 'next/link';
import { IconBox, IconFolder, IconHistory, IconHome, IconSettings, IconTerminal2 } from '@tabler/icons-react';
import { useRouter } from 'next/router';

export default function InstanceTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard")
  useEffect(() => {
    if (router.pathname == "/instances/[instance]") setActiveTab("dashboard");
    if (router.pathname == "/instances/[instance]/console") setActiveTab("console");
    if (router.pathname == "/instances/[instance]/files") setActiveTab("files");
    if (router.pathname == "/instances/[instance]/snapshots") setActiveTab("snapshots");
    if (router.pathname == "/instances/[instance]/volumes") setActiveTab("volumes");
    if (router.pathname == "/instances/[instance]/settings") setActiveTab("settings");

  }, [router.asPath])
  return (
    <>
      <Flex>
        <div>
          <Title order={1}>{router.query.instance}</Title>
          <Badge color="green" variant="dot">Online</Badge>
        </div>
        <Button variant="filled" color="green" sx={{ marginLeft: "auto", marginRight: 10, marginTop: "auto", marginBottom: "auto" }} disabled>Start</Button>
        <Button variant="filled" sx={{ marginRight: 10, marginTop: "auto", marginBottom: "auto" }} color="red">Stop</Button>
        <Button variant="filled" sx={{ marginTop: "auto", marginBottom: "auto" }} color="yellow">Restart</Button>

      </Flex>
      <Tabs value={activeTab} sx={{ marginTop: 10 }} >
        <Tabs.List>
          <Link href="/instances/inst" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconHome size="0.8rem" />} value="dashboard">Dashboard</Tabs.Tab>
          </Link>
          <Link href="/instances/inst/console" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconTerminal2 size="0.8rem" />} value="console">Console</Tabs.Tab>
          </Link>
          <Link href="/instances/inst/files" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconFolder size="0.8rem" />} value="files">Files</Tabs.Tab>
          </Link>
          <Link href="/instances/inst/snapshots" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconHistory size="0.8rem" />} value="snapshots">Snapshots</Tabs.Tab>
          </Link>
          <Link href="/instances/inst/volumes" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconBox size="0.8rem" />} value="volumes">Volumes</Tabs.Tab>
          </Link>
          <Link href="/instances/inst/settings" style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconSettings size="0.8rem" />} value="settings">Settings</Tabs.Tab>
          </Link>
        </Tabs.List>
      </Tabs>
    </>
  );
}