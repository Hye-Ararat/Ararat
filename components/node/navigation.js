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
    useTheme
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
    Settings as SettingsIcon,
    History as SnapshotsIcon,
    Menu,
    Storage
} from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NodeStore } from "../../states/node";

export default function Navigation({ children, ...props }) {
    const [open, setOpen] = useState(false);

    const fetcher = (url) => axios.get(url).then((res) => res.data);
    console.log(props.page);
    const router = useRouter();
    const { node: nodeID } = router.query;
    const node = {
        data: NodeStore.useStoreState((state) => state.data),
        setData: NodeStore.useStoreActions((state) => state.setData),
        sockets: {
            state: NodeStore.useStoreState((state) => state.sockets.state),
            setState: NodeStore.useStoreActions((state) => state.sockets.setState)
        }
    }

    var { data: nodeData } = useSWR(`/api/v1/nodes/${nodeID}`, fetcher);
    useEffect(() => {
        if (!node.data) {
            if (nodeData) {
                node.setData(nodeData.metadata);
            }
        }
    }, [node.data, nodeData])
    useEffect(() => {
        if (node.data) {
            if (node.sockets.state) {
                /*
                instance.sockets.monitor.onopen = () => {
                  axios.get("/api/v1/client/instances/" + instance.data.id + "/monitor/ws").then((res) => {
                    instance.sockets.monitor.send(res.data.access_token);
                  });
                };
                */
            } else {
                node.sockets.setState(
                    new WebSocket(
                        `${"ws"}://${node.address}:${node.port}/v1/node/state`
                    )
                );
            }
        } else {
            console.log("no");
        }
    }, [node.data, node.sockets.state]);
    useEffect(() => {
        console.log("Nav redone");
    }, []);
    return (
        <>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Grid container direction="row">
                            {useMediaQuery(useTheme().breakpoints.up("sm"))
                                ?
                                ""
                                : <IconButton onClick={() => setOpen(!open)}>
                                    <Menu />
                                </IconButton>
                            }
                            {props.page ?
                                <Grid container xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto", mr: .5 }}>
                                    {/*state indicator*/}
                                </Grid> : ""}
                            <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" noWrap component="div">

                                {props.page ? node.data ? node.data.name : "Ararat" : "Ararat"}
                            </Typography>
                        </Grid>
                        {useMediaQuery(useTheme().breakpoints.up("sm")) ? props.page ? node.data ?
                            <Grid container sx={{ ml: "auto" }} xs={3} sm={10} md={5} xl={3}>
                                <Box sx={{
                                    mt: "auto", mb: "auto", height: "100%"
                                }} onClick={() => {
                                    window.open("/node/" + node.data.id + "/console", 'popUpWindow', 'height=600,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                                }} >
                                    <ConsoleIcon sx={{
                                        mt: "auto", width: "30px", height: "30px", mb: "auto"
                                    }} />
                                </Box>
                                {/*<StartButton instance={instance.data._id} />*/}
                                <Button
                                    color="warning"
                                    variant="contained"
                                    sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
                                >
                                    Restart
                                </Button>
                                {/*<StopButton instance={instance.data._id} />*/}
                            </Grid>
                            : '' : "" : ""}
                    </Toolbar>
                </AppBar>
                <Drawer open={useMediaQuery(useTheme().breakpoints.up("sm")) ? true : open}
                    variant={useMediaQuery(useTheme().breakpoints.up("sm")) ? "persistent" : "temporary"}
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
                            <Link href="/" >
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
                            <Link href={`/node/${encodeURIComponent(nodeID)}`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page == null ? true : false}>
                                    <ListItemIcon>
                                        <ConsoleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Overview" />
                                </ListItem>
                            </Link>
                            {/*<Link href={`/instance/${encodeURIComponent(nodeID)}/files`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page != null ? (props.page.includes("files") ? true : false) : false}>
                                    <ListItemIcon>
                                        <FilesIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Files" />
                                </ListItem>
                </Link>*/}
                            {/*
                            <Link href={`/instance/${encodeURIComponent(nodeID)}/snapshots`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page == "snapshots" ? true : false}>
                                    <ListItemIcon>
                                        <SnapshotsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Snapshots" />
                                </ListItem>
                            </Link>
            */}
                            {/*<Link href={`/instance/${encodeURIComponent(nodeID)}/users`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page == "users" ? true : false}>
                                    <ListItemIcon>
                                        <UsersIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Users" />
                                </ListItem>
                            </Link>
        */}
                            {/*
                <Link href={`/instance/${encodeURIComponent(nodeID)}`}>
                  <ListItem button selected={props.page == "schedules" ? true : false}>
                    <ListItemIcon>
                      <SchedulesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Schedules" />
                  </ListItem>
                </Link>
          */}
                            <Link href={`/node/${encodeURIComponent(nodeID)}/networks`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page == "networks" ? true : false}>
                                    <ListItemIcon>
                                        <NetworkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Networks" />
                                </ListItem>
                            </Link>
                            <Link href={`/node/${encodeURIComponent(nodeID)}/storage-pools`}>
                                <ListItem onClick={() => setOpen(false)} button selected={props.page == "storage-pools" ? true : false}>
                                    <ListItemIcon>
                                        <Storage />
                                    </ListItemIcon>
                                    <ListItemText primary="Storage Pools" />
                                </ListItem>
                            </Link>
                            <Link href={`/instance/${encodeURIComponent(nodeID)}/settings`}>
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
