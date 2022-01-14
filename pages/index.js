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
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Storage as InstanceIcon,
  SupervisorAccount as AdminIcon,
  AccountCircle as AccountIcon,
  Code as ApiIcon,
} from "@mui/icons-material";
import Instance from "../components/instance";
import signOut from "../scripts/lib/auth/signout";

export async function getServerSideProps({ req, res }) {
  if (!req.cookies.access_token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
      }
    }
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  var {connectToDatabase} = require("../util/mongodb")
  var {db} = await connectToDatabase();
  var {decode} = require("jsonwebtoken");
  var {ObjectId} = require("mongodb");
  var user_data = decode(req.cookies.access_token)
  const instance_data = await db
    .collection("instances")
    .find({ [`users.${user_data.id}`]: { $exists: true } })
    .toArray();
  var instances = [];
  function awaitAllInstancesDone() {
    return new Promise((resolve, reject) => {
      if (instances.length == instance_data.length) {
        return resolve()
      }
      var instanceCheck = setInterval(() => {
        if (instances.length == instance_data.length) {
          clearInterval(instanceCheck)
          return resolve()
        }
      }, 100)
    });
  }
  instance_data.forEach(async instance => {
    instance.relationships = {};
    instance.relationships.magma_cube = await db.collection("magma_cubes").findOne({
      _id: ObjectId(instance.magma_cube.id)
    })
    instance.relationships.node = await db.collection("nodes").findOne({
      _id: ObjectId(instance.node)
    })
    instance.relationships.network = await db.collection("networks").findOne({
      _id: ObjectId(instance.network)
    })
    instances.push(instance);
  })
  await awaitAllInstancesDone()
  console.log(instances)
  let data = JSON.parse(JSON.stringify(instances));
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
                  <InstanceIcon />
                </ListItemIcon>
                <ListItemText primary="Instances" />
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
              <Link href="/admin">
              <ListItem button>
                <ListItemIcon>
                  <AdminIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItem>
              </Link>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Head>
            <title>Dashboard | Ararat</title>
          </Head>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Your Instances
          </Typography>
          <Grid spacing={5} container direction="row">
            {data.map((instance) => {
              return <Instance instance={instance} key={instance._id} />;
            })}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
