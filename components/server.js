import {
	Grid,
	Fade,
	Card,
	CardActionArea,
	CardContent,
	BackdropFilter,
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

export default function Server({ server }) {
     function Allocation() {
        const fetcher = url => axios.get(url).then(res => res.data)
        const { data } = useSWR(`/api/v1/client/allocations/${server.allocations.main}`, fetcher)
        if (!data) return <Skeleton width={120} height={20}/>
        return data.data.ip_alias + ":" + data.data.port
        }
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
											label="Online"
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
											CPU Usage: 22.5%
										</Typography>
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											Memory: 2.2GiB/8GiB
										</Typography>
										<Typography
											noWrap
											variant="body2"
											style={{ fontWeight: "bold", margin: "auto" }}
										>
											Disk: 1.5GB/32GB
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
