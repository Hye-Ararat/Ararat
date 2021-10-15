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
  Chip,
  Fade,
} from "@material-ui/core";
import {
  Storage as StorageIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as AdminIcon,
  Logout as LogoutIcon,
  Business as InstanceIcon,
  Dvr as OverviewIcon,
  Monitor as ConsoleIcon,
  Folder as FilesIcon,
  Backup as BackupIcon,
  Extension as PluginIcon,
  People as PlayersIcon,
} from "@material-ui/icons";
import React from "react";
import Firebase from "../../db";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "@firebase/firestore";
import { Link, useParams } from "react-router-dom";
const drawerWidth = 240;
const database = getFirestore();
const auth = getAuth(Firebase);

function ServerDashboard(props) {
  console.log("oh yes no");
  let { instance, server } = useParams();
  const [isMobile, setIsMobile] = React.useState(false);
  const [user, setUser] = React.useState({
    instances: [],
  });
  const [instance_data, setInstanceData] = React.useState({
    name: null,
    id: instance,
  });
  const [server_data, setServerData] = React.useState({
    name: null,
  });
  const [node_data, setNodeData] = React.useState();
  const [instances, setInstances] = React.useState([]);
  const [server_status, setServerStatus] = React.useState({
    status: null,
  });
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  //Fetches Current Instance Data
  React.useEffect(() => {
    const docRef = doc(database, "instances", instance);
    onSnapshot(docRef, (doc) => {
      console.log("fetched");
      setInstanceData(doc.data());
    });
  }, [instance]);

  //Fetches Current Server Data
  React.useEffect(() => {
    const docRef = doc(database, "instances", instance, "servers", server);
    onSnapshot(docRef, (doc) => {
      const temp_server_info = doc.data();
      temp_server_info.id = doc.id;
      setServerData(temp_server_info);
    });
  }, [server, instance]);

  //Fetches Node Data
  React.useEffect(() => {
    if (server_data.name) {
      const docRef = doc(
        database,
        "instances",
        instance,
        "nodes",
        server_data.node
      );
      onSnapshot(docRef, (doc) => {
        setNodeData(doc.data());
      });
    }
  }, [server_data]);

  //Establishes Websocket to Get Server Status Data
  React.useEffect(() => {
    async function websocketResources() {
      const ws = new WebSocket(
        `wss://${node_data.address.hostname}:${node_data.address.port}/api/v1/server/${server_data.id}/resources`
      );
      let previous_data = {
        status: null,
      };
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (previous_data.status != response.status) {
          previous_data.status = response.status;
          setServerStatus(response.status);
        }
      };
    }
    if (node_data) {
      websocketResources();
    }
  }, [node_data]);
  React.useEffect(() => {
    console.log(server_status);
  }, [server_status]);
  //Gets User Data
  React.useEffect(() => {
    const docRef = doc(database, "users", auth.currentUser.uid);
    onSnapshot(docRef, (doc) => {
      setUser(doc.data());
      console.log(doc.data().instances);
    });
  }, []);

  //Gets All Instances Data
  React.useEffect(() => {
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
  }, [user, instance_data]);

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
  React.useEffect(() => {
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
  }, [user.instances, instance]);
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
            {server_data.name ? (
              server_data.name
            ) : (
              <Skeleton variant="text" width={100} height={50}></Skeleton>
            )}
            {server_status == "running" ? (
              <Fade in={true}>
                <Chip
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: 5,
                    verticalAlign: "middle",
                  }}
                  color="success"
                  size="large"
                  label="Online"
                />
              </Fade>
            ) : server_status == "exited" ? (
              <Fade in={true}>
                <Chip
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: 5,
                    verticalAlign: "middle",
                  }}
                  color="error"
                  size="large"
                  label="Offline"
                />
              </Fade>
            ) : (
              ""
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
            <List>
              <ListItem
                selected={props.page == "overview" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/server/${server}`}
                key="Overview"
              >
                <ListItemIcon>
                  <OverviewIcon />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/server/${server}/console`}
                key="Console"
              >
                <ListItemIcon>
                  <ConsoleIcon />
                </ListItemIcon>
                <ListItemText primary="Console" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/server/${server}/files`}
                key="Files"
              >
                <ListItemIcon>
                  <FilesIcon />
                </ListItemIcon>
                <ListItemText primary="Files" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/server/${server}/backups`}
                key="Backups"
              >
                <ListItemIcon>
                  <BackupIcon />
                </ListItemIcon>
                <ListItemText primary="Backups" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/account`}
                key="Account"
              >
                <ListItemIcon>
                  <PluginIcon />
                </ListItemIcon>
                <ListItemText primary="Plugins" />
              </ListItem>
              <ListItem
                selected={props.page == "account" ? true : false}
                button
                component={Link}
                to={`/instance/${instance}/account`}
                key="Account"
              >
                <ListItemIcon>
                  <PlayersIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
              </ListItem>
            </List>
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

export default ServerDashboard;
