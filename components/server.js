import {
  Grid,
  Fade,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Avatar,
  Link,
  Paper,
  Box,
  Badge,
} from "@mui/material";
import useSWR, { SWRConfig } from "swr";
import axios from "axios";
import {
  PeopleAlt,
  SettingsEthernet as AddressIcon,
  SettingsEthernet,
  ShowChart as CpuIcon,
  Memory as MemoryIcon,
  Save as DiskIcon
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes";

export default function Server({ server }) {
  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const [resources, setResources] = useState({
    cpu: null,
    disk: null,
    memory: null,
    status: null,
  });

  const [node_data, setNodeData] = useState({
	  address: {
		  hostname: null,
		  port: null
	  }
  })
  function Allocation() {
    const { data } = useSWR(
      `/api/v1/client/allocations/${server.allocations.main}`,
      fetcher
    );
    if (!data) {
      return {
        ip_alias: "Loading",
      };
    }
    return {
      ip_alias: data.data.ip_alias,
    };
  }
  function Node() {
    const { data } = useSWR(
      `/api/v1/client/nodes/${server.node}`,
      fetcher
    );
    if (!data) {
      return {
        address: {
			hostname: "Loading",
			port: "loading"
		}
      };
    }
	var node_data = {
		address: {
			hostname: data.data.address.hostname,
			port: data.data.address.port
		}
	}
	setNodeData(node_data)
    return node_data;
  }
  useEffect(() => {
	  if (node_data.address.hostname) {
    async function resources() {
      const ws = new WebSocket(
        `wss://${node_data.address.hostname}:${
          node_data.address.port
        }/api/v1/server/${server._id}/resources`
      );
      console.log(
        `wss://${node_data.address.hostname}:${
          node_data.address.port
        }/api/v1/server/${server._id}/resources`
      );
      ws.onopen = () => {
        //console.log('Connected to websocket for ' + server.name)
      };
      ws.onerror = (error) => {
        console.error(error);
      };
      ws.onmessage = (e) => {
        setResources(JSON.parse(e.data));
      };
    }
    resources();
}
  }, [node_data]);
  return (
    <Grid container item md={12} xs={12} direction="row">
      <Paper sx={{ width: "100%", height: "100px", borderRadius: "10px" }}>
        <Grid container direction="row" sx={{ width: "100%", height: "100%" }}>
          <Grid item container md={1} xs={0} lg={1} xl={.5} sx={{ height: "100%", display: {xs: "none", md: "flex"} }}>
            <Avatar
              sx={{ bgcolor: "#101924", width: 50, height: 50, margin: "auto" }}
              src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png"
            />
          </Grid>
          <Grid
            container
            item
			xs={8}
            md={3}
            sx={{ height: "100%" }}
            direction="row"
          >
            <Box
              sx={{
                borderRadius: "50%",
                backgroundColor: "green",
                width: 10,
                height: 10,
                marginTop: "auto",
                marginBottom: "auto",
                marginRight: 1,
              }}
            />
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
              {server.name}
            </Typography>
          </Grid>
          <Grid
            container
            item
			xs={0}
            md={4}
			lg={5}
			xl={2}
            sx={{ height: "100%", marginLeft: "30%", display: {xs: "none", md: "flex"} }}
            direction="row"
          >
            <Box                sx={{ marginTop: "auto", marginBottom: "auto", marginRight: 1, display: "flex"}}>
				<CpuIcon fontSize="small"/>
              <Typography
                variant="body1"
                noWrap
              >
                100{resources.cpu}%
              </Typography>
            </Box>
            <Box     display="flex"            sx={{ marginTop: "auto", marginBottom: "auto", marginRight: 1 }}
>

			  <MemoryIcon fontSize="small" sx={{mr: 1}} />
              <Typography
                variant="body1"
                noWrap
              >
                3{resources.memory}GiB/{prettyBytes(server.limits.memory * 1048576, {binary: true})}
              </Typography>
            </Box>
            <Box display="flex"             sx={{ marginTop: "auto", marginBottom: "auto"}}
>
	<DiskIcon fontSize="small" sx={{mr: .2}} /> 
              <Typography
                variant="body1"
                noWrap
              >
                2GB{resources.cpu}/{prettyBytes(server.limits.disk * 1000000)}
              </Typography>
            </Box>{" "}
          </Grid>
        </Grid>
      </Paper>

      {/*
			<Card sx={{ width: 500 }}>
				<CardActionArea component={Link} to={`/server/e`}>
					<CardContent
						style={{
							height: "400px",
							padding: "0px",
							background:
								server.magma_cube_data[0].type == "N-VPS"
									? "url(https://cdn.thenewstack.io/media/2020/08/edd38e1d-thing.png)"
									: server.magma_cube_data[0].type == "KVM"
									? "url(/images/kvm.png)"
									: server.magma_cube_data[0].type &&
									  server.magma_cube_data[0].enhancements.includes(
											"minecraft_spigot"
									  )
									? "url(/images/minecraft.png)"
									: server.magma_cube_data[0].type == "docker"
									? "url(https://www.cloudsavvyit.com/p/uploads/2021/01/6dc7b5a0.jpeg?height=200p&trim=2,2,2,2&crop=16:9)"
									: "",
							overflow: "hidden",
							backgroundSize: "cover",
							backdropFilter: "blur(10px)",
							backgroundBlendMode: "luminosity",
							backgroundPosition: "center",
							WebkitBackdropFilter: "blur(8px)",
							backdropFilter: "blur(8px)",
							backdropRepeat: "no-repeat",
						}}
					>
						<div
							style={{
								width: "100%",
								height: "100%",
								backdropFilter: "blur(8px) brightness(80%)",
								WebkitBackdropFilter: "blur(8px) brightness(80%)",
							}}
						>
							<div style={{ padding: "16px" }}>
								<Grid container justifyContent="center">
									<img
										height="45"
										style={{ marginBottom: 3 }}
										src="https://cdn-icons-png.flaticon.com/512/888/888879.png"
									/>
								</Grid>
								<Grid container justifyContent="center">
									<Typography variant="h4" align="center">
										{server.name}
									</Typography>
								</Grid>
								<Grid container justifyContent="center">
									<Typography align="center" m={1}>
										{resources.status == "created" ||
										resources.status == "running" ? (
											<Chip
												sx={{ mr: "auto", mt: "auto" }}
												color="success"
												label="Online"
												size="medium"
											/>
										) : (
											<Chip
												sx={{ mr: "auto", mt: "auto" }}
												color="error"
												label="Offline"
												size="medium"
											/>
										)}
									</Typography>
								</Grid>
								<Grid container direction="row" justifyContent={"center"}>
									<Grid
										container
										justifyContent={"center"}
										direction="column"
										sx={{
											border: "1px",
											borderRadius: 1,
											width: 190,
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
											<SettingsEthernet />
										</Avatar>
										<Chip
											sx={{ mb: 2, mr: "auto", ml: "auto", mt: 2 }}
											color="info"
											size="medium"
											label={
												server.allocation_data[0].ip_alias +
												":" +
												server.allocation_data[0].port
											}
										/>
									</Grid>
									<Grid
										container
										justifyContent={"center"}
										direction="column"
										sx={{
											border: "1px",
											borderRadius: 1,
											width: 190,
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
											<PeopleAlt />
										</Avatar>
										<Chip
											sx={{ mb: 2, mr: "auto", ml: "auto", mt: 2 }}
											color="info"
											size="large"
											label={
												server.magma_cube_data[0].type == "N-VPS"
													? "NETWORK"
													: ""
											}
										/>
									</Grid>
								</Grid>
								<CardContent sx={{ mt: 4 }}>
									<Grid container direction="column">
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											CPU Usage: {resources.cpu}%
										</Typography>
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											Memory: {resources.memory}GiB/{server.limits.memory}GiB
										</Typography>
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											Disk: {resources.disk}/{server.limits.disk}GB
										</Typography>
									</Grid>
								</CardContent>
							</div>
						</div>
					</CardContent>
				</CardActionArea>
										</Card> */}
    </Grid>
  );
}
