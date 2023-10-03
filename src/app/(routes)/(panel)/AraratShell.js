"use client";

import { AppShell, Burger, Flex, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFileImport,
  IconServer,
  IconServer2,
  IconTerminal,
  IconTerminal2,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AraratShell({ children }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Flex style={{ height: "100%" }}>
          <Burger
            opened={opened}
            onClick={toggle}
            my="auto"
            hiddenFrom="sm"
            size="sm"
          />
          <Image
            src="/logo.png"
            alt="Hye Ararat"
            width={60}
            height={60}
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "10px",
            }}
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavigationItem
          name="Instances"
          icon={
            <IconTerminal2
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/instances"
        />
        <NavigationItem
          name="Nodes"
          icon={
            <IconServer2
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/nodes"
        />
        <NavigationItem
          name="Image Servers"
          icon={
            <IconFileImport
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/image_servers"
        />
        <NavigationItem
          name="Users"
          icon={
            <IconUsers
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/users"
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

function NavigationItem({ name, icon, route }) {
  const pathname = usePathname();
  let selected = pathname === route;
  return (
    <Link href={route} style={{ color: "inherit", textDecoration: "none" }}>
      <Paper
        bg={selected ? "var(--mantine-color-blue-light)" : ""}
        style={{ cursor: "pointer" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = selected
            ? "var(--mantine-color-blue-light-hover)"
            : "var(--mantine-color-dark-6)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = selected
            ? "var(--mantine-color-blue-light)"
            : "var(--mantine-color-dark-7)")
        }
        variant="light"
        p="xs"
      >
        <Flex>
          {icon}
          <Text my="auto" ml={"sm"} size="sm" fw={550}>
            {name}
          </Text>
        </Flex>
      </Paper>
    </Link>
  );
}
