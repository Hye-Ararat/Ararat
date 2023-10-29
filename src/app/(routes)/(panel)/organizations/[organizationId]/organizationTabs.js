"use client";

import { Tabs } from "@mantine/core";
import { IconSettings, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrganizationTabs({ organization, permissions }) {
  const pathname = usePathname();
  const [tab, setTab] = useState(null);
  useEffect(() => {
    console.log(pathname)
    if (pathname == `/organizations/${organization.id}`) setTab("users");
    if (pathname == `/organizations/${organization.id}/settings`) setTab("settings");
  }, [pathname])
  return (
    <Tabs value={tab} mb="xs">
      <Tabs.List>
        <Link href={`/organizations/${organization.id}`} style={{textDecoration: "inherit", color: "inherit"}}>
        <Tabs.Tab value="users" leftSection={<IconUsers size="1rem" />}>
          Users
        </Tabs.Tab>
        </Link>
        <Link href={`/organizations/${organization.id}/settings`} style={{textDecoration: "inherit", color: "inherit"}}>
        {permissions.includes("update:organization") ? <Tabs.Tab value="settings" leftSection={<IconSettings size="1rem" />}>
          Settings
        </Tabs.Tab> : ""}
        </Link>
      </Tabs.List>
    </Tabs>
  );
}
