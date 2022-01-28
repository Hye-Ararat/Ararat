import {
  Typography,
  Toolbar,
  AppBar,
  Drawer,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  SvgIcon,
  Grid,
  Button
} from "@mui/material";
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Storage as InstanceIcon,
  SupervisorAccount as AdminIcon,
  AccountCircle as AccountIcon,
  Code as ApiIcon,
  Terminal as ConsoleIcon,
  Folder as FilesIcon,
  Backup as BackupIcon,
  ViewStream as DatabaseIcon,
  People as UsersIcon,
  Schedule as SchedulesIcon,
  SettingsEthernet as NetworkIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useEffect } from "react";
import { useRouter } from "next/router";
import StateIndicator from "./StateIndicator";
import { InstanceStore } from "../../states/instance";
import StopButton from "./StopButton";
import StartButton from "./StartButton";

export default function Navigation({ children, ...props }) {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  console.log(props.page);
  const router = useRouter();
  const { id } = router.query;
  function Addons() {
    const { data } = useSWR(`/api/v1/client/instances/${id}/addons/pages`, fetcher);
    if (!data) {
      return [];
    } else {
      if (data.status == "error" || data.data == "Instance does not exist") {
        return [];
      }
      return data.data;
    }
  }
  const instance = {
    data: InstanceStore.useStoreState((state) => state.data),
    setData: InstanceStore.useStoreActions((state) => state.setData),
    sockets: {
      monitor: InstanceStore.useStoreState((state) => state.sockets.monitor),
      setMonitor: InstanceStore.useStoreActions((state) => state.sockets.setMonitor)
    }
  }

  var { data: instanceData } = useSWR(`/api/v1/client/instances/${id}?include=["magma_cube", "node", "network"]`, fetcher);
  useEffect(() => {
    if (instance.data) {
      console.log("exists");
      console.log(instance.data);
    } else {
      console.log("doesnt");
      instance.setData(instanceData);
    }
  }, [instance.data, instanceData])
  useEffect(() => {
    if (instance.data) {
      console.log("yes");
      console.log("yes2");
      if (instance.sockets.monitor) {
        instance.sockets.monitor.onopen = () => {
          axios.get("/api/v1/client/instances/" + instance.data._id + "/monitor/ws").then((res) => {
            instance.sockets.monitor.send(res.data.data.access_token);
          });
        };
      } else {
        instance.sockets.setMonitor(
          new WebSocket(
            `${instance.data.relationships.node.address.ssl ? "wss" : "ws"}://${instance.data.relationships.node.address.hostname
            }:${instance.data.relationships.node.address.port}/api/v1/instances/${instance.data._id}/monitor`
          )
        );
      }
    } else {
      console.log("no");
    }
  }, [instance.data, instance.sockets.monitor]);
  useEffect(() => {
    console.log("Nav redone");
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {props.page ? instance.data ? instance.data.name : "Ararat" : "Ararat"}
            </Typography>
            {props.page ? instance.data ?
              <Grid container sx={{ ml: "auto" }} xs={3}>
                <Box sx={{
                  mt: "auto", mb: "auto", height: "100%"
                }} onClick={() => {
                  window.open("/instance/" + instance.data._id + "/console", 'popUpWindow', 'height=600,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                }} >
                  <ConsoleIcon sx={{
                    mt: "auto", width: "30px", height: "30px"
                  }} />
                </Box>
                <StartButton instance={instance.data._id} />
                <Button
                  color="warning"
                  variant="contained"
                  sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
                >
                  Restart
                </Button>
                <StopButton instance={instance.data._id} />
                <StateIndicator />
              </Grid>
              : '' : ""}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box"
            }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <Link href="/">
                <ListItem button>
                  <ListItemIcon>
                    <InstanceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Instances" />
                </ListItem>
              </Link>
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
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == null ? true : false}>
                  <ListItemIcon>
                    <ConsoleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Console" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}/files`}>
                <ListItem button selected={props.page != null ? (props.page.includes("files") ? true : false) : false}>
                  <ListItemIcon>
                    <FilesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Files" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "snapshots" ? true : false}>
                  <ListItemIcon>
                    <BackupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Snapshots" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "databases" ? true : false}>
                  <ListItemIcon>
                    <DatabaseIcon />
                  </ListItemIcon>
                  <ListItemText primary="Databases" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "users" ? true : false}>
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "schedules" ? true : false}>
                  <ListItemIcon>
                    <SchedulesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Schedules" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "networking" ? true : false}>
                  <ListItemIcon>
                    <NetworkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Networking" />
                </ListItem>
              </Link>
              <Link href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "settings" ? true : false}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </Link>
              {Addons()
                ? Addons() != "Loading"
                  ? Addons().map((addon) => {
                    library.add();
                    return (
                      <Link href={`/instances/${encodeURIComponent(id)}${addon.route}`} key={addon._id}>
                        <ListItem button>
                          <ListItemIcon>
                            <SvgIcon sx={{ width: 24, height: 24, ml: 0.2 }}>
                              <FontAwesomeIcon icon={Icons[addon.icon]} />
                            </SvgIcon>
                          </ListItemIcon>
                          <ListItemText primary={addon.name} />
                        </ListItem>
                      </Link>
                    );
                  })
                  : ""
                : ""}
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
          {children}
        </Box>
      </Box>
    </>
  );
}
