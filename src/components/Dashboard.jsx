/* eslint-disable no-unused-vars */
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
  Tooltip,
  Skeleton,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  Storage as StorageIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as AdminIcon,
  Logout as LogoutIcon,
  Business as InstanceIcon,
} from "@material-ui/icons";
import React from "react";
import Firebase from "./db";
import { getAuth } from "firebase/auth";
import { getStorage } from "@firebase/storage";
import { doc, getFirestore, onSnapshot } from "@firebase/firestore";
import { Link, useParams } from "react-router-dom";
const drawerWidth = 240;
const database = getFirestore();
const auth = getAuth(Firebase);

function Dashboard(props) {
  console.log("oh yes no");
  let { instance } = useParams();
  const [isMobile, setIsMobile] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [logo, setLogo] = React.useState();
  const [user, setUser] = React.useState({
    instances: [],
  });
  const [instance_data, setInstanceData] = React.useState({
    name: null,
    id: instance,
  });
  const [instances, setInstances] = React.useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  /*   React.useEffect(() => {
    const docRef = doc(database, "instances", instance);
    onSnapshot(docRef, (doc) => {
      console.log("fetched");
      setInstanceData(doc.data());
    });
  }, [instance]); */

  /*   React.useEffect(() => {
    const docRef = doc(database, "users", auth.currentUser.uid);
    onSnapshot(docRef, (doc) => {
      setUser(doc.data());
      console.log(doc.data().instances);
    });
  }, []); */

  /*   React.useEffect(() => {
    if (user.instances.length > 1) {
      let current_instances = [];

      const setInstanceValues = (update) => {
        if (
          current_instances.length != user.instances.length &&
          update == false
        ) {
          return;
        } else {
          console.log(current_instances);
          setInstances(current_instances);
          if (update == true) {
            forceUpdate();
            console.log("Data was updated!");
          }
        }
      };
      user.instances.map(async (instance_id) => {
        if (instance_id == instance) {
          instance_data.id = instance_id;
          current_instances.push(instance_data);
        } else {
          const docRef = doc(database, "instances", instance_id);
          onSnapshot(docRef, (doc) => {
            var instance_data = doc.data();
            if (current_instances.find((data) => data.id == instance_id)) {
              var instanceLoc = current_instances.findIndex(
                (existing_instance) => existing_instance.id == instance_id
              );
              if (doc.exists()) {
                instance_data.id = instance_id;
                current_instances[instanceLoc] = instance_data;
              } else {
                current_instances.splice(instanceLoc, -1);
                console.log(current_instances);
              }
              setInstanceValues(true);
            } else {
              instance_data.id = instance_id;
              current_instances.push(instance_data);
              setInstanceValues(false);
            }
          });
        }
      });
    }
  }, [user, instance_data]); */

  /*   React.useEffect(() => {
    const pathReference = ref(storage, `instances/${instance}/images/logo.png`);
    getDownloadURL(pathReference)
      .then((url) => {
        setLogo(url);
      })
      .catch((error) => {
        console.log(error);
        setLogo(null);
      });
  }, []); */

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
    if (props.page == "servers") {
      setCurrentPage("servers");
    }
    if (props.page == "account") {
      setCurrentPage("account");
    }
  }, []);
  const [currentPage, setCurrentPage] = React.useState(null);
  // const [navOpen, setNavOpen] = React.useState(true);
  const [is_admin, setAdmin] = React.useState();
  /*   const toggleDrawer = () => {
    console.log('nice')
    console.log(navOpen)
    if (navOpen == true) {
      setNavOpen(false)
    } else {
      setNavOpen(true)
    }
    setNavOpen(true);
  }; */
  /*   React.useEffect(() => {
    console.log("E");
    auth.currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        console.log(idTokenResult);
        console.log(window.location.hostname);
        if (idTokenResult.claims.admin) {
          const docRef = doc(
            database,
            "instances",
            instance,
            "users",
            auth.currentUser.uid
          );
          onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              if (doc.data().admin == true) {
                setAdmin(true);
              }
            } else {
              setAdmin(false);
            }
          });
        } else {
          setAdmin(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.instances, instance]); */
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
            {instance_data.name ? (
              instance_data.name
            ) : (
              <Skeleton variant="text" width={100} height={50}></Skeleton>
            )}
          </Typography>
          {instances.length != 0 ? (
            <React.Fragment>
              <InstanceIcon sx={{ mr: 1 }} />
              <Select
                disableUnderline
                variant="standard"
                value={instance}
                // eslint-disable-next-line no-unused-vars
                onChange={(event) => console.log("nice")}
              >
                {instances.map((instance_info) => {
                  {
                    console.log("instance is working", instance_info.name);
                  }
                  return (
                    <MenuItem
                      component={Link}
                      to={`/instance/${instance_info.id}`}
                      key={instance_info.id}
                      value={instance_info.id}
                    >
                      {instance_info.name}
                    </MenuItem>
                  );
                })}
                <Divider />
                <MenuItem component={Link} to={`/`} value={"back"}>
                  Back to Instance Selection
                </MenuItem>
              </Select>
            </React.Fragment>
          ) : (
            ""
          )}
          <Tooltip title="Logout">
            <IconButton component={Link} to="/auth/logout" edge="end">
              {" "}
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Hidden only={["sm", "xs"]}>
        <Drawer
          // open={navOpen}
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
            <Divider />
            <List>
              <ListItem
                selected={props.page == "servers" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}`}
                key="Servers"
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Servers" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/account`}
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
                <Divider />
                <List>
                  <ListItem
                    button
                    component={Link}
                    to={`/admin/instance/${instance}`}
                    key="Admin"
                  >
                    <ListItemIcon>
                      <AdminIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>
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
              value={"servers"}
              selected={props.page == "server" ? true : false}
              component={Link}
              to="/"
              label="Servers"
              icon={<StorageIcon />}
            />
            <BottomNavigationAction
              value={"account"}
              selected={props.page == "account" ? true : false}
              component={Link}
              to="/account"
              label="Account"
              icon={<AccountIcon />}
            />
            <BottomNavigationAction
              component={Link}
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

export default Dashboard;
