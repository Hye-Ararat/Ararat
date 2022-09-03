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
export default function ConsolePage({ instance, instance_user }) {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const instanceState = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
        containerState: InstanceStore.useStoreState((state) => state.containerState),
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



    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>Console</Typography>
            {instanceState.data ?
                <div style={{ height: "70vh" }}>
                    <Console />
                </div>
                : ""}
        </>
    );
}

ConsolePage.getLayout = function getLayout(page) {
    return (
        <InstanceStore.Provider>
            <Navigation page="console">{page}<Footer /></Navigation>
        </InstanceStore.Provider>
    );
};
