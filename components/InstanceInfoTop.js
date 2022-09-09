import { Button, Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { InstanceStore } from "../states/instance";
import StartButton from "./instance/StartButton";
import StateIndicator from "./instance/StateIndicator";
import StopButton from "./instance/StopButton";

export default function InstanceInfoTop() {
    const instanceState = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
        sockets: {
            monitor: InstanceStore.useStoreState((state) => state.sockets.monitor),
        },
        monitor: InstanceStore.useStoreState((state) => state.monitor)
    };
    return (

        <Grid component={Paper} container direction="row" sx={{ p: 2 }}>
            <Grid item xs={12} sm={12} md={5} container direction="row">
                {useMediaQuery(useTheme().breakpoints.up("md")) ?
                    <Grid container xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto", mr: 1.5 }}>
                        <StateIndicator />
                    </Grid> :
                    <Grid container xs={8} sx={{ mr: "auto", ml: "auto" }}>
                        <Box sx={{ mr: "auto", ml: "auto" }}>
                            <Grid container>
                                <Grid container xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto", mr: 1 }}>
                                    <StateIndicator />
                                </Grid>
                                {instanceState.data ?
                                    <Typography align="center" variant="h6" sx={{ mt: "auto", mb: "auto" }}>{instanceState.data.name}</Typography>
                                    : ""}
                            </Grid>
                        </Box>
                    </Grid>}

                {useMediaQuery(useTheme().breakpoints.up("md")) ?

                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>{instanceState.data ? instanceState.data.name : ""}</Typography>
                    : ""}
            </Grid>
            {useMediaQuery(useTheme().breakpoints.up("md")) ? <Grid container item xs={12} sm={12} md={4.5} lg={3} xl={2.5} sx={{ marginLeft: "auto" }}>
                {instanceState.data ?
                    <StartButton instance={instanceState.data.id} />
                    : ""}
                {instanceState.data ?

                    <StopButton instance={instanceState.data.id} />
                    : ""}
                {instanceState.data ?
                    <Button
                        disabled={instanceState.monitor.status ? instanceState.monitor.status != "Running" : true}
                        color="warning"
                        variant="contained"
                        sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
                    >
                        Restart
                    </Button>
                    : ""}
            </Grid> : <Grid container item xs={12} sm={12} md={4.5} lg={3} xl={2.5} sx={{ marginLeft: "auto" }}>
                {instanceState.data ?
                    <>
                        <StartButton center instance={instanceState.data.id} />
                        <StopButton center instance={instanceState.data.id} />
                    </>
                    : ""}
                <Button
                    disabled={instanceState.monitor.status ? instanceState.monitor.status != "Running" : true}
                    color="warning"
                    variant="contained"
                    sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: "auto" }}
                >
                    Restart
                </Button>
            </Grid>}
        </Grid>
    )
}