import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  Button,
  Typography,
  Grid,
  Toolbar,
  AppBar,
  Drawer,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Divider,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Storage as ServersIcon,
  SupervisorAccount as AdminIcon,
  AccountCircle as AccountIcon,
  Code as ApiIcon,
} from "@mui/icons-material";
import { connectToDatabase } from "../util/mongodb";
import Server from "../components/server";
import signOut from "../scripts/lib/auth/signout";

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { db } = await connectToDatabase();
  const server_data = await db
    .collection("servers")
    .find({ [`users.616da13fe2f36f19e274a7ca`]: { $exists: true } })
    .toArray();
  let data = JSON.parse(JSON.stringify(server_data));
  return { props: { data } };
}

export default function Dashboard({ data }) {
  const router = useRouter();
  const signout = async () => {
    await signOut();
    window.location.reload();
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Ararat
            </Typography>

            <Button
              color="inherit"
              sx={{
                marginLeft: "auto",
              }}
              onClick={signout}
            >
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem button selected={true}>
                <ListItemIcon>
                  <ServersIcon />
                </ListItemIcon>
                <ListItemText primary="Servers" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ApiIcon />
                </ListItemIcon>
                <ListItemText primary="API" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemIcon>
                  <AdminIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Head>
            <title>Dashboard | Ararat</title>
          </Head>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Your Servers
          </Typography>
          <Grid spacing={5} container direction="row">
            {data.map((server) => {
              return <Server server={server} key={server._id} />;
            })}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
