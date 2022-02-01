import Navigation from "../../../components/instance/Navigation";
import { InstanceStore } from "../../../states/instance";
import { Typography, Grid, Paper, Button, Modal, Box, TextField, Chip } from "@mui/material";
import { Download, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { post } from "axios";
import { useRouter } from "next/router";

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
    var { connectToDatabase } = require("../../../util/mongodb")
    var { db } = await connectToDatabase();
    var { decode } = require("jsonwebtoken");
    var { ObjectId } = require("mongodb");
    var user_data = decode(req.cookies.access_token)
    console.log(query.id)
    const backups = await db.collection("backups").find({
        instance: query.id
    }).toArray();
    console.log(backups)
    return {
        props: { backups: JSON.parse(JSON.stringify(backups)), instanceId: query.id }
    }
}

export default function Backups({ backups, instanceId }) {
    const router = useRouter();
    const [creatingBackup, setCreatingBackup] = useState(false);
    const [tempBackupName, setTempBackupName] = useState(null);
    return (
        <>
            <Grid container direction="row" sx={{ mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: "auto", mb: "auto" }}>Backups</Typography>
                <Button variant="contained" color="primary" sx={{ ml: "auto", mt: "auto", mb: "auto " }} onClick={() => {
                    setCreatingBackup(true);
                }}>Create Backup</Button>

            </Grid>
            <Modal open={creatingBackup} onClose={() => setCreatingBackup(false)}>
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
                    <Typography variant="h6">Create Backup</Typography>
                    <Grid container direction="column">
                        <TextField placeholder="Backup Name" value={tempBackupName} onChange={(e) => setTempBackupName(e.target.value)} sx={{ maxWidth: "300px" }} />
                        <Button sx={{ ml: "auto" }} variant="contained" color="success" onClick={async () => {
                            try {
                                await post(`/api/v1/client/instances/${instanceId}/backups`, {
                                    name: tempBackupName
                                })
                            } catch (error) {
                                console.log(error);
                            }
                            setTempBackupName(null);
                            setCreatingBackup(false);
                            router.replace(router.asPath)
                        }}>Create</Button>
                    </Grid>
                </Box>
            </Modal>
            {backups.map((backup) => {
                let date = new Date(backup.created_at);
                return (
                    <>
                        <Grid container item md={12} xs={12} direction="row" sx={{ mb: 2 }}>
                            <Paper sx={{ width: "100%", borderRadius: "10px", height: "100%", p: "10px" }}>
                                <Grid container xs={12} sx={{ height: "100%", width: "100%" }}>

                                    <Grid item xs={3} container sx={{ height: "100%", width: "100%" }} direction="row">
                                        <Typography variant="h6" sx={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto" }}>{backup.name}</Typography>
                                        {backup.pending == true ? <Chip color="warning" label="Pending" /> : ""}
                                    </Grid>
                                    <Grid xs={3} item container sx={{ height: "100%", width: "100%", marginTop: "auto", marginBottom: "auto" }}>
                                        <Typography variant="body2" style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "auto" }}>{`${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}</Typography>
                                    </Grid>
                                    <Grid item xs={1.5} container sx={{ height: "100%", width: "100%", marginLeft: "auto" }}>
                                        <Button variant="contained" color="error" sx={{ marginLeft: "auto" }}><DeleteIcon /></Button>
                                        <Button variant="contained" color="success" sx={{ marginLeft: "auto" }}><Download /></Button>
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

Backups.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="backups">
                {page}
            </Navigation>
        </InstanceStore.Provider>
    )
}