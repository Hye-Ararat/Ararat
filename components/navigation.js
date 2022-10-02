import { Box, CssBaseline, AppBar, Toolbar, Grid, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, useTheme, useMediaQuery } from "@mui/material"
import Link from "next/link";
import {
    Storage as NodesIcon,
    Terminal as InstanceIcon,
    AccountCircle as AccountIcon,
    Code as ApiIcon,
    People as UsersIcon,
    Badge as RanksIcon,
    ViewInAr as ImagesIcon,
    SettingsEthernet as NetworkIcon,
    Menu,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useState } from "react";
import translate from "../translations/translations";
import decodeToken from "../lib/decodeToken";
import nookies from "nookies";
import signOut from "../scripts/lib/auth/signout"

export default function Navigation({ children, ...props }) {
    const router = useRouter();
    const signout = async () => {
        await signOut();
        window.location.reload();
    };
    const [open, setOpen] = useState(false);
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Grid container direction="row">
                        {useMediaQuery(useTheme().breakpoints.up("sm"))
                            ?
                            ""
                            : <IconButton onClick={() => setOpen(!open)}>
                                <Menu />
                            </IconButton>
                        }
                        <img src="/logo.png" style={{ width: "60px", marginRight: 5, marginTop: 5, marginBottom: "auto", justifyContent: "center" }} />
                    </Grid>

                    <Button
                        color="inherit"
                        sx={{
                            marginLeft: "auto",
                            minWidth: "80px"
                        }}
                        onClick={signout}
                    >
                        Sign Out
                    </Button>
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
                        <Link href="/">
                            <ListItem onClick={() => setOpen(false)} button selected={!props.page}>
                                <ListItemIcon>
                                    <InstanceIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "instances")} />
                            </ListItem>
                        </Link>
                        <Link href="/nodes">
                            <ListItem onClick={() => setOpen(false)} button selected={props.page == "nodes"}>
                                <ListItemIcon>
                                    <NodesIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "nodes")} />
                            </ListItem>
                        </Link>
                        <Link onClick={() => setOpen(false)} href="/networks">
                            <ListItem button>
                                <ListItemIcon>
                                    <NetworkIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "networks")} />
                            </ListItem>
                        </Link>
                        <Link onClick={() => setOpen(false)} href="/">
                            <ListItem button>
                                <ListItemIcon>
                                    <ImagesIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "images")} />
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                    <List>
                        <Link onClick={() => setOpen(false)} href="/users">
                            <ListItem button selected={props.page == "users"}>
                                <ListItemIcon>
                                    <UsersIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "users")} />
                            </ListItem>
                        </Link>
                        <Link onClick={() => setOpen(false)} href="/">
                            <ListItem button>
                                <ListItemIcon>
                                    <RanksIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).access_token ? decodeToken(nookies.get(null).access_token).language : "en", "sidebar", "ranks")} />
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
    )
}