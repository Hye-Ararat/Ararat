import { Box, Button, Grid, Modal, Typography, TextField, Paper, Chip, Checkbox, Tooltip, Zoom, Dialog, DialogTitle, DialogContent, useMediaQuery } from "@mui/material";
import { Delete as DeleteIcon, History as HistoryIcon } from "@mui/icons-material";
import { useState } from "react";
import Navigation from "../../../components/instance/Navigation"
import { InstanceStore } from "../../../states/instance"
import { useRouter } from "next/router";
import axios, { post } from "axios";
import Footer from "../../../components/footer";
import hyexd from "hyexd";
import prisma from "../../../lib/prisma";
import getNodeEnc from "../../../lib/getNodeEnc";
import prettyBytes from "pretty-bytes";
import {useTheme} from "@mui/material/styles";

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
    const { decode } = require("jsonwebtoken");
    const user_data = decode(req.cookies.authorization)

    const instance = await prisma.instance.findUnique({
        where: {
            id: query.id
        },
        include: {
            node: true
        }
    })
    let snapshots;
    const client = new hyexd("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    })
    snapshots = await client.instance(instance.id).snapshots;
    snapshots = snapshots.metadata;
    return {
        props: { snapshots: snapshots, instanceId: query.id }
    }

}

export default function Snapshots({ snapshots, instanceId }) {
    const [creatingSnapshot, setCreatingSnapshot] = useState(false);
    const [tempSnapshotName, setTempSnapshotName] = useState(null);
    const router = useRouter();
    return (
        <>
            <Dialog open={creatingSnapshot} onClose={() => setCreatingSnapshot(false)}>
                <DialogTitle>Create Snapshot</DialogTitle>
                <DialogContent>
                    <TextField placeholder="Snapshot Name" value={tempSnapshotName} onChange={(e) => setTempSnapshotName(e.target.value)} sx={{ maxWidth: "300px" }} />
                </DialogContent>
                <Button variant="contained" color="success" onClick={async () => {
                    try {
                        await post(`/api/v1/instances/${instanceId}/snapshots`, {
                            name: tempSnapshotName
                        })
                    } catch (error) {
                        console.log(error)
                    }
                    setTempSnapshotName(null);
                    setCreatingSnapshot(false);
                    router.replace(router.asPath);
                }}>Create Snapshot</Button>
            </Dialog>
            <Grid container>
                <Button variant="contained" color="info" sx={{ ml: "auto", mt: "auto", mb: "auto" }} onClick={() => {
                    setCreatingSnapshot(true);
                }}>Create Snapshot</Button>
            </Grid>
            <Grid container direction="row" sx={{ mb: 1, display: { xs: "none", sm: "none", md: "flex" } }}>
                <Grid container xs={.6}>
                    <Checkbox sx={{ mt: "auto", mb: "auto", display: { xs: "none", sm: "none", md: "inherit" } }} />
                </Grid>
                <Grid container xs={3} sm={3} md={2} lg={2} xl={1.5}>
                    <Typography noWrap sx={{ mt: "auto", mb: "auto" }}>Name</Typography>
                </Grid>
                <Grid container xs={2} md={3} xl={3}>
                    <Typography sx={{ mt: "auto", mb: "auto" }}>Created</Typography>
                </Grid>
                <Grid container xs={2} md={1.5} xl={1}>
                    <Typography sx={{ mt: "auto", mb: "auto" }}>Size</Typography>
                </Grid>
            </Grid>
            {snapshots.length == 0 ? <Typography variant="h6">No Snapshots</Typography> : ""}
            {snapshots.map((snapshot) => {
                console.log(snapshot)
                let date = new Date(snapshot.created_at);
                return (
                    <Paper sx={{ mt: 1, pt: 1, pb: 1 }} key={snapshot.name}>
                        <Grid container direction="row">
                            <Grid item container xs={.6}>
                                <Checkbox sx={{ mt: "auto", mb: "auto", display: { xs: "none", sm: "none", md: "block" } }} />
                            </Grid>
                            <Grid container xs={3} sm={3} md={2} lg={2} xl={1.5} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography fontWeight="bold">{snapshot.name}</Typography>
                            </Grid>
                            <Grid container xs={2} md={3} xl={3} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography>{date.toLocaleString()}</Typography>
                            </Grid>
                            <Grid container xs={2} md={1.5} xl={1} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography>{prettyBytes(snapshot.size)}</Typography>
                            </Grid>
                            <Grid container xs={3} md={4} xl={1.8} sx={{ ml: "auto" }} direction="row">
                                <Tooltip title="Delete" TransitionComponent={Zoom}>
                                    <Button sx={{ ml: "auto", mr: 2, mt: "auto", mb: "auto" }} variant="contained" color="error"><DeleteIcon /></Button>
                                </Tooltip>
                                <Tooltip title="Restore" TransitionComponent={Zoom}>
                                    <Button sx={{ mr: 2, mt: "auto", mb: "auto" }} variant="contained" color="warning"><HistoryIcon /></Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}
        </>
    )
}

Snapshots.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="snapshots">
                {page}
                <Footer />
            </Navigation>
        </InstanceStore.Provider>
    )
}