"use client";

import { Tabs, Title, rem } from "@mantine/core";
import {
  IconAppWindow,
  IconNetwork,
  IconServer,
  IconSettings,
  IconTerminal,
} from "@tabler/icons-react";

export default function InstanceShell() {
  const iconStyle = { width: rem(17), height: rem(17) };
  return (
    <>
      <Title order={1}>Instance Name</Title>
      <Tabs defaultValue="dashboard">
        <Tabs.List>
          <Tabs.Tab
            value="dashboard"
            leftSection={<IconAppWindow style={iconStyle} />}
          >
            Dashboard
          </Tabs.Tab>
          <Tabs.Tab
            value="console"
            leftSection={<IconTerminal style={iconStyle} />}
          >
            Console
          </Tabs.Tab>
          <Tabs.Tab
            value="network"
            leftSection={<IconNetwork style={iconStyle} />}
          >
            Network
          </Tabs.Tab>
          <Tabs.Tab
            value="storage"
            leftSection={<IconServer style={iconStyle} />}
          >
            Storage
          </Tabs.Tab>
          <Tabs.Tab
            value="settings"
            leftSection={<IconSettings style={iconStyle} />}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
}
