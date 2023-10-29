"use client";

import { Tabs } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

export default function OrganizationTabs({ organization }) {
  return (
    <Tabs defaultValue="users" mb="xs">
      <Tabs.List>
        <Tabs.Tab value="users" leftSection={<IconUsers size="1rem" />}>
          Users
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
