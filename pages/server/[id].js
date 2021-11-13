import { useRouter } from "next/router";
import Navigation from "../../components/server/Navigation";
import { Grid, Paper, Typography, Chip, Button } from "@mui/material";
import useSWR from "swr";
import axios from "axios";

export default function Server({ data }) {
    const router = useRouter();
    const { id } = router.query;
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    function Server() {
        const {data} = useSWR(`/api/v1/client/servers/${id}`, fetcher)
        console.log(data)
        if (!data) {
            return {
                name: "Loading..."
            }
        }
        return {
            name: data.data.name
        }
    }
	return (
		<Navigation server={id}>
            <Paper>
                <Grid container direction="row" sx={{p: 2}}>
                    <Grid item xs={2}>
                        <Typography variant="h6">{Server().name}</Typography>
                    </Grid>
                    <Grid container item xs={8} md={5} lg={3.7} xl={3} sx={{marginLeft: "auto"}}>
                        <Button color="success" variant="contained" sx={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}}>Start</Button>
                        <Button color="error" variant="contained" sx={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}}>Stop</Button>
                        <Button color="warning" variant="contained" sx={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}}>Restart</Button>
                        <Chip sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}} size="small" label="Online" color="success" />
                    </Grid>
                </Grid>
            </Paper>
		</Navigation>
	);
}
