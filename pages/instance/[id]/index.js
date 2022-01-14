import { useRouter } from "next/router";
import { Grid, Paper, Typography, Chip, Button } from "@mui/material";
import useSWR from "swr";
import {InstanceStore} from "../../../states/instance";
import axios from "axios";
import dynamic from "next/dynamic"
import { useEffect } from "react";
import StartButton from "../../../components/instance/StartButton";
import StopButton from "../../../components/instance/StopButton";
import Navigation from "../../../components/instance/Navigation";
import StateIndicator from "../../../components/instance/StateIndicator";
const Terminal = dynamic(() => import('../../../components/instances/terminal'), {
    ssr: false
})

export default function Instance({ data }) {
    const router = useRouter();
    const { id } = router.query;
    console.log(id)
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const instance = {
        data: InstanceStore.useStoreState(state => state.data),
        setData: InstanceStore.useStoreActions(state => state.setData),
        containerState: InstanceStore.useStoreState(state => state.containerState),
        sockets: {
            monitor: InstanceStore.useStoreState(state => state.sockets.monitor),
            setMonitor: InstanceStore.useStoreActions(state => state.sockets.setMonitor)
        }
    }

    var {data: instanceData} = useSWR(`/api/v1/client/instances/${id}?include=["magma_cube", "node", "network"]`, fetcher)
    
    useEffect(() => {
        if (instance.data) {
            console.log("exists")
            console.log(instance.data)
        } else {
            console.log("doesnt")
            instance.setData(instanceData)
        }
    }, [instance.data, instanceData])
    useEffect(() => {
        if (instance.data) {
            console.log("yes")
            console.log("yes2")
            if (instance.sockets.monitor) {
                instance.sockets.monitor.onopen = () => {
                    axios.get("/api/v1/client/instances/" + instance.data._id + "/monitor/ws").then((res) => {
                        instance.sockets.monitor.send((res.data.data.access_token))
                    })
                }
            } else {
                instance.sockets.setMonitor(new WebSocket(`${instance.data.relationships.node.address.ssl ? "wss" : "ws"}://${instance.data.relationships.node.address.hostname}:${instance.data.relationships.node.address.port}/api/v1/instances/${instance.data._id}/monitor`));
            }
        } else {
            console.log("no")
        }
    }, [instance.data, instance.sockets.monitor])

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css" integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
            <Paper>
                <Grid container direction="row" sx={{ p: 2 }}>
                    <Grid item xs={2}>
                        <Typography variant="h6">{instance.data ? instance.data.name : ""}</Typography>
                    </Grid>
                    <Grid container item xs={8} md={5} lg={3.7} xl={3} sx={{ marginLeft: "auto" }}>
                        <StartButton instance={id} />
                        <StopButton instance={id} />
                        <Button color="warning" variant="contained" sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}>Restart</Button>
                        <StateIndicator />
                    </Grid>
                </Grid>
            </Paper>
            <Grid container xs={12} sx={{ mt: 2 }}>
                <Grid item xs={3} />
                <Grid item xs={6}>
                    {instance ? console.log("asldkfj;lsdkfj") : ""}
                    {instance.containerState ?
                        <Terminal status={instance.containerState} instance={instance.data} instanceId={id} />
                        : ""}
                </Grid>
                <Grid item xs={3} />
            </Grid>
        </>
    );
}

Instance.getLayout = function getLayout(page) {
    return(
        <InstanceStore.Provider>
            <Navigation>
                {page}
            </Navigation>
        </InstanceStore.Provider>
    )
}
