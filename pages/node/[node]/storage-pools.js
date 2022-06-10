import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Navigation from "../../../components/node/navigation";
import SideLayout from "../../../components/sideLayout";
import prisma from "../../../lib/prisma";
import { NodeStore } from "../../../states/node";
import hyexd from "hyexd";
import getNodeEnc from "../../../lib/getNodeEnc";


export async function getServerSideProps({req, res, query}) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    const node = await prisma.node.findUnique({
        where: {
            id: query.node
        }
    })
    let storagePools;
    const client = new hyexd("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii"),
    })
    storagePools = (await client.storagePools())
    console.log(storagePools)
    return {
        props: {
            node,
        }
    }
}

export default function StoragePools({ node }) {
    const router = useRouter();
    return (
        <Grid container direction="row" sx={{ mb: 2 }}>
            <Grid container xs={4}>
                <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Storage Pools</Typography>
            </Grid>
        </Grid>
    )
}

StoragePools.getLayout = (page) => {
    return (
        <NodeStore.Provider>
            <Navigation page="storage-pools">{page}</Navigation>
        </NodeStore.Provider>
    )
}