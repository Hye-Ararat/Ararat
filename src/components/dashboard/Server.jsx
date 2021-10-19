/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Typography,
  Chip,
  Fade,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Avatar,
  Skeleton,
} from "@material-ui/core";
import BackdropFilter from "react-backdrop-filter";
//import {ReactComponent as Logo} from '../../minecraft.svg'
import {
  PeopleAlt as PlayersIcon,
  SettingsEthernet as AddressIcon,
} from "@material-ui/icons";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { getFirestore, onSnapshot, doc } from "@firebase/firestore";
import prettyBytes from "pretty-bytes";
import getNode from "../../api/v1/nodes/getNode";
function Server(props) {
  const history = useHistory();
  const database = getFirestore();
  const [allocation_data, setAllocationData] = React.useState();
  const [server_status, setServerStatus] = React.useState({
    status: null,
    cpu: null,
    memory: null,
    disk: null,
    netin: null,
    netout: null,
  });
  const [minecraft_server_query, setMinecraftServerQuery] = React.useState();
  const [node_info, setNodeInfo] = React.useState({
    address: {
      hostname: null,
      port: null,
    },
  });
  /*   React.useEffect(() => {
    if (props.server.allocations.main) {
      console.log(props.server.node);
      console.log(props.instance);
      console.log(props.server.allocations.main);
      const docRef = doc(
        database,
        "instances",
        props.instance,
        "nodes",
        props.server.node,
        "allocations",
        props.server.allocations.main
      );
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          console.log(doc.data());
          setAllocationData(doc.data());
        } else {
          console.log("nope");
        }
      });
      history.listen((location, action) => {
        console.log(`${action} on ${location}`);
        if (action === "PUSH") {
          unsubscribe();
        }
      });
    }
  }, []); */
  React.useEffect(() => {
    getNode(props.server.node)
      .then((response) => {
        setNodeInfo(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  /*   React.useEffect(() => {
    const docRef = doc(
      database,
      "instances",
      props.instance,
      "nodes",
      props.server.node
    );
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setNodeInfo(doc.data());
    });
    history.listen((location, action) => {
      console.log(`${action} on ${location}`);
      if (action === "PUSH") {
        unsubscribe();
      }
    });
  }, []); */
  React.useEffect(() => {
    async function websocketResources() {
      const ws = new WebSocket(
        `wss://${node_info.address.hostname}:${node_info.address.port}/api/v1/server/${props.server.id}/resources`
      );
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        setServerStatus(response);
      };

      history.listen((location, action) => {
        console.log(`${action} on ${location}`);
        if (action === "PUSH") {
          ws.close();
        }
      });
    }
    async function websocketPlayers() {
      const ws = new WebSocket(
        `wss://${node_info.address.hostname}:${node_info.address.port}/api/v1/server/${props.server.id}/minecraft/players`
      );
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        setMinecraftServerQuery(response);
      };
      history.listen((location, action) => {
        console.log(`${action} on ${location}`);
        if (action === "PUSH") {
          ws.close();
        }
      });
    }
    if (
      (node_info.address.hostname != null) &
      (node_info.address.port != null)
    ) {
      websocketPlayers();
      websocketResources();
    }
  }, [node_info]);
  return (
    <Grid item>
      <Fade in={true}>
        <Card sx={{ width: 450 }}>
          <CardActionArea
            component={Link}
            to={`/instance/${props.instance}/server/${props.server.id}`}
          >
            <CardContent
              style={{
                padding: "0px",
                background:
                  "url(https://wallpaperaccess.com/download/minecraft-171177)",
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
                backgroundRepeat: "no-repeat",
              }}
            >
              <BackdropFilter filter={"blur(7px) brightness(50%)"}>
                <div style={{ padding: "16px" }}>
                  <Grid container justifyContent="center">
                    <img
                      height="45px"
                      style={{ marginBottom: 3 }}
                      src={
                        node_info.address.hostname != null
                          ? `https://${node_info.address.hostname}:${node_info.address.port}/api/v1/server/${props.server.id}/files/download?path=/server-icon.png`
                          : ""
                      }
                    />
                  </Grid>
                  <Grid container justifyContent="center">
                    <Typography
                      style={{ backdropFilter: "blur(5px)" }}
                      align="center"
                      variant="h4"
                    >
                      {props.server.name}
                    </Typography>
                  </Grid>
                  <Typography align="center" m={1}>
                    {server_status.status ? (
                      server_status.status == "running" ? (
                        <Chip
                          style={{ margin: "auto", verticalAlign: "middle" }}
                          color="success"
                          size="large"
                          label="Online"
                        />
                      ) : (
                        ""
                      )
                    ) : (
                      <Skeleton
                        style={{ margin: "auto", verticleAlign: "middle" }}
                        animation="wave"
                      >
                        {" "}
                        <Chip
                          style={{ margin: "auto", verticalAlign: "middle" }}
                          color="success"
                          size="large"
                          label="Online"
                        />
                      </Skeleton>
                    )}
                    {server_status.status ? (
                      server_status.status == "exited" ? (
                        <Chip
                          style={{ margin: "auto", verticalAlign: "middle" }}
                          color="error"
                          size="large"
                          label="Offline"
                        />
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </Typography>
                  <Grid container direction="row" justifyContent="center">
                    <Grid
                      container
                      justifyContent="center"
                      direction="column"
                      sx={{
                        border: "1px",
                        borderRadius: 1,
                        width: 190,
                        height: 100,
                        boxShadow: 3,
                        mt: "auto",
                        mr: "auto",
                        ml: "auto",
                      }}
                      style={{ backgroundColor: "rgba(25, 25, 25, 0.7)" }}
                    >
                      <Avatar
                        sx={{ color: "#fff", bgcolor: "#2a6abf", mt: 1 }}
                        style={{ alignSelf: "center" }}
                      >
                        <AddressIcon />
                      </Avatar>
                      <Chip
                        sx={{ mb: "auto", mr: "auto", ml: "auto", mt: "auto" }}
                        color="info"
                        size="large"
                        label={
                          allocation_data
                            ? allocation_data.ip_alias +
                              ":" +
                              allocation_data.port
                            : "1.1.1.1"
                        }
                      />
                    </Grid>

                    <Grid
                      container
                      justifyContent="center"
                      direction="column"
                      sx={{
                        border: "1px",
                        borderRadius: 1,
                        width: 190,
                        height: 100,
                        boxShadow: 3,
                        mt: "auto",
                        mr: "auto",
                        ml: "auto",
                      }}
                      style={{ backgroundColor: "rgba(25, 25, 25, 0.7)" }}
                    >
                      <Avatar
                        sx={{ color: "#fff", bgcolor: "#2a6abf", mt: 1 }}
                        style={{ alignSelf: "center" }}
                      >
                        <PlayersIcon />
                      </Avatar>
                      <Chip
                        sx={{
                          mb: "auto",
                          mr: "auto",
                          ml: "auto",
                          mt: "auto",
                        }}
                        color="info"
                        size="large"
                        label={
                          minecraft_server_query ? (
                            minecraft_server_query.onlinePlayers +
                            " / " +
                            minecraft_server_query.maxPlayers
                          ) : (
                            <Skeleton
                              animation="wave"
                              width={40}
                              height={30}
                            ></Skeleton>
                          )
                        }
                      />
                    </Grid>
                  </Grid>

                  <Typography align="center" m={1}></Typography>
                </div>
                <CardContent>
                  <Grid container direction="column">
                    <Typography
                      noWrap
                      variant="body2"
                      style={{ fontWeight: "bold", margin: "auto" }}
                    >
                      CPU Usage:{" "}
                      {server_status.status != "exited"
                        ? server_status.cpu
                          ? server_status.cpu.toFixed(2) + "%"
                          : ""
                        : "0%"}
                    </Typography>
                    <Typography
                      noWrap
                      variant="body2"
                      style={{ fontWeight: "bold", margin: "auto" }}
                    >
                      Memory:{" "}
                      {server_status.status != "exited"
                        ? server_status.memory
                          ? prettyBytes(server_status.memory, {
                              binary: true,
                            }) + "/ 8GiB"
                          : ""
                        : "0GiB / 8GiB"}
                    </Typography>
                    <Typography
                      noWrap
                      variant="body2"
                      style={{ fontWeight: "bold", margin: "auto" }}
                    >
                      Disk: 22.5GB/32.0GB
                    </Typography>
                  </Grid>
                </CardContent>
              </BackdropFilter>
            </CardContent>
          </CardActionArea>
        </Card>
        {/*             <TableRow align="left" key={server.name}>
{/*               <TableCell width={10} underline="none" component="th" to="nice" scope="row">

                </TableCell> */}
        {/* <TableCell align="left">
                <Link style={{textDecoration: 'none', color: blue[500], verticalAlign: 'middle'}} to="/nice">Server Name</Link>

                </TableCell>
              <TableCell align="left">1.1.1.1</TableCell>
              <TableCell align="right">{server.limits.memory}</TableCell>
              <TableCell align="right">{server.limits.cpu}</TableCell>
              <TableCell align="right" >{server.limits.disk}</TableCell>
              <TableCell align="right" sx={{color: '#4caf50'}} ><Chip color="success" size="small" label="Online"></Chip></TableCell>
              <TableCell align="right"><Button size="small" variant="contained">Manage</Button></TableCell>
            </TableRow> */}
      </Fade>
    </Grid>
  );
}

export default Server;
