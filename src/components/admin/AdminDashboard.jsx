import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  Divider,
  List,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Modal,
  Button,
  ListSubheader,
  Menu,
  MenuItem
} from '@material-ui/core'
import {
    Storage as ServersIcon,
    AccountCircle as AccountIcon,
    SupervisorAccount as AdminIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Dvr as OverviewIcon,
    Settings as SettingsIcon,
    Person as ClientIcon,
    Code as APIIcon,
    Dns as NodesIcon
} from '@material-ui/icons'
import InboxIcon from '@material-ui/icons/Inbox'
import MailIcon from '@material-ui/icons/Mail'
import jsonwebtoken from 'jsonwebtoken'
import React from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
  Link,
  useParams
} from 'react-router-dom'
const drawerWidth = 240;


function AdminDashboard(props) {
  const {instance} = useParams()
  console.log('no')
  console.log(props)
    const [isMobile, setIsMobile] = React.useState(false)
 
//choose the screen size 
const handleResize = () => {
  if (window.innerWidth < 900) {
      setIsMobile(true)
  } else {
      setIsMobile(false)
  }
}

// create an event listener
React.useEffect(()=> {
    handleResize()
})
React.useEffect(() => {
  window.addEventListener("resize", handleResize)
})
React.useEffect(() =>{
  console.log('why')
    if (props.page == "servers"){
        setCurrentPage('servers')
    }
    if (props.page == "account"){
        setCurrentPage('account')
    }
}, [])
  const [user_data, setUserData] = React.useState({
    email: null,
    first_name: null,
    last_name: null,
    admin: null
  })
  const [currentPage, setCurrentPage] = React.useState(null);
  const [navOpen, setNavOpen] = React.useState(true);
  const toggleDrawer = () => {
      console.log('nice')
      console.log(navOpen)
      if (navOpen == true) {
          setNavOpen(false);
      } else {
          setNavOpen(true);
      }
    setNavOpen(true);
  };
  React.useEffect(() => {
    if (Cookies.get('token')) {
      var user_info = jsonwebtoken.decode(Cookies.get('token'))
        setUserData({
          first_name: user_info.first_name,
          last_name: user_info.last_name,
          email: user_info.email,
          admin: user_info.admin
        })

    }
  }, [])
const styles = {
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
      },
}
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>

          <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap component="div">
            Ararat
          </Typography>
          <IconButton component={Link} to="/auth/logout" edge="end">                   <LogoutIcon /></IconButton>

        </Toolbar>
      </AppBar>
      <Hidden only={["sm", "xs"]}>
      <Drawer
        open={navOpen}
        anchor="left"
        variant={isMobile == true ? "persistent" : "permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <ListSubheader>Administration</ListSubheader>
          <List>
          <ListItem selected={props.page == "overview" ? true : false} button component={Link} to={`/admin/instance/${instance}`} key='Overview'>
                <ListItemIcon>
                   <OverviewIcon />
                </ListItemIcon>
                <ListItemText primary='Overview' />
              </ListItem>
          <ListItem selected={props.page == "settings"  ? true : false} button component={Link} to={`/admin/instance/${instance}/settings`} key='Settings'>
                <ListItemIcon>
                   <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary='Settings' />
              </ListItem>
              <ListItem selected={props.page == "api"  ? true : false} button component={Link} to={`/admin/instance/${instance}/api`} key='API'>
                <ListItemIcon>
                   <APIIcon />
                </ListItemIcon>
                <ListItemText primary='API' />
              </ListItem>
              </List>
              <ListSubheader>Management</ListSubheader>
              <List>
              <ListItem selected={props.page == "servers"  ? true : false} button component={Link} to={`/admin/instance/${instance}/servers`} key='Servers'>
                <ListItemIcon>
                   <ServersIcon />
                </ListItemIcon>
                <ListItemText primary='Servers' />
              </ListItem>
              <ListItem selected={props.page == "nodes"  ? true : false} button component={Link} to={`/admin/instance/${instance}/nodes`} key='Nodes'>
                <ListItemIcon>
                   <NodesIcon />
                </ListItemIcon>
                <ListItemText primary='Nodes' />
              </ListItem>
              </List>
                         <Divider />                <List>

<ListItem button component={Link} to={`/instance/${instance}`} key='Client'>
                <ListItemIcon>
                   <ClientIcon />
                </ListItemIcon>
                <ListItemText
                 primary='Client' />
              </ListItem>                </List>


        </Box>
      </Drawer>
      </Hidden>  
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
    </Box>
    <Hidden only={["lg", "xl", "md"]}>
      <Box style={     {   width: '100%',
        position: 'fixed',
        bottom: 0}}sx={{ width: 500}}>
      <BottomNavigation
        showLabels
        value={currentPage}
        onChange={(event, newValue) => {
          setCurrentPage(newValue);
        }}
      >
        <BottomNavigationAction value={'overview'} selected={props.page == "overview" ? true : false} label="Administration" icon={<OverviewIcon />} />
        <BottomNavigationAction value={'settings'} selected={props.page == "management" ? true : false } component={Link} to="/admin/settings" label="Management" icon={<SettingsIcon />} />
        <BottomNavigationAction component={Link} to="/" label="Client" icon={<AdminIcon />} />
      </BottomNavigation>
    </Box>
      </Hidden>
    </Box>
  )
}

export default AdminDashboard