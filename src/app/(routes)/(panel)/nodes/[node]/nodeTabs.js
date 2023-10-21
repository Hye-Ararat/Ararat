"use client";

import { Tabs } from "@mantine/core";

export default function NodeTabs() {
  return (
    <>
      <Tabs.List>
        <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
        <Tabs.Tab value="console">Console</Tabs.Tab>
        <Tabs.Tab value="virtual-media">Virtual Media</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
    </>
  );
}
