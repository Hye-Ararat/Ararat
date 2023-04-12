import { useRouter } from "next/router";
import { Grid, Paper, Typography, Chip, Button, useMediaQuery, Container, IconButton, Tooltip } from "@mui/material";
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
import InstanceInfoTop from "../../../components/InstanceInfoTop";
import { Edit } from "@mui/icons-material";
import getInstance from "../../../scripts/api/v1/instances/[id]/instance";




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
    /*var { data: instanceData } = useSWR(
        `/api/v1/instances/${id}`,
        fetcher
    );*/
   const [instanceData, setInstanceData] = useState(null);

    useEffect(() => {
        async function run(){
        if (id && !instanceState.data) {
                console.log("BABOOM")
                console.log(instanceData)
                let data = await getInstance(id)
                instanceState.setData(data);
                setInstanceData(data)
            
        }
    }
    run()
    }, [instance, id]);
    useEffect(() => {
        console.log("BOOM");
        console.log(instanceState.data)
    }, [instanceState.data])
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        if (router.query.edit) {
            if (router.query.edit === "true") setEditMode(true);
            else setEditMode(false);
        }
    }, [router.query.edit])
    return (
        <>
            <InstanceInfoTop />
            <div style={{ marginTop: 10 }}>
                {true ?
                    <WidgetsArea editMode={editMode} areas={instance_user.widgetGrids} type="instance" resourceId={instance.id} resourceData={instanceData} userId={instance_user.id} />
                    :
                    ""
                }
            </div>
            <Grid container>
                <Tooltip title="Edit Layout">
                    <IconButton onClick={() => {
                        router.replace(`/instance/${instance.id}?edit=${!editMode}`)
                    }} sx={{ ml: "auto" }} size="small">
                        <Edit />
                    </IconButton>
                </Tooltip>
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
