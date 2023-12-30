import { use, useContext, useEffect, useState } from 'react';
import { Badge, Button, Flex, Group, Tabs, Title, Text, Center, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { IconBox, IconFolder, IconHistory, IconHome, IconNetwork, IconSettings, IconTerminal2, IconWifi } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { getBadgeColor } from '@/lib/util';
import { connectOIDC } from 'incus';
import { getCookie } from 'cookies-next';

export default function InstanceShell({ instance }: { instance: any }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState("dashboard")
  const [allowKill, setAllowKill] = useState(false)
  useEffect(() => {
    if (router.pathname == "/instances/[node]/[instance]") setActiveTab("dashboard");
    if (router.pathname == "/instances/[node]/[instance]/console") setActiveTab("console");
    if (router.pathname == "/instances/[node]/[instance]/files") setActiveTab("files");
    if (router.pathname == "/instances/[node]/[instance]/files/editor") setActiveTab("files");
    if (router.pathname == "/instances/[node]/[instance]/networks") setActiveTab("networks");
    if (router.pathname == "/instances/[node]/[instance]/volumes") setActiveTab("volumes");
    if (router.pathname == "/instances/[node]/[instance]/snapshots") setActiveTab("snapshots");
    if (router.pathname == "/instances/[node]/[instance]/settings") setActiveTab("settings");

  }, [router.asPath])
  const [instanceStatus, setInstanceStatus] = useState(instance.status);
  useEffect(() => {
    const interval = setInterval(async () => {
      const client = connectOIDC(instance.node.url, getCookie("access_token"));
      const { data } = await client.get(`/instances/${instance.name}`);
      setInstanceStatus(data.metadata.status);
    }
      , 1000);
    return () => clearInterval(interval);
  }, [])
  return (
    <>
      <Flex>
        <div>
          <Title order={1}>{instance.name}</Title>
          <Badge bg={theme.colors.dark[6]} color={getBadgeColor(instanceStatus)} variant="dot">{instanceStatus}</Badge>
        </div>
        <Button onClick={async () => {
          const client = connectOIDC(instance.node.url, getCookie("access_token"));
          await client.put(`/instances/${instance.name}/state`, { action: "start" });
        }} variant="filled" color="green" sx={{ marginLeft: "auto", marginRight: 10, marginTop: "auto", marginBottom: "auto" }} disabled={instanceStatus == "Running"}>Start</Button>
        <Button onClick={async () => {
          setAllowKill(true);
          const client = connectOIDC(instance.node.url, getCookie("access_token"));
          await client.put(`/instances/${instance.name}/state`, { action: "stop", force: allowKill });
          setAllowKill(false);
        }} variant="filled" sx={{ marginRight: 10, marginTop: "auto", marginBottom: "auto" }} color="red" disabled={instanceStatus == "Stopped"}>{allowKill ? "Kill" : "Stop"}</Button>
        <Button onClick={async () => {
          const client = connectOIDC(instance.node.url, getCookie("access_token"));
          await client.put(`/instances/${instance.name}/state`, { action: "restart" });
        }} variant="filled" sx={{ marginTop: "auto", marginBottom: "auto" }} color="yellow" disabled={instanceStatus == "Stopped"}>Restart</Button>
      </Flex>
      <Tabs value={activeTab} sx={{ marginTop: 10 }} >
        <Tabs.List>
          <Link href={`/instances/${instance.node.name}/${instance.name}`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconHome size="0.8rem" />} value="dashboard">Dashboard</Tabs.Tab>
          </Link>
          <Link href={`/instances/${instance.node.name}/${instance.name}/console`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconTerminal2 size="0.8rem" />} value="console">Console</Tabs.Tab>
          </Link>
          <Link href={`/instances/${instance.node.name}/${instance.name}/files`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconFolder size="0.8rem" />} value="files">Files</Tabs.Tab>
          </Link>
          <Link href={`/instances/${instance.node.name}/${instance.name}/networks`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconNetwork size="0.8rem" />} value="networks">Networks</Tabs.Tab>
          </Link>
          <Link href={`/instances/${instance.node.name}/${instance.name}/volumes`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconBox size="0.8rem" />} value="volumes">Volumes</Tabs.Tab>
          </Link>
          <Link href={`/instances/${instance.node.name}/${instance.name}/snapshots`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconHistory size="0.8rem" />} value="snapshots">Snapshots</Tabs.Tab>
          </Link>

          <Link href={`/instances/${instance.node.name}/${instance.name}/settings`} style={{ textDecoration: "none" }} >
            <Tabs.Tab icon={<IconSettings size="0.8rem" />} value="settings">Settings</Tabs.Tab>
          </Link>
        </Tabs.List>
      </Tabs>
    </>
  );
}