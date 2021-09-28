/* eslint-disable react/prop-types */
import {
  Box,
  Drawer,
  AppBar,
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
} from "@material-ui/core";
import {
  Business as InstanceIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as AdminIcon,
  Logout as LogoutIcon,
} from "@material-ui/icons";
import React from "react";
import Firebase from "../db";
import { getAuth } from "firebase/auth";
import { NavLink } from "react-router-dom";
const drawerWidth = 240;
const auth = getAuth(Firebase);
function Navigation(props) {
  const [isMobile, setIsMobile] = React.useState(false);

  //choose the screen size
  console.log("Does this re-run?");
  const handleResize = () => {
    if (window.innerWidth < 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  React.useEffect(() => {
    handleResize();
  });
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  });
  React.useEffect(() => {
    if (props.page == "instances") {
      //setCurrentPage('instances')
    }
    if (props.page == "account") {
      //setCurrentPage('account')
    }
  }, []);
  // eslint-disable-next-line no-unused-vars
  const [user_data, setUserData] = React.useState({
    email: null,
    first_name: null,
    last_name: null,
    admin: null,
  });
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [navOpen, setNavOpen] = React.useState(true);
  const [is_admin, setAdmin] = React.useState();
  /*     const toggleDrawer = () => {
        console.log('nice')
        console.log(navOpen)
        if (navOpen == true) {
            //setNavOpen(false)
        } else {
            //setNavOpen(true)
        }
      //setNavOpen(true);
    }; */
  React.useEffect(() => {
    auth.currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        console.log(idTokenResult);
        console.log(window.location.hostname);
        if (idTokenResult.claims.admin) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
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
  /*   const styles = {
      stickToBottom: {
          width: '100%',
          position: 'fixed',
          bottom: 0,
        },
  } */
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
          <IconButton component={NavLink} to="/auth/logout" edge="end">
            {" "}
            <LogoutIcon />
          </IconButton>
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
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <Divider />
            <List>
              <ListItem
                selected={props.page == "instances" ? true : false}
                button
                component={NavLink}
                to="/"
                key="Instances"
              >
                <ListItemIcon>
                  <InstanceIcon />
                </ListItemIcon>
                <ListItemText primary="Instances" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={NavLink}
                to="/account"
                key="Account"
              >
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
            </List>
            {is_admin == true ? (
              <>
                {" "}
                <Divider />{" "}
                <List>
                  <ListItem button component={NavLink} to="/admin" key="Admin">
                    <ListItemIcon>
                      <AdminIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>{" "}
                </List>
              </>
            ) : (
              ""
            )}
          </Box>
        </Drawer>
      </Hidden>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
      <Hidden only={["lg", "xl", "md"]}>
        <Box
          style={{ width: "100%", position: "fixed", bottom: 0 }}
          sx={{ width: 500 }}
        >
          <BottomNavigation
            showLabels
            value={currentPage}
            // eslint-disable-next-line no-unused-vars
            onChange={(event, newValue) => {
              //setCurrentPage(newValue);
            }}
          >
            <BottomNavigationAction
              value={"servers"}
              selected={props.page == "server" ? true : false}
              component={NavLink}
              to="/"
              label="Servers"
              icon={<InstanceIcon />}
            />
            <BottomNavigationAction
              value={"account"}
              selected={props.page == "account" ? true : false}
              component={NavLink}
              to="/account"
              label="Account"
              icon={<AccountIcon />}
            />
            <BottomNavigationAction
              component={NavLink}
              to="/admin"
              label="Admin"
              icon={<AdminIcon />}
            />
          </BottomNavigation>
        </Box>
      </Hidden>
    </Box>
  );
}

export default Navigation;
