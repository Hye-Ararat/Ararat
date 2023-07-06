import { useState, ReactNode, useEffect, createContext, Dispatch, SetStateAction } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  UnstyledButton,
  Group,
  ThemeIcon,
  Title,
  Aside,
} from '@mantine/core';
import { NavigationProgress } from "@mantine/nprogress";
import {
  IconServer2,
  IconTerminal2,
  IconUsers,
  IconHome,
  IconCubeSend,
  IconArrowBack,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import InstanceShell from './instances/instance/InstanceShell';
interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
  setOpen: (open: boolean) => void;
  setAsideOpen: (open: boolean) => void;
}

export const MainContext = createContext<{ setAsideOpen: Dispatch<SetStateAction<boolean>>, setAside: (content: any) => void, asideOpen: boolean }>({ setAsideOpen: (...args: any[]) => { }, setAside: () => { }, asideOpen: false })

function MainLink({ icon, color, label, path, setOpen, setAsideOpen }: MainLinkProps) {
  return (
    <Link onClick={() => {
      setAsideOpen(false)
      setOpen(false)
    }} href={path} style={{ textDecoration: "none" }}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

export default function ApplicationShell({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [pageType, setPageType] = useState<string | null>(null);
  const router = useRouter();
  const [asideOpen, setAsideOpen] = useState(false)
  const [asideContent, setAsideContent] = useState("")
  useEffect(() => {
    if (router.pathname.includes("/instances/[instance]")) {
      setPageType("instance");
    } else {
      setPageType(null);
    }
  }, [router.asPath])
  const links = [
    { icon: <IconHome size="1rem" />, color: 'indigo', label: 'Dashboard', path: "/" },
    { icon: <IconTerminal2 size="1rem" />, color: 'blue', label: 'Instances', path: "/instances" },
    { icon: <IconArrowBack size="1rem" />, color: 'red', label: 'Reverse Proxies', path: "/reverse_proxies" },
    { icon: <IconServer2 size="1rem" />, color: 'teal', label: 'Nodes', path: "/nodes" },
    { icon: <IconCubeSend size="1rem" />, color: "yellow", label: "Image Servers", path: "/image_servers" },
    { icon: <IconUsers size="1rem" />, color: 'violet', label: 'Users', path: "/users" },
  ];
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          {links.map((link) => { return (<MainLink {...link} key={link.label} setOpen={setOpened} setAsideOpen={(open) => {
              setAsideContent("")
              setAsideOpen(false)
          }} />) })}
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <Text>© 2023 Hye Hosting LLC.</Text>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title order={3}>Hye Ararat</Title>
          </div>
        </Header>
      }
      aside={asideOpen ? <Aside p="md" width={{ sm: 200, lg: 300 }} sx={{ backgroundColor: "#111214" }}>
        {asideContent}
      </Aside> : undefined}
    >
      <NavigationProgress />
      {pageType == "instance" ? <InstanceShell /> : ""}
      <MainContext.Provider value={{ setAside: (content: any) => setAsideContent(content), setAsideOpen: setAsideOpen, asideOpen: asideOpen }}>
        {children}
      </MainContext.Provider>

    </AppShell>
  );
}