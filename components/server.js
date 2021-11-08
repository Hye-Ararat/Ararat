import {
  Grid,
  CardActionArea,
  Typography,
  Avatar,
  Paper,
  Box,
} from "@mui/material";
import useSWR, { mutate, SWRConfig } from "swr";
import axios from "axios";
import {
  SettingsEthernet as AddressIcon,
  ShowChart as CpuIcon,
  Memory as MemoryIcon,
  Save as DiskIcon,
  SettingsEthernet as NetworkIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes";
import Link from "next/link";

export default function Server({ server }) {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const [resources, setResources] = useState({
    cpu: null,
    disk: null,
    memory: null,
    status: null,
  });
  function prefetch() {
    mutate(`/api/v1/client/servers/${server._id}`, server, true);
  }
  useEffect(() => {
    prefetch();
  });
  function Server() {
    const { data } = useSWR(`/api/v1/client/servers/${server._id}`, fetcher);
    if (!data) {
      return server;
    }
    console.log(data);
    return {
      name: data.data.name,
    };
  }
  function Allocation() {
    const { data } = useSWR(
      `/api/v1/client/allocations/${server.allocations.main}`,
      fetcher
    );
    if (!data) {
      return {
        ip_alias: "Loading",
        port: "Loading",
      };
    }
    return {
      ip_alias: data.data.ip_alias,
      port: data.data.port,
    };
  }
  useEffect(() => {
    mutate(
      `/api/v1/client/nodes/${server.node}`,
      axios.get(`/api/v1/client/nodes/${server.node}`),
      true
    ).then((res) => {
      var node_data = res.data;
      console.log(node_data);
      async function resources() {
        try {
          var token = await axios.get(`/api/v1/client/servers/${server._id}/monitor`)
        } catch {
          console.log("Error while fetching token data")
        }
        token = token.data.data.access_token
        // websocket headers
        
        const ws = new WebSocket(
          `wss://${node_data.data.address.hostname}:${node_data.data.address.port}/api/v1/servers/${server._id}/monitor`
        );
        console.log(
          `wss://${node_data.data.address.hostname}:${node_data.data.address.port}/api/v1/servers/${server._id}/monitor`
        );
        ws.onopen = () => {
          console.log("open");
          ws.send(JSON.stringify({event: "authenticate", data: {monitor_token: token}}));
        };
        ws.onerror = (error) => {
          console.error(error);
        };
        ws.onmessage = (e) => {
          console.log(JSON.parse(e.data));
          if (e.data != "Unauthorized") {
            setResources(JSON.parse(e.data));
          }
        };
      }
      resources();
    });
  }, []);
  return (
    <Grid container item md={12} xs={12} direction="row">
      <Link href={`/server/${server._id}`}>
        <CardActionArea sx={{ borderRadius: "10px" }}>
          <Paper sx={{ width: "100%", height: "100px", borderRadius: "10px" }}>
            <Grid
              container
              direction="row"
              sx={{ width: "100%", height: "100%" }}
            >
              <Grid
                item
                container
                md={1}
                xs={0}
                lg={1}
                xl={1}
                sx={{ height: "100%", display: { xs: "none", md: "flex" } }}
              >
                <Avatar
                  sx={{
                    padding: "10px",
                    bgcolor:
                      resources.status == "running" || resources.status == "Running"
                        ? "#163a3a"
                        : resources.status == "exited" ||
                          resources.status == "created"
                        ? "#34242b"
                        : "",
                    width: 50,
                    height: 50,
                    margin: "auto",
                  }}
                  src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png"
                />
              </Grid>
              <Grid
                container
                item
                xs={8}
                md={2.8}
                xl={3}
                sx={{ height: "100%" }}
                direction="row"
              >
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  {Server().name}
                </Typography>
              </Grid>
              <Grid container item xs={2} md={2} lg={2} xl={2}>
                <Box display="flex" sx={{ margin: "auto" }}>
                  <NetworkIcon
                    sx={{ fontWeight: "bold", mr: 1 }}
                    fontSize="small"
                  />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {Allocation().ip_alias + ":" + Allocation().port}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                container
                item
                xs={0}
                md={5}
                lg={5}
                xl={4}
                sx={{
                  height: "100%",
                  display: { xs: "none", md: "flex" },
                  marginLeft: "auto",
                }}
                direction="row"
              >
                <Box
                  sx={{
                    margin: "auto",
                    display: "flex",
                  }}
                >
                  <CpuIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body1" noWrap>
                    {resources.cpu}%
                  </Typography>
                </Box>
                <Box display="flex" sx={{ margin: "auto" }}>
                  <MemoryIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body1" noWrap>
                    {resources.memory}/
                    {prettyBytes(server.limits.memory * 1048576, {
                      binary: true,
                    })}
                  </Typography>
                </Box>
                <Box display="flex" sx={{ margin: "auto" }}>
                  <DiskIcon fontSize="small" sx={{ mr: 0.2 }} />
                  <Typography variant="body1" noWrap>
                    {resources.disk ? prettyBytes(resources.disk * 1000000): ""}/
                    {prettyBytes(server.limits.disk * 1000000)}
                  </Typography>
                </Box>{" "}
              </Grid>
            </Grid>
          </Paper>
        </CardActionArea>
      </Link>
    </Grid>
  );
}
