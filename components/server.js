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
} from "@mui/material";
import useSWR, { SWRConfig } from "swr";
import axios from "axios"
import {
    PeopleAlt,
    SettingsEthernet as AddressIcon, SettingsEthernet,
} from "@mui/icons-material";
import {useEffect, useState} from "react"

export default function Server({ server }) {
	const [resources, setResources] = useState({
		cpu: null,
		disk: null,
		memory: null,
		status: null,
	})
	useEffect(() => {
		console.log("E")
		async function resources() {
			console.log("L")
			const ws = new WebSocket(`wss://${server.node_data[0].address.hostname}:${server.node_data[0].address.port}/api/v1/server/${server._id}/resources`)
			console.log(`wss://${server.node_data[0].address.hostname}:${server.node_data[0].address.port}/api/v1/server/${server._id}/resources`)
			ws.onopen = () => {
				//console.log('Connected to websocket for ' + server.name)
			}
			ws.onerror = (error) => {
				console.error(error)
			}
			ws.onmessage = (e) => {
				setResources(JSON.parse(e.data))
			}
		}
		resources();
	}, [])
	return (
		<Grid item>
			<Card sx={{ width: 500 }}>
				<CardActionArea component={Link} to={`/server/e`}>
					<CardContent
						style={{
							height: "350px",
							padding: "0px",
							background:
								"url(https://cdn.thenewstack.io/media/2020/08/edd38e1d-thing.png)",
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
										<Chip
											sx={{ mr: "auto", mt: "auto" }}
											color="success"
											label={resources.status}
											size="medium"
										/>
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
										><SettingsEthernet /></Avatar>
										<Chip
											sx={{ mb: 2, mr: "auto", ml: "auto", mt: 2 }}
											color="info"
											size="medium"
											label={server.allocation_data[0].ip_alias + ":" + server.allocation_data[0].port}
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

										><PeopleAlt /></Avatar>
										<Chip
											sx={{ mb: 2, mr: "auto", ml: "auto", mt: 2 }}
											color="info"
											size="large"
											label="1.1.1.1"
										/>
									</Grid>
								</Grid>
								<CardContent>
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
											Memory: {resources.memory}GiB/8GiB
										</Typography>
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											Disk: {resources.disk}/32GB
										</Typography>
									</Grid>
								</CardContent>
							</div>
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
	);
}
