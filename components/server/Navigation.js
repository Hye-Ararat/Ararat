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
  import { Inbox as InboxIcon, Mail as MailIcon, Storage as ServersIcon, SupervisorAccount as AdminIcon, AccountCircle as AccountIcon, Code as ApiIcon, Monitor as ConsoleIcon, Folder as FilesIcon, Backup as BackupIcon, ViewStream as DatabaseIcon, People as UsersIcon, Schedule as SchedulesIcon, SettingsEthernet as NetworkIcon, Settings as SettingsIcon} from "@mui/icons-material";
import Link from "next/link";
export default function Navigation({children, ...props}) {
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
                      <ListItem button>
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
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button selected={true}>
                        <ListItemIcon>
                          <ConsoleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Console" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}/files`}>
                      <ListItem button>
                        <ListItemIcon>
                          <FilesIcon />
                        </ListItemIcon>
                        <ListItemText primary="Files" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <BackupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Backups" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <DatabaseIcon />
                        </ListItemIcon>
                        <ListItemText primary="Databases" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <UsersIcon />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <SchedulesIcon />
                        </ListItemIcon>
                        <ListItemText primary="Schedules" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <NetworkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Networking" />
                      </ListItem>
                      </Link>
                      <Link href={`/server/${encodeURIComponent(props.server)}`}>
                      <ListItem button>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </ListItem>
                      </Link>
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