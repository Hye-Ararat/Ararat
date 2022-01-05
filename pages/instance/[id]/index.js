import { useRouter } from "next/router";
import Navigation from "../../../components/instance/Navigation";
import { Grid, Paper, Typography, Chip, Button, Fade, Container} from "@mui/material";
import useSWR from "swr";
import axios from "axios";
import dynamic from "next/dynamic"
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import StartButton from "../../../components/instance/StartButton";
import StopButton from "../../../components/instance/StopButton";
const Terminal = dynamic(() => import('../../../components/instances/terminal'), {
    ssr: false
})

export default function Instance({ data }) {
    const router = useRouter();
    const { id } = router.query;
    console.log(id)
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const [status, setStatus] = useState(null);
    const [state, setState] = useState(null);
    var {data: instanceData} = useSWR(() => `/api/v1/client/instances/${id}?include=["magma_cube", "node", "network_container"]`, fetcher)
    var {data: monitorAuth} = useSWR(`/api/v1/client/instances/${id}/monitor/ws`, fetcher)
    useEffect(() => {
        if (instanceData) {
            console.log("yes")
        if (monitorAuth) {
            console.log("yes2")
        var socket = new WebSocket(`${instanceData.relationships.node.address.ssl ? "wss" : "ws"}://${instanceData.relationships.node.address.hostname}:${instanceData.relationships.node.address.port}/api/v1/instances/${id}/monitor`);
        socket.onopen = () => {
                socket.send("eeeeruqweiruqieworuqweiruqweuro")
        }
        socket.onmessage = (data) => {
            console.log(JSON.parse(JSON.stringify(data.data)))
            var e = JSON.parse(data.data)
            console.log(e.state)
            setStatus(e.state)
            setState(e.containerState)
        }
        return() => {
            socket.close();
            instanceData = null;
        }
    } else {
        console.log('no2')
    }
} else {
    console.log("no")
}
    }, [monitorAuth, instanceData])
    
	return (
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css" integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
            <Paper>
                <Grid container direction="row" sx={{p: 2}}>
                    <Grid item xs={2}>
                        <Typography variant="h6">{instanceData ? instanceData.name : ""}</Typography>
                    </Grid>
                    <Grid container item xs={8} md={5} lg={3.7} xl={3} sx={{marginLeft: "auto"}}>
                        <StartButton instance={id} />
                        <StopButton instance={id} />
                        <Button color="warning" variant="contained" sx={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}}>Restart</Button>
                        <Chip sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}} size="small" label={status} color={status == "Online" ? "success" : status == "Starting" ? "warning" : status == "Stopping" ? "warning" : "error"} />
                    </Grid>
                </Grid>
            </Paper>
            <Grid container xs={12} sx={{mt: 2}}>
                <Grid item xs={3} />
                <Grid item xs={6}>
                    {instanceData ? console.log("asldkfj;lsdkfj") : ""}
                {instanceData ?
                <Terminal status={state} instance={instanceData} instanceId={id} />
                : ""}
                </Grid>
                <Grid item xs={3} />
            </Grid>
        </>
	);
}
