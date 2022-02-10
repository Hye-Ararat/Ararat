import { Box, Button, Grid, Modal, Typography, TextField, Paper, Chip } from "@mui/material";
import { Delete as DeleteIcon, History as HistoryIcon } from "@mui/icons-material";
import { useState } from "react";
import Navigation from "../../../components/instance/Navigation"
import { InstanceStore } from "../../../states/instance"
import { useRouter } from "next/router";
import axios, { post } from "axios";

export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    const { connectToDatabase } = require("../../../util/mongodb")
    const { db } = await connectToDatabase();
    const { decode } = require("jsonwebtoken");
    const { ObjectId } = require("mongodb");
    const user_data = decode(req.cookies.access_token)

    let snapshots;

    try {
        snapshots = await db.collection("snapshots").find({
            instance: query.id
        }).toArray();
    } catch (error) {
        snapshots = [];
    }

    return {
        props: { snapshots: JSON.parse(JSON.stringify(snapshots)), instanceId: query.id }
    }

}

export default function Snapshots({ snapshots, instanceId }) {
    const [creatingSnapshot, setCreatingSnapshot] = useState(false);
    const [tempSnapshotName, setTempSnapshotName] = useState(null);
    const router = useRouter();
    return (
        <>
            <Grid container direction="row" sx={{ mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: "auto", mb: "auto" }}>Snapshots</Typography>
                <Button variant="contained" color="primary" sx={{ ml: "auto", mt: "auto", mb: "auto" }} onClick={() => {
                    setCreatingSnapshot(true);
                }}>Create Snapshot</Button>
            </Grid>
            <Modal open={creatingSnapshot} onClose={() => setCreatingSnapshot(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50%",
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6">Create Snapshot</Typography>
                    <Grid container direction="column">
                        <TextField placeholder="Snapshot Name" value={tempSnapshotName} onChange={(e) => setTempSnapshotName(e.target.value)} sx={{ maxWidth: "300px" }} />
                        <Button variant="contained" sx={{ ml: "auto" }} color="success" onClick={async () => {
                            try {
                                await post(`/api/v1/client/instances/${instanceId}/snapshots`, {
                                    name: tempSnapshotName
                                })
                            } catch (error) {
                                console.log(error)
                            }
                            setTempSnapshotName(null);
                            setCreatingSnapshot(false);
                            router.replace(router.asPath);
                        }}>Create</Button>
                    </Grid>
                </Box>
            </Modal>
            {snapshots.length == 0 ? <Typography variant="h6">No Snapshots</Typography> : ""}
            {snapshots.map((snapshot) => {
                let date = new Date(snapshot.created_at);
                return (
                    <>
                        <Grid container item md={12} xs={12} direction="row" sx={{ mb: 2 }}>
                            <Paper sx={{ width: "100%", borderRadius: "10px", height: "100%", p: "10px" }}>
                                <Grid container xs={12} sx={{ height: "100%", width: "100%" }}>

                                    <Grid item xs={3} container sx={{ height: "100%", width: "100%" }} direction="row">
                                        <Typography variant="h6" sx={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto" }}>{snapshot.name}</Typography>
                                    </Grid>
                                    <Grid xs={3} item container sx={{ height: "100%", width: "100%", marginTop: "auto", marginBottom: "auto" }}>
                                        <Typography variant="body2" style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "auto" }}>{`${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}</Typography>
                                    </Grid>
                                    <Grid item xs={1.5} container sx={{ height: "100%", width: "100%", marginLeft: "auto" }}>
                                        <Button variant="contained" color="error" sx={{ marginLeft: "auto" }} onClick={async () => {
                                            console.log("ad;fkjas;dlkfj")
                                            try {
                                                await axios.delete(`/api/v1/client/instances/${instanceId}/snapshots/${snapshot._id}`)
                                            } catch (error) {
                                                console.log(error);
                                            }
                                            router.replace(router.asPath)
                                        }}><DeleteIcon /></Button>
                                        <Button variant="contained" color="info" sx={{ marginLeft: "auto" }} onClick={async () => {
                                            try {
                                                await axios.post(`/api/v1/client/instances/${instanceId}/snapshots/${snapshot._id}/restore`)
                                            } catch (error) {
                                                console.log(error);
                                            }
                                            window.location.reload();
                                        }}><HistoryIcon /></Button>
                                    </Grid>
                                </Grid>

                            </Paper>
                        </Grid >
                    </>
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
            </Navigation>
        </InstanceStore.Provider>
    )
}