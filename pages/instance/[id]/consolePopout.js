import { useRouter } from "next/router";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
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
    if (!req.cookies.authorization) {
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

    const user_data = decodeToken(req.cookies.authorization);
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
            {instanceState.data ?
                <div style={{ height: "100vh" }}>
                    <Console />
                </div>
                : <Skeleton variant="rectangular" height="100vh" width="100%" />}
        </>
    );
}

ConsolePage.getLayout = function getLayout(page) {
    return (
        <InstanceStore.Provider>
            {page}
        </InstanceStore.Provider>
    );
};
