import { useRouter } from "next/router";
import { Grid, Paper, Typography, Chip, Button, useMediaQuery, useTheme, Container } from "@mui/material";
import useSWR from "swr";
import { InstanceStore } from "../../../states/instance";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import StartButton from "../../../components/instance/StartButton";
import StopButton from "../../../components/instance/StopButton";
import Navigation from "../../../components/instance/Navigation";
import StateIndicator from "../../../components/instance/StateIndicator";
import decodeToken from "../../../lib/decodeToken";
import prisma from "../../../lib/prisma";
import Footer from "../../../components/footer";
import { Box } from "@mui/system";
import { WidgetsArea } from "../../../components/widgets";





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
    /*const instance = await prisma.instance.findUnique({
        where: {
            id: query.id,
        },
        select: {
            id: true,
            name: true,
            node: true,
            nodeId: true,
            users: {
                select: {
                    id: true,
                    instance: true,
                    instanceId: true,
                    permissions: true,
                    user: true,
                    userId: true,
                    widgetGrids: {
                        select: {
                            direction: true,
                            id: true,
                            instanceUser: true,
                            instanceUserId: true,
                            size: true,
                            index: true,
                            widgets: {
                                select: {
                                    id: true,
                                    widget: true,
                                    widgetGrid: true,
                                    widgetGridId: true,
                                    index: true,
                                    size: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })*/
    const instance = await prisma.instance.findUnique({
        where: {
            id: query.id
        },
        include: {
            users: {
                include: {
                    widgetGrids: {
                        include: {
                            widgets: true
                        }
                    },
                    user: true,
                    permissions: true
                }
            },
            node: true
        }
    })
    if (instance.users.some(user => user.userId === user_data.id)) {
        let instance_user = instance.users.find(user => user.userId === user_data.id)
        return { props: { instance, user_data, instance_user } }
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }
}
export default function Instance({ instance, instance_user }) {
    const router = useRouter();
    const { id } = router.query;
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const instanceState = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
   /*      sockets: {
            monitor: InstanceStore.useStoreState((state) => state.sockets.monitor),
            setMonitor: InstanceStore.useStoreActions((state) => state.sockets.setMonitor)
        }, */
/*         monitor: InstanceStore.useStoreState((state) => state.monitor)
 */    };
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

    return (
        <>
            {/*             <Paper sx={{ mb: 1 }}>
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
            </Paper> */}
            <div>
                {true ?
                    <WidgetsArea editMode={true} areas={instance_user.widgetGrids} type="instance" resourceId={instance.id} resourceData={instanceData} userId={instance_user.id} />
                    :
                    ""
                }
            </div>

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
