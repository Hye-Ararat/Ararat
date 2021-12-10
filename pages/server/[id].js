import { useRouter } from "next/router";
import Navigation from "../../components/server/Navigation";
import { Grid, Paper, Typography, Chip, Button, Fade} from "@mui/material";
import useSWR from "swr";
import axios from "axios";
import dynamic from "next/dynamic"
const Terminal = dynamic(() => import('../../components/servers/terminal'), {
    ssr: false
})

export default function Server({ data }) {
    const router = useRouter();
    const { id } = router.query;
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    function Server() {
        const {data} = useSWR(`/api/v1/client/servers/${id}?include=["magma_cube", "node", "allocations"]`, fetcher)
        console.log(data)
        if (!data) {
            return {
                name: null,
                id: id,
                relationships: {
                    node: null,
                    magma_cube: null,
                },
            }
        }
        return {
            name: data.name,
            id: id,
            relationships: {
                node: data.relationships.node,
                magma_cube: data.relationships.magma_cube,
            }
        }
    }
    
	return (
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css" integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
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
            <Grid container xs={12}>
            <Terminal server={Server()} />
            </Grid>
		</Navigation>
        </>
	);
}
