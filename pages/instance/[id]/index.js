import { useRouter } from "next/router";
import { Grid, Paper, Typography, Chip, Button, useMediaQuery, useTheme } from "@mui/material";
import useSWR from "swr";
import { InstanceStore } from "../../../states/instance";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import StartButton from "../../../components/instance/StartButton";
import StopButton from "../../../components/instance/StopButton";
import Navigation from "../../../components/instance/Navigation";
import StateIndicator from "../../../components/instance/StateIndicator";
import decodeToken from "../../../lib/decodeToken";
import prisma from "../../../lib/prisma";
import Footer from "../../../components/footer";
import { Box } from "@mui/system";
const ResourceCharts = dynamic(() => import("../../../components/instance/ResourceCharts"), {
    ssr: false
});
const Console = dynamic(() => import("../../../components/instance/Console"), {
    ssr: false
});

export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        }
    }
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );

    const user_data = decodeToken(req.cookies.access_token);
    const instance = await prisma.instance.findUnique({
        where: {
            id: query.id,
        },
        include: {
            users: true
        }
    })
    if (instance.users.some(user => user.userId === user_data.id)) {
        return { props: { instance } }
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }
}
export default function Instance({ instance }) {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const instanceState = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
        containerState: InstanceStore.useStoreState((state) => state.containerState),
        sockets: {
            monitor: InstanceStore.useStoreState((state) => state.sockets.monitor),
            setMonitor: InstanceStore.useStoreActions((state) => state.sockets.setMonitor)
        },
        monitor: InstanceStore.useStoreState((state) => state.monitor)
    };

    var { data: instanceData } = useSWR(
        `/api/v1/instances/${id}`,
        fetcher
    );

    useEffect(() => {
        if (id && !instanceState.data) {
            if (instanceData) {
                console.log(instanceData)
                instanceState.setData(instanceData.metadata);
            }
        }
    }, [instance, instanceData, id]);

    useEffect(() => {
        console.log(instanceState.data)
        if (instanceState.data) {
            if (!instanceState.sockets.monitor) {
                instanceState.sockets.setMonitor(
                    new WebSocket(
                        `${"ws"}://${instanceState.data.node.address}:${instanceState.data.node.port}/v1/instances/${instanceState.data.id}/state`
                    )
                );
            }
        }
    }, [instanceState.data, instanceState.sockets.monitor]);

    return (
        <>
            <Paper>
                <Grid container direction="row" sx={{ p: 2 }}>
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
                                        <Typography align="center" variant="h6" sx={{ mt: "auto", mb: "auto" }}>{instance.name}</Typography>
                                    </Grid>
                                </Box>
                            </Grid>}

                        {useMediaQuery(useTheme().breakpoints.up("md")) ?

                            <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>{instance.name}</Typography>
                            : ""}
                    </Grid>
                    {useMediaQuery(useTheme().breakpoints.up("md")) ? <Grid container item xs={12} sm={12} md={4.5} lg={3} xl={2.5} sx={{ marginLeft: "auto" }}>
                        <StartButton instance={id} />
                        <StopButton instance={id} />
                        <Button
                            disabled={instanceState.monitor.status ? instanceState.monitor.status != "Running" : true}
                            color="warning"
                            variant="contained"
                            sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
                        >
                            Restart
                        </Button>
                    </Grid> : <Grid container item xs={12} sm={12} md={4.5} lg={3} xl={2.5} sx={{ marginLeft: "auto" }}>
                        <StartButton center instance={id} />
                        <StopButton center instance={id} />
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
            </Paper>
            <Grid container xs={12} sx={{ mt: 2 }}>
                <Grid item xs={12} sx={{ minHeight: "400px" }} container>
                    {instanceState.data && instanceState.monitor ?
                        <Console />
                        :
                        ""
                    }
                </Grid>
            </Grid>
            <Grid container xs={12}>
                {instanceState.monitor.status ?
                    <ResourceCharts />
                    : ""}
            </Grid>
        </>
    );
}

Instance.getLayout = function getLayout(page) {
    return (
        <InstanceStore.Provider>
            <Navigation>{page}<Footer /></Navigation>
        </InstanceStore.Provider>
    );
};
