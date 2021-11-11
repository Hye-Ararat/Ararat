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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMicrochip,
	faHardDrive,
	faMemory,
	faEthernet,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes";
import Link from "next/link";

export default function Server({ server }) {
	const fetcher = (url) => axios.get(url).then((res) => res.data);
	const [monitor_data, setMonitorData] = useState({
		status: null,
		usage: {
			cpu: null,
			disk: null,
			memory: null,
		},
	});
	function prefetch() {
		mutate(`/api/v1/client/servers/${server._id}`, server, true);
	}
	useEffect(() => {
		prefetch();
	});
	function Server() {
		const { data } = useSWR(`/api/v1/client/servers/${server._id}`, fetcher);
    console.log(data)
		if (!data) {
			return server;
		}
		return {
			name: data.data.name,
		};
	}
  function MagmaCube() {
    const { data } = useSWR(`/api/v1/client/magma_cubes/${server.magma_cube.cube}`, fetcher);
    if (!data) {
      return; 
    }
    return data.data;
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
			async function monitor() {
				try {
					var token = await axios.get(
						`/api/v1/client/servers/${server._id}/monitor/ws`
					);
				} catch {
					console.log("Error while fetching token data");
				}
				token = token.data.data.access_token;
				// websocket headers

				const ws = new WebSocket(
					`wss://${node_data.data.address.hostname}:${node_data.data.address.port}/api/v1/servers/${server._id}/monitor`
				);
				console.log(
					`wss://${node_data.data.address.hostname}:${node_data.data.address.port}/api/v1/servers/${server._id}/monitor`
				);
				ws.onopen = () => {
					console.log("open");
					ws.send(
						JSON.stringify({
							event: "authenticate",
							data: { monitor_token: token },
						})
					);
				};
				ws.onerror = (error) => {
					console.error(error);
				};
				ws.onmessage = (e) => {
					console.log(JSON.parse(e.data));
					if (e.data != "Unauthorized") {
						setMonitorData(JSON.parse(e.data));
					}
				};
			}
			monitor();
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
											monitor_data.status == "running" ||
											monitor_data.status == "Running"
												? "#163a3a"
												: monitor_data.status == "exited" ||
												  monitor_data.status == "created" ||
												  monitor_data.status === "Stopped"
												? "#34242b"
												: "",
										width: 50,
										height: 50,
										margin: "auto",
									}}
                  src={server.type == "docker" ? "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png" : server.type == "N-VPS" ? "https://upload.wikimedia.org/wikipedia/commons/d/dd/Linux_Containers_logo.svg": server.type == "KVM" ? "https://tuchacloud.com/wp-content/uploads/2016/03/KVM-tucha.png":""}								/>
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
									{Server().name ? Server().name : "Loading"}
								</Typography>
							</Grid>
							<Grid container item xs={2} md={2} lg={2} xl={2}>
								<Box display="flex" sx={{ margin: "auto" }}>
									<FontAwesomeIcon
										icon={faEthernet}
										style={{
											marginRight: 10,
											marginTop: "auto",
											marginBottom: "auto",
										}}
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
									<FontAwesomeIcon
										icon={faMicrochip}
										style={{
											marginRight: 10,
											marginTop: "auto",
											marginBottom: "auto",
										}}
									/>
									<Typography variant="body1" noWrap>
										{monitor_data.usage.cpu != null
											? parseFloat(monitor_data.usage.cpu).toFixed(2) + "%"
											: ""}
									</Typography>
								</Box>
								<Box display="flex" sx={{ margin: "auto" }}>
									<FontAwesomeIcon
										icon={faMemory}
										style={{
											marginRight: 10,
											marginTop: "auto",
											marginBottom: "auto",
										}}
									/>
									<Typography variant="body1" noWrap>
										{monitor_data.usage.memory != null
											? prettyBytes(monitor_data.usage.memory)
											: ""}
										/
										{prettyBytes(server.limits.memory * 1048576, {
											binary: true,
										})}
									</Typography>
								</Box>
								<Box display="flex" sx={{ margin: "auto" }}>
									<FontAwesomeIcon
										icon={faHardDrive}
										style={{
											marginRight: 10,
											marginTop: "auto",
											marginBottom: "auto",
										}}
									/>
									<Typography variant="body1" noWrap>
										{monitor_data.usage.disk
											? prettyBytes(monitor_data.usage.disk)
											: ""}
										/{prettyBytes(server.limits.disk * 1000000)}
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