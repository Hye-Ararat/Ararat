"use client";

import { Box, CssBaseline, AppBar, Toolbar, Grid, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, useMediaQuery, ListItemButton } from "@mui/material"
import {useTheme} from "@mui/material/styles"
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
import { useEffect, useState } from "react";
import translate from "../translations/translations";
import decodeToken from "../lib/decodeToken";
import nookies from "nookies";
import signOut from "../scripts/lib/auth/signout"
import { usePathname } from "next/navigation";

export default function Navigation({ children, ...props }) {
    const signout = async () => {
        await signOut();
        window.location.reload();
    };
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.up("sm"));
    const [mobile, setMobile] = useState(false);
    const pathname = usePathname();
    const [page, setPage] = useState(props.page ? props.page : pathname.replace("/", ""))
    useEffect(() => {
        if (!props.page) setPage(pathname.replace("/", ""))
    }, [pathname])
    useEffect(() => {
        setMobile(matches)
    }, [matches])
    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <div>
                    <Grid container direction="row">
                        {mobile
                            ?
<IconButton onClick={() => setOpen(!open)}>
                                <Menu />
                            </IconButton>                             : ""
                        }
                        <div>
                        <img src="/logo.png" style={{ width: "60px", marginRight: 5, marginTop: 5, marginBottom: "auto", justifyContent: "center" }} />
                        </div>
                    </Grid>
                    </div>

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
                        <Link style={{color: "inherit", textDecoration:"none"}} href="/">
                            <ListItemButton onClick={() => setOpen(false)} button selected={!page}>
                                <ListItemIcon>
                                    <InstanceIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "instances")} />
                            </ListItemButton>
                        </Link>
                        <Link style={{color: "inherit", textDecoration:"none"}} href="/nodes">
                            <ListItemButton onClick={() => setOpen(false)} selected={page == "nodes"}>
                                <ListItemIcon>
                                    <NodesIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "nodes")} />
                            </ListItemButton>
                        </Link>
                        <Link style={{color: "inherit", textDecoration:"none"}} onClick={() => setOpen(false)} href="/networks">
                            <ListItemButton>
                                <ListItemIcon>
                                    <NetworkIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "networks")} />
                            </ListItemButton>
                        </Link>
                        <Link style={{color: "inherit", textDecoration:"none"}} onClick={() => setOpen(false)} href="/">
                            <ListItemButton>
                                <ListItemIcon>
                                    <ImagesIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "images")} />
                            </ListItemButton>
                        </Link>
                    </List>
                    <Divider />
                    <List>
                        <Link style={{color: "inherit", textDecoration:"none"}} onClick={() => setOpen(false)} href="/users">
                            <ListItemButton selected={props.page == "users"}>
                                <ListItemIcon>
                                    <UsersIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "users")} />
                            </ListItemButton>
                        </Link>
                        <Link style={{color: "inherit", textDecoration:"none"}} onClick={() => setOpen(false)} href="/">
                            <ListItemButton>
                                <ListItemIcon>
                                    <RanksIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate(nookies.get(null).authorization ? decodeToken(nookies.get(null).authorization).language : "en", "sidebar", "ranks")} />
                            </ListItemButton>
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