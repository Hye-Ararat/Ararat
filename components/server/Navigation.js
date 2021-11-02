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
    Divider,
  } from "@mui/material";
  import { Inbox as InboxIcon, Mail as MailIcon, Storage as ServersIcon, SupervisorAccount as AdminIcon, AccountCircle as AccountIcon, Code as ApiIcon } from "@mui/icons-material";
import Link from "next/link";
export default function Navigation({children}) {
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
                        <Link href="/">
                      <ListItem button selected={true}>
                        <ListItemIcon>
                          <ServersIcon />
                        </ListItemIcon>
                        <ListItemText primary="Servers" />
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
                    {children}
                </Box>
              </Box>
              </>
    )
}