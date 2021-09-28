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
  SupervisorAccount as AdminIcon,
  Logout as LogoutIcon,
  Dvr as OverviewIcon,
  Settings as SettingsIcon,
  Person as ClientIcon,
  Business as InstanceIcon,
} from "@material-ui/icons";
import jsonwebtoken from "jsonwebtoken";
import React from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
const drawerWidth = 240;

function AdminInstanceSelectDashboard(props) {
  console.log("no");
  console.log(props);
  const [isMobile, setIsMobile] = React.useState(false);

  //choose the screen size
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
    console.log("why");
    if (props.page == "servers") {
      setCurrentPage("servers");
    }
    if (props.page == "account") {
      setCurrentPage("account");
    }
  }, []);
  // eslint-disable-next-line no-unused-vars
  const [user_data, setUserData] = React.useState({
    email: null,
    first_name: null,
    last_name: null,
    admin: null,
  });
  const [currentPage, setCurrentPage] = React.useState(null);
  // const [navOpen, setNavOpen] = React.useState(true);
  /*   const toggleDrawer = () => {
    console.log('nice')
    console.log(navOpen)
    if (navOpen == true) {
      setNavOpen(false);
    } else {
      setNavOpen(true);
    }
    setNavOpen(true);
  }; */
  React.useEffect(() => {
    if (Cookies.get("token")) {
      var user_info = jsonwebtoken.decode(Cookies.get("token"));
      setUserData({
        first_name: user_info.first_name,
        last_name: user_info.last_name,
        email: user_info.email,
        admin: user_info.admin,
      });
    }
  }, []);
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
          <IconButton component={Link} to="/auth/logout" edge="end">
            {" "}
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Hidden only={["sm", "xs"]}>
        <Drawer
          open={true}
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
            <List>
              <ListItem
                selected={props.page == "instances" ? true : false}
                button
                component={Link}
                to={`/admin`}
                key="Instances"
              >
                <ListItemIcon>
                  <InstanceIcon />
                </ListItemIcon>
                <ListItemText primary="Instances" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button component={Link} to="/" key="Client">
                <ListItemIcon>
                  <ClientIcon />
                </ListItemIcon>
                <ListItemText primary="Client" />
              </ListItem>{" "}
            </List>
          </Box>
        </Drawer>
      </Hidden>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
      <Hidden only={["lg", "xl", "md"]}>
        <Box
          style={{
            width: "100%",
            position: "fixed",
            bottom: 0,
          }}
          sx={{ width: 500 }}
        >
          <BottomNavigation
            showLabels
            value={currentPage}
            onChange={(event, newValue) => {
              setCurrentPage(newValue);
            }}
          >
            <BottomNavigationAction
              value={"overview"}
              selected={props.page == "overview" ? true : false}
              label="Administration"
              icon={<OverviewIcon />}
            />
            <BottomNavigationAction
              value={"settings"}
              selected={props.page == "management" ? true : false}
              component={Link}
              to="/admin/settings"
              label="Management"
              icon={<SettingsIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/"
              label="Client"
              icon={<AdminIcon />}
            />
          </BottomNavigation>
        </Box>
      </Hidden>
    </Box>
  );
}

export default AdminInstanceSelectDashboard;
