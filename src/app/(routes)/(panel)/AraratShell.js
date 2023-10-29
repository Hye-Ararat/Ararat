"use client";

import getOrganizationLogoUrl from "@/app/_lib/getOrganizationLogo";
import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Paper,
  Text,
  Menu,
  rem,
  Skeleton,
  Center,
  Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronRight,
  IconChevronDown,
  IconChevronLeft,
  IconDoorExit,
  IconFileImport,
  IconLocationPin,
  IconMapPin,
  IconPin,
  IconServer,
  IconServer2,
  IconTerminal2,
  IconUsers,
  IconBuilding,
} from "@tabler/icons-react";
import { url } from "gravatar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AraratShell({ children }) {
  const session = useSession();
  console.log(session);
  const [opened, { toggle }] = useDisclosure();
  const [logoUrl, setLogoUrl] = useState("");
  useEffect(() => {
    getOrganizationLogoUrl().then((url) => {
      setLogoUrl(url);
    });
  }, []);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 310, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header
        bg="var(--mantine-color-dark-8)"
        style={{
          borderBottom:
            "calc(0.0625rem*var(--mantine-scale)) solid var(--mantine-color-dark-6)",
        }}
      >
        <Flex style={{ height: "100%" }}>
          <Burger
            opened={opened}
            onClick={toggle}
            my="auto"
            hiddenFrom="sm"
            size="sm"
          />
          <img
            src={logoUrl}
            height={30}
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "20px",
            }}
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        bg="var(--mantine-color-dark-8)"
        style={{
          borderRight:
            "calc(0.0625rem*var(--mantine-scale)) solid var(--mantine-color-dark-6)",
        }}
      >
        <NavigationItem
          name="Servers"
          icon={
            <IconServer
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/servers"
        />
        <NavigationItem
          name="Racks"
          icon={
            <IconServer2
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/racks"
        />

        <NavigationItem
          name="Organizations"
          icon={
            <IconBuilding
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/organizations"
        />
        <NavigationItem
          name="Locations"
          icon={
            <IconMapPin
              size={"25px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          }
          route="/locations"
        />

        <UserNavigationItem session={session} />
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-dark-9)">{children}</AppShell.Main>
    </AppShell>
  );
}

function NavigationItem({ name, icon, route, style, sublinks }) {
  const pathname = usePathname();
  let selected = pathname.startsWith(route);
  return (
    <>
      <Link
        href={route}
        style={{
          color: "inherit",
          textDecoration: "none",
          marginBottom: 5,
          ...style,
        }}
      >
        <Paper
          bg={
            selected
              ? "var(--mantine-color-blue-light)"
              : "var(--mantine-color-dark-8)"
          }
          style={{ cursor: "pointer", transition: "0.1s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = selected
              ? "var(--mantine-color-blue-light-hover)"
              : "var(--mantine-color-dark-6)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = selected
              ? "var(--mantine-color-blue-light)"
              : "var(--mantine-color-dark-8)")
          }
          p="xs"
        >
          <Flex>
            {icon}
            {typeof name == "string" ? (
              <Text my="auto" ml={"sm"} size="sm" fw={550}>
                {name}
              </Text>
            ) : (
              name
            )}
          </Flex>
        </Paper>
      </Link>
    </>
  );
}
function UserNavigationItem({ session }) {
  const [open, setOpen] = useState(false);

  return (
    <Menu
      shadow="md"
      width={200}
      position="right"
      opened={open}
      onChange={setOpen}
    >
      <Menu.Target>
        <Paper
          bg={
            open ? "var(--mantine-color-dark-6)" : "var(--mantine-color-dark-8)"
          }
          style={{ cursor: "pointer", transition: "0.1s", marginTop: "auto" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--mantine-color-dark-6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = open
              ? "var(--mantine-color-dark-6)"
              : "var(--mantine-color-dark-8)";
          }}
          onClick={() => {
            setOpen(!open);
          }}
          p="xs"
        >
          <Flex>
            <Avatar
              size={"40px"}
              style={{ marginTop: "auto", marginBottom: "auto" }}
              src={session.data ? (session.data.user.image ? session.data.user.image : url(session.data.user.email, {
                default: "https://www.hyeararat.com/img/araratLogo.png"
              })) : undefined}
            />
            {session.data ? (
              <Flex direction={"column"}>
                <Text my="auto" ml={"sm"} size="sm" fw={550}>
                  {session.data.user.name}
                </Text>
                <Text color="grey" my="auto" ml={"sm"} size="xs" fw={550}>
                  {session.data.user.email}
                </Text>
              </Flex>
            ) : (
              <Skeleton ml={10} />
            )}
            <Center ml={"auto"}>
              <IconChevronRight />
            </Center>
          </Flex>
        </Paper>
      </Menu.Target>
      <Menu.Dropdown mt={10} mb={20}>
        <Menu.Item
          leftSection={
            <IconDoorExit style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
