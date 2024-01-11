"use client";

import {
    AppShell,
    Burger,
    Flex,
    Paper,
    Text,
    Menu,
    Avatar,
    Skeleton,
    Center,
    rem,
    TextInput,
    Collapse,
    Divider,
    ScrollArea
} from "@mantine/core-app";
import {
    IconArrowDownRight,
    IconBuilding,
    IconChevronRight,
    IconDoorExit,
    IconFileInvoice,
    IconHome,
    IconLifebuoy,
    IconMapPin,
    IconSearch,
    IconServer,
    IconServer2,
    IconShoppingBag,
    IconUser,
    IconChevronDown,
    IconGraph,
    IconCubeSend,
    IconTerminal
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { url } from "gravatar";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";
import { IconTerminal2 } from "@tabler/icons-react";

export default function TramAdminShell({ children, user }) {
    const [opened, setOpened] = useState(false);
    return (
        <>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 310,
                    breakpoint: "sm",
                    collapsed: { mobile: !opened },
                }}
            >
                <AppShell.Header
                    bg="var(--mantine-color-dark-7)"
                    style={{
                        borderBottom:
                            "calc(0.0625rem*var(--mantine-scale)) solid var(--mantine-color-dark-6)",
                    }}
                >
                    <Flex style={{ height: "100%" }}>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            my="auto"
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <img
                            src={"/images/Hye_Ararat_2.png"}
                            height={50}
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
                    bg="var(--mantine-color-dark-7)"
                    style={{
                        borderRight:
                            "calc(0.0625rem*var(--mantine-scale)) solid var(--mantine-color-dark-6)"
                    }}
                >
                    <ScrollArea>
                        <NavigationItem
                            name="Dashboard"
                            icon={
                                <IconHome
                                    size={"25px"}
                                    style={{ marginTop: "auto", marginBottom: "auto" }}
                                />
                            }
                            route="/"
                        />
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
                            name="Reverse Proxies"
                            icon={
                                <IconArrowBack
                                    size={"25px"}
                                    style={{ marginTop: "auto", marginBottom: "auto" }}
                                />
                            }
                            route="/reverse_proxies"
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
                                <IconCubeSend
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

                    </ScrollArea>
                    <UserNavigationItem session={user} />
                </AppShell.Navbar>
                <AppShell.Main bg="var(--mantine-color-dark-8)">
                    <div style={{ padding: "10px" }}>{children}</div>
                </AppShell.Main>
            </AppShell>
        </>
    );
}

function NavigationItem({ name, icon, route, style, sublinks }) {
    const [open, { toggle }] = useDisclosure(false);
    const pathname = usePathname();
    let selected = pathname.startsWith(route) && route != "/";
    if (pathname != "/admin" && route == "/admin") selected = false;
    return (
        <>
            <Link
                href={sublinks ? "#" : route}
                style={{
                    color: "inherit",
                    textDecoration: "none",
                    marginBottom: 5,
                    ...style,
                }}
                onClick={() => {
                    if (sublinks) {
                        toggle();
                    }
                }}
            >
                <Paper
                    bg={
                        selected
                            ? "var(--mantine-color-blue-light)"
                            : "var(--mantine-color-dark-7)"
                    }
                    style={{ cursor: "pointer", transition: "0.1s" }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = selected
                        ? "var(--mantine-color-blue-light-hover)"
                        : "var(--mantine-color-dark-5)")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = selected
                        ? "var(--mantine-color-blue-light)"
                        : "var(--mantine-color-dark-7)")
                    }
                    p="xs"
                    mb={5}
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
                        {sublinks ?
                            <>

                                <IconChevronRight style={{ marginLeft: "auto", transition: "0.2s", marginTop: "auto", marginBottom: "auto", transform: open ? "rotate(90deg)" : "rotate(0)" }} />


                            </>
                            : null}
                    </Flex>
                </Paper>
            </Link>

            <Collapse in={open}>
                {sublinks?.map((link) => {
                    let sublinkSelected = pathname == link.href;
                    return (
                        <Link href={link.href} style={{ color: "inherit", textDecoration: "inherit" }}>
                            <Paper
                                ml="sm"
                                bg={
                                    sublinkSelected
                                        ? "var(--mantine-color-green-light)"
                                        : "var(--mantine-color-dark-8)"
                                } style={{ cursor: "pointer", transition: "0.1s" }}
                                p="xs"
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = sublinkSelected
                                        ? "var(--mantine-color-green-light-hover)"
                                        : "var(--mantine-color-dark-6)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = sublinkSelected
                                        ? "var(--mantine-color-green-light)"
                                        : "var(--mantine-color-dark-8)";
                                }}

                            >
                                <Flex>
                                    <Text my="auto" ml={"sm"} size="sm" fw={550}>
                                        {link.name}
                                    </Text>
                                </Flex>
                            </Paper>

                        </Link>
                    )
                })}
            </Collapse>
        </>
    );
}
function UserNavigationItem({ session }) {
    const router = useRouter();
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
                            src={
                                session
                                    ? url(session.email, {
                                        default: "https://www.hyeararat.com/img/araratLogo.png",
                                    })
                                    : undefined
                            }
                        />
                        {session ? (
                            <Flex direction={"column"}>
                                <Text my="auto" ml={"sm"} size="sm" fw={550}>
                                    {session.firstName} {session.lastName}
                                </Text>
                                <Text color="grey" my="auto" ml={"sm"} size="xs" fw={550}>
                                    {session.email}
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
                    leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => {
                        router.push("/client");
                    }}
                >
                    Client Area
                </Menu.Item>
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