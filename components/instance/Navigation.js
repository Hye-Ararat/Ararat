"use client";

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
  Button,
  useMediaQuery,
  IconButton,
  Icon,
  Fade
} from "@mui/material";
import {useTheme} from "@mui/material/styles"
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
  Settings as SettingsIcon,
  History as SnapshotsIcon,
  Menu,
  Storage,
  Dashboard
} from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import StateIndicator from "./StateIndicator";
import { InstanceStore } from "../../states/instance";
import StopButton from "./StopButton";
import StartButton from "./StartButton";
import nookies from "nookies";
import getInstance from "../../scripts/api/v1/instances/[id]/instance";

export default function Navigation({ children, id, ...props }) {
  const [open, setOpen] = useState(false);
  const [extensionPages, setExtensionPages] = useState([]);
  const theme = useTheme();
  const matches = !useMediaQuery(theme.breakpoints.up("sm"));
    const [mobile, setMobile] = useState(false);
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  console.log(props.page);
  const router = useSearchParams();
  const pathname = usePathname();
  const [page, setPage] = useState(props.page ? props.page : pathname.replace("/", ""));
  id = id;
  if (!id) {
    id = router.get("id");
  }
  console.log("ID", id)
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

  //var { data: instanceData } = useSWR(`/api/v1/instances/${id}`, fetcher);
  const [instanceData, setInstanceData] = useState(null)
  useEffect(() => {
    async function run() {
    if (id) {
      let data = await getInstance(id);
      setInstanceData(data)
      instance.setData(data);
      console.log(data)
    }
  }
  run()
  }, [id])
  useEffect(() => {
    console.log("SETTING")
    if (!instance.data) {
      if (instanceData) {
        console.log("SET")
      }
    }
  }, [instance.data, instanceData])
  useEffect(() => {
    setMobile(matches)
}, [matches])
  useEffect(() => {
    if (instance.data) {
      console.log("yes");
      console.log("yes2");
      if (instance.sockets.monitor) {
        /*
        instance.sockets.monitor.onopen = () => {
          axios.get("/api/v1/client/instances/" + instance.data.id + "/monitor/ws").then((res) => {
            instance.sockets.monitor.send(res.data.authorization);
          });
        };
        */
      } else {
        let cookies = nookies.get();
        instance.sockets.setMonitor(
          new WebSocket(
            `wss://${instance.data.node.url.split("//")[1]}/api/v1/instances/${instance.data.id}/state?authorization=${cookies["access_token"]}`
          )
        );
      }
      let cookies = nookies.get();
      let image = instance.data.config
      let imageData = {
        architecture: image["image.architecture"],
        os: image["image.os"],
        release: image["image.release"],
        variant: image["image.variant"],
      }
      async function img() {
        let img;
        try {
          img = await axios.get(`https://images.ararat.hye.gg/findImageId?os=${imageData.os}&release=${imageData.release}&architecture=${imageData.architecture}&variant=${imageData.variant}`)
        } catch {
          return
        }
        let imageId = img.data.id
        const url = `https://images.ararat.hye.gg/accountServices/image/${imageId}/extensions?key=${cookies.authorization}&type=ararat`;
        let extensions;
        try {
          extensions = await axios.get(url);
        } catch (error) {
          extensions = {
            data: {
              extensions: []
            }
          }
        }
        let fullExtensions = [];
        let done = false;
        function waitDone() {
          return new Promise((resolve, reject) => {
            function checkDone() {
              if (done) {
                resolve()
              } else {
                setTimeout(checkDone, 100)
              }
            }
            checkDone()
          })
        }
        extensions.data.extensions.map(async (ext) => {
          const url2 = `https://images.ararat.hye.gg/accountServices/image/${imageId}/extensionInfo/${ext.name}?key=${cookies.authorization}&type=ararat`;
          let extensionInfo = {
            ...ext,
            data: (await axios.get(url2)).data
          }
          fullExtensions.push(extensionInfo);
          if (fullExtensions.length == extensions.data.extensions.length) {
            fullExtensions.map((ext) => {
              if (ext.type != "ararat") {
                fullExtensions.splice(fullExtensions.indexOf(ext), 1)
              }
            })
            done = true;
          }
        })
        await waitDone()
        console.log(fullExtensions, "extin")
        setExtensionPages(fullExtensions);
      }
      img()
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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Grid container direction="row">
              {mobile ?
                <IconButton onClick={() => setOpen(!open)}>
                  <Menu />
                </IconButton>
                : ""
              }
              {page ?
                <Grid container xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto", mr: .5 }}>
                  <StateIndicator />
                </Grid> : ""}
              <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" noWrap component="div">
                {page ? instance.data ? instance.data.name : "Ararat" : "Ararat"}
              </Typography>
            </Grid>
            {!mobile ? page ? instance.data ?
              <Grid container sx={{ ml: "auto" }} xs={3} sm={10} md={5} xl={3}>
                <Box sx={{
                  mt: "auto", mb: "auto", height: "100%"
                }} onClick={() => {
                  window.open("/instance/" + encodeURIComponent(id) + "/consolePopout", 'popUpWindow', 'height=600,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                }} >
                  <ConsoleIcon sx={{
                    mt: "auto", width: "30px", height: "30px", mb: "auto"
                  }} />
                </Box>
                <StartButton instance={instance.data.id} />
                <Button
                  color="warning"
                  variant="contained"
                  sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
                >
                  Restart
                </Button>
                <StopButton instance={instance.data.id} />
              </Grid>
              : '' : "" : ""}
          </Toolbar>
        </AppBar>
        <Drawer open={mobile ? open : true}
          variant={mobile ? "temporary" : "persistent"}
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#101924",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <Link style={{color: "inherit", textDecoration:"none"}} href="/" >
                <ListItem button onClick={() => setOpen(false)}>
                  <ListItemIcon>
                    <InstanceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Instances" />
                </ListItem>
              </Link>
              <ListItem button onClick={() => setOpen(false)}>
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
              <ListItem button onClick={() => setOpen(false)}>
                <ListItemIcon>
                  <ApiIcon />
                </ListItemIcon>
                <ListItemText primary="API" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem onClick={() => setOpen(false)} button selected={page == null ? true : false}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/console`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page != null ? (props.page.includes("console") ? true : false) : false}>
                  <ListItemIcon>
                    <ConsoleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Console" />
                </ListItem>
              </Link>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/files`}>
                <ListItem onClick={() => setOpen(false)} button selected={page != null ? (page.includes("files") ? true : false) : false}>
                  <ListItemIcon>
                    <FilesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Files" />
                </ListItem>
              </Link>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/snapshots`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page == "snapshots" ? true : false}>
                  <ListItemIcon>
                    <SnapshotsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Snapshots" />
                </ListItem>
              </Link>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/users`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page == "users" ? true : false}>
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
              </Link>
              {/*
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}`}>
                <ListItem button selected={props.page == "schedules" ? true : false}>
                  <ListItemIcon>
                    <SchedulesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Schedules" />
                </ListItem>
              </Link>
        */}
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/networks`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page == "networks" ? true : false}>
                  <ListItemIcon>
                    <NetworkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Networks" />
                </ListItem>
              </Link>
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/disks`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page == "disks" ? true : false}>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText primary="Disks" />
                </ListItem>
              </Link>
              {extensionPages ? extensionPages.length > 0 ?
                extensionPages.map((ext) => {
                  return (
                    <Link style={{color: "inherit", textDecoration:"none"}} key={ext.name} href={`/instance/${encodeURIComponent(id)}/extension/${ext.name}`}>
                      <Fade in={true}>
                        <ListItem onClick={() => setOpen(false)} button selected={props.page == `extension-${ext.name}` ? true : false}>
                          <ListItemIcon>
                            <Icon>{ext.data.icon}</Icon>
                          </ListItemIcon>
                          <ListItemText primary={ext.data.title} />
                        </ListItem>
                      </Fade>
                    </Link>
                  )
                })
                : "" : ""}
              <Link style={{color: "inherit", textDecoration:"none"}} href={`/instance/${encodeURIComponent(id)}/settings`}>
                <ListItem onClick={() => setOpen(false)} button selected={props.page == "settings" ? true : false}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
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
