import {
	Grid,
	CardActionArea,
	Typography,
	Avatar,
	Paper,
	Box,
	Dialog,
	DialogTitle,
	Alert
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

export default function Instance({ instance }) {
	const fetcher = (url) => axios.get(url).then((res) => res.data);
	const [monitor_error, setMonitorError] = useState(false)
	const [monitor_data, setMonitorData] = useState({
		status: null,
		usage: {
			cpu: null,
			disk: null,
			memory: null,
		},
	});
	function prefetch() {
		mutate(`/api/v1/client/instances/${instance._id}`, instance, true);
	}
	useEffect(() => {
		prefetch();
	}, []);
	function Instance() {
		const { data } = useSWR(`/api/v1/client/instances/${instance._id}?include=["magma_cube", "node", "network_container"]`, fetcher);
		if (!data) {
			instance.relationships = {}
			instance.relationships.network_container = {
				address: {
					ip_alias: null
				}
			}
			return instance;
		}
		mutate(`/api/v1/client/nodes/${instance.node}`, data.relationships.node, false)
		instance = data;
		return data;
	}
	useEffect(() => {
		mutate(
			`/api/v1/client/nodes/${instance.node}`,
			axios.get(`/api/v1/client/nodes/${instance.node}`),
			false
		).then((res) => {
			var node_data = res.data;
			async function monitor() {
					var getData = new Promise(async (resolve, reject) => {
						try {
						var getToken = axios.get(
							`/api/v1/client/instances/${instance._id}/monitor/ws`
						);
						var getStats = axios.get(`/api/v1/client/instances/${instance._id}/monitor`)
						} catch {
							reject("An error occured")
						}
						await axios.all([getToken, getStats]).then(axios.spread((...args) => {
							resolve({
								token: args[0].data.data.access_token,
								monitor_data: args[1].data.data
							})
						})).catch(() => {
							reject("An error occured")
							setMonitorError(true);
						})
					})
				try {
				var {token, monitor_data} = await getData;
				} catch {
					var monitor_data = {
						status: null,
						usage: {
							cpu: null,
							disk: null,
							memory: null,
						},
					}
				}
				// websocket headers
				setMonitorData(monitor_data)
				const ws = new WebSocket(
					`wss://${node_data.data.address.hostname}:${node_data.data.address.port}/api/v1/instances/${instance._id}/monitor`
				);
				ws.onopen = () => {
					ws.send(
						JSON.stringify({
							event: "authenticate",
							data: { monitor_token: token },
						})
					);
				};
				ws.onerror = (error) => {
					console.error(error);
					setMonitorError(true)
				};
				ws.onmessage = (e) => {
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
			<Link href={`/instance/${instance._id}`}>
				<CardActionArea sx={{ borderRadius: "10px" }}>
					<Paper sx={{ width: "100%", height: "100px", borderRadius: "10px" }}>
					{monitor_error ? <Alert severity="error" sx={{width: "100%", position: "absolute", height: "40%", opacity: 0.5}}>
				An error occured while connecting to this instance.
			</Alert> : ""}
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
                  src={ Instance().relationships.magma_cube != undefined ? Instance().relationships.magma_cube.type == "n-vps" ? "https://upload.wikimedia.org/wikipedia/commons/d/dd/Linux_Containers_logo.svg": Instance().relationships.magma_cube.type == "kvm" ? "https://tuchacloud.com/wp-content/uploads/2016/03/KVM-tucha.png":"" : ""}								/>
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
									{Instance().name ? Instance().name : "Loading"}
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
										{instance.relationships ? instance.relationships.network_container.address.ip_alias : ""}{instance.primary_port ? ":" + instance.primary_port : ""}
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
										{prettyBytes(instance.limits.memory * 1048576, {
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
										/{prettyBytes(instance.limits.disk * 1000000)}
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