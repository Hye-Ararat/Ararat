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
    Button
  } from '@material-ui/core'
  import {
      Storage as StorageIcon,
      AccountCircle as AccountIcon,
      SupervisorAccount as AdminIcon,
      Menu as MenuIcon,
      Logout as LogoutIcon
  } from '@material-ui/icons'
  import InboxIcon from '@material-ui/icons/Inbox'
  import MailIcon from '@material-ui/icons/Mail'
  import jsonwebtoken from 'jsonwebtoken'
  import React from 'react'
  import Cookies from 'js-cookie'
  import axios from 'axios'
  import Firebase from './db'
  import {getAuth} from 'firebase/auth'
  import {
    Link
  } from 'react-router-dom'
  const drawerWidth = 240;
  const auth = getAuth(Firebase)
  function Dashboard(props) {
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
    const [is_admin, setAdmin] = React.useState()
    const toggleDrawer = () => {
        console.log('nice')
        console.log(navOpen)
        if (navOpen == true) {
            setNavOpen(false)
        } else {
            setNavOpen(true)
        }
      setNavOpen(true);
    };
    React.useEffect(() => {
      auth.currentUser.getIdTokenResult().then((idTokenResult) => {
        console.log(idTokenResult)
        console.log(window.location.hostname)
        if (!!idTokenResult.claims.admin){
          setAdmin(true)
        } else {
          setAdmin(false)
        }
      }).catch((error) => {
        console.log(error)
      })
    }, [])
/*     React.useEffect(() => {
      user.get('email').on(function(email, key){
        user.get('admin').on(function(admin, key){
          setUserData({
            email: email,
            admin: admin
          })
        })
      })
    }, []) */
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
            <Divider />
            <List>
            <ListItem selected={props.page == "servers" ? true : false} button component={Link} to="/" key='Servers'>
                  <ListItemIcon>
                     <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary='Servers' />
                </ListItem>
            <ListItem selected={props.page == "account"  ? true : false} button component={Link} to="/account" key='Account'>
                  <ListItemIcon>
                     <AccountIcon />
                  </ListItemIcon>
                  <ListItemText primary='Account' />
                </ListItem>
                </List>
                {is_admin == true ?          <>                     <Divider />                <List>

  <ListItem button component={Link} to="/admin" key='Admin'>
                  <ListItemIcon>
                     <AdminIcon />
                  </ListItemIcon>
                  <ListItemText
                   primary='Admin' />
                </ListItem>                </List>
 </>: ""}

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
          <BottomNavigationAction value={'servers'} selected={props.page == "server" ? true : false} component={Link} to='/' label="Servers" icon={<StorageIcon />} />
          <BottomNavigationAction value={'account'} selected={props.page == "account" ? true : false } component={Link} to="/account" label="Account" icon={<AccountIcon />} />
          <BottomNavigationAction component={Link} to="/admin" label="Admin" icon={<AdminIcon />} />
        </BottomNavigation>
      </Box>
        </Hidden>
      </Box>
    )
  }
  
  export default Dashboard