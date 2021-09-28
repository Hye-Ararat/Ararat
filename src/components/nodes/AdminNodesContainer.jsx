import React from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";
import { withRouter, Link, useParams } from "react-router-dom";
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
} from "@firebase/firestore";
function Loading() {
  return (
    <GridOverlay
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
      }}
    >
      <CircularProgress />
    </GridOverlay>
  );
}
function NoNodes() {
  const { instance } = useParams();

  return (
    <GridOverlay>
      <Box textAlign="center">
        <Typography>There are no nodes on this instance.</Typography>
        <Button
          sx={{ mt: 1 }}
          variant="contained"
          component={Link}
          to={`/admin/instance/${instance}/nodes/create`}
        >
          Create One
        </Button>
      </Box>
    </GridOverlay>
  );
}
const database = getFirestore();
function Toolbar() {
  const { instance } = useParams();

  return (
    <Box m={1} display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        size="small"
        component={Link}
        to={`/admin/instance/${instance}/servers/create`}
        align="right"
      >
        Create
      </Button>
    </Box>
  );
}
function AdminNodesContainer() {
  const { instance } = useParams();
  const [nodes, setNodes] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [columns, setColumns] = React.useState([
    { field: "name", headerName: "Name", width: 130 },
    { field: "group", headerName: "Group", width: 125 },
    { field: "resources.memory", headerName: "Memory", width: 130 },
  ]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const q = query(collection(database, `/instances/${instance}/nodes`));
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length == 0) {
        setNodes([]);
      }
      let current_nodes = [];
      function setNodeData() {
        if (current_nodes.length == querySnapshot.docs.length) {
          setNodes(current_nodes);
          console.log(current_nodes);
          setLoading(false);
        } else {
          console.log("not ready");
        }
      }
      querySnapshot.forEach((doc) => {
        let current_node = doc.data();
        console.log(doc.data());
        current_node["id"] = doc.data().name;
        current_nodes.push(current_node);
        setNodeData();
      });
    });
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h4">Nodes</Typography>
      <Paper sx={{ height: 500, mt: 2 }}>
        <DataGrid
          style={{ border: 0 }}
          loading={loading}
          rows={nodes}
          columns={columns}
          components={{
            NoRowsOverlay: NoNodes,
            Toolbar: Toolbar,
            LoadingOverlay: Loading,
          }}
        />
      </Paper>
    </React.Fragment>
  );
}
export default withRouter(AdminNodesContainer);
