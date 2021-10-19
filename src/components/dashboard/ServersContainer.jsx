/* eslint-disable react/jsx-key */
import { Typography, Grid } from "@material-ui/core";
//import {ReactComponent as Logo} from '../../minecraft.svg'
import React from "react";
import { useParams } from "react-router-dom";
import getServers from "../../api/v1/getServers";
import Server from "./Server";

function ServersContainer() {
  const [servers, setServers] = React.useState([]);
  const { instance } = useParams();
  React.useEffect(() => {
    getServers().then((servers) => {
      console.log(servers);
      setServers(servers);
    });
    /*     console.log(instance);
    setServers([]);
    const serversRef = collection(database, `/instances/${instance}/servers`);
    const q = query(
      serversRef,
      where(`users.${auth.currentUser.uid}.files.read`, "==", true)
    );
    console.log("RIGHT BEFORE");
    onSnapshot(q, (querySnapshot) => {
      console.log("DONE");
      console.log("fetched");
      let current_servers = [];
      function setServerData() {
        console.log("FUNCTION RUN");
        if (querySnapshot.docs.length == current_servers.length) {
          setServers(current_servers);
          console.log(current_servers);
        } else {
          console.log("not enough yet");
        }
      }
      querySnapshot.forEach((doc) => {
        var current_server = doc.data();
        current_server.id = doc.id;

        current_servers.push(current_server);
        setServerData();
      });
    }); */
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Your Servers
      </Typography>
      {/*         <TableContainer sx={{mt: 3}} component={Paper}>
        <Table>
          <TableHead size="small">
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Address</TableCell>
          <TableCell align="right">Memory</TableCell>
          <TableCell align="right">CPU Cores</TableCell>
          <TableCell align="right">Disk</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Action</TableCell>


          </TableHead> */}
      <Grid spacing={5} container direction="row">
        {servers.map((server) => {
          console.log(server.name);
          return <Server instance={instance} server={server} />;
        })}
      </Grid>
    </React.Fragment>
  );
}

export default ServersContainer;
