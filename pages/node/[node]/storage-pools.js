import { Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Navigation from "../../../components/node/navigation";
import SideLayout, { reformatItemList } from "../../../components/sideLayout";
import prisma from "../../../lib/prisma";
import { NodeStore } from "../../../states/node";
import hyexd from "hyexd";
import getNodeEnc from "../../../lib/getNodeEnc";
import { useState } from "react";


export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.authorization) {
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
    storagePools = (await client.storagePools(true)).metadata
    console.log(storagePools)
    return {
        props: {
            node,
            storagePools
        }
    }
}

export default function StoragePools({ node, storagePools }) {
    const router = useRouter();
    const [creatingStoragePool, setCreatingStoragePool] = useState(false);
    const [selectedStoragePool, setSelectedStoragePool] = useState(null)
    return (
        <>
            <Grid container direction="row" sx={{ mb: 2 }}>
                <Grid container xs={4}>
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Storage Pools</Typography>
                </Grid>
                <Grid container xs={4} sm={4} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                    <Button color="success" variant="contained" sx={{ ml: "auto" }} onClick={() => setCreatingStoragePool(true)}>
                        Create Storage Pool
                    </Button>
                </Grid>
            </Grid>
            <SideLayout
                listItems={reformatItemList(storagePools, "name", "name", "driver", "used_by")}
                thirdItemFormatter={(item) => {
                    return (
                        "Used by " + (storagePools.find((pool) => pool.name == item).used_by.length) + " devices"
                    )
                }}
                FarAction={(id) => {
                    return (
                        <Button sx={{ ml: "auto", mt: "auto", mb: "auto" }} variant="contained" color="error">
                            Delete
                        </Button>)
                }}
                FarSection={({ id }) => {
                    return (
                        <Grid container direction="column" xs={6} sx={{ mt: "auto", mb: "auto", ml: "auto" }}>
                            <Typography variant="h6" align="center">{storagePools.find(pool => pool.name == id).config["size"]}</Typography>
                            <Typography align="center">Size</Typography>
                        </Grid>
                    )
                }}
                sections={[
                    {
                        title: "Volumes",
                        action: (item) => {
                            return (
                                <Button
                                    onClick={() => ""}
                                    sx={{ ml: "auto", mt: "auto", mb: "auto" }}
                                    variant="contained"
                                    color="info"
                                >
                                    Create Volume
                                </Button>)
                        },
                        formatter: (item) => {
                            return (
                                <Grid container direction="column">
                                    <Typography fontWeight={500} align="center">
                                        No Volumes
                                    </Typography>
                                    <Button
                                        onClick={() => ""}
                                        sx={{ mr: "auto", ml: "auto", mt: 1 }}
                                        variant="contained"
                                        color="info"
                                    >
                                        Create One
                                    </Button>
                                </Grid>)
                        }
                    }
                ]}
            />
        </>
    )
}

StoragePools.getLayout = (page) => {
    return (
        <NodeStore.Provider>
            <Navigation page="storage-pools">{page}</Navigation>
        </NodeStore.Provider>
    )
}