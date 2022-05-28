import { Box, Button, Grid, Modal, Typography, TextField, Paper, Chip, Checkbox, Tooltip, Zoom, Dialog, DialogTitle, DialogContent, useMediaQuery, useTheme, Autocomplete } from "@mui/material";
import { Delete as DeleteIcon, Edit, History as HistoryIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Navigation from "../../../components/instance/Navigation"
import { InstanceStore } from "../../../states/instance"
import { useRouter } from "next/router";
import axios, { post } from "axios";
import Footer from "../../../components/footer";
import hyexd from "hyexd";
import prisma from "../../../lib/prisma";
import getNodeEnc from "../../../lib/getNodeEnc";
import prettyBytes from "pretty-bytes";

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
    const { decode } = require("jsonwebtoken");
    const user_data = decode(req.cookies.access_token)

    const instance = await prisma.instance.findUnique({
        where: {
            id: query.id
        },
        include: {
            node: true
        }
    })
    let disks;
    const client = new hyexd("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    })
    let instState = await client.instance(instance.id).state;
    instState = instState.metadata;
    disks = await client.instance(instance.id).data;
    disks = disks.metadata.devices;

    disks = Object.keys(disks).map(key => {
        if (disks[key].type === "disk") {
            return {
                ...disks[key],
                name: key,
                usage: instState.disk[key].usage
            }
        } else {
            return -1;
        }
    }
    ).filter(x => x !== -1);
    return {
        props: { disks, instanceId: query.id, nodeID: instance.nodeId }
    }

}

export default function Disks({ disks, instanceId, nodeID }) {
    const [pools, setPools] = useState([]);
    const [volumes, setVolumes] = useState([]);
    const [creatingDisk, setCreatingDisk] = useState(false);
    const [tempDiskName, setTempDiskName] = useState(null);
    const [tempDiskPath, setTempDiskPath] = useState(null);
    const [tempDiskPool, setTempDiskPool] = useState(null);
    const [tempDiskVolume, setTempDiskVolume] = useState(null)
    const router = useRouter();
    useEffect(() => {
        axios.get(`/api/v1/nodes/${nodeID}/storage-pools`).then(res => {
            let tempPools = [];
            let tempVolumes = [];
            res.data.metadata.forEach(pool => {
                tempPools.push({
                    label: pool.name,
                    value: pool.name
                });
                axios.get(`/api/v1/nodes/${nodeID}/storage-pools/${pool.name}/volumes`).then((dat) => {
                    console.log(dat.data.metadata);
                    dat.data.metadata.filter(dev => dev.type == "custom").forEach(volume => {
                        tempVolumes.push({
                            ...volume,
                            pool: pool.name,
                            label: volume.name,
                            value: volume.name

                        })
                    })
                    setVolumes(tempVolumes);
                })
                setPools(tempPools);
                console.log(tempPools)
            })
        })
    }, [])
    return (
        <>
            <Dialog open={creatingDisk} onClose={() => setCreatingDisk(false)}>
                <DialogTitle>
                    <Typography variant="h6" fontFamily="Poppins" align="center">Attach Volume</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Disk Name</Typography>
                        <TextField onChange={(e) => setTempDiskName(e.target.value)} variant="standard" placeholder="root" value={tempDiskName} sx={{ ml: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Mount Point</Typography>
                        <TextField onChange={(e) => setTempDiskPath(e.target.value)} variant="standard" value={tempDiskPath} sx={{ ml: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Storage Pool</Typography>
                        {pools.length > 0 ?
                            <Autocomplete sx={{ mb: "auto", ml: "auto" }} onChange={(e, value) => setTempDiskPool(value.value)} value={tempDiskPool} options={pools} renderInput={(params) => <TextField {...params} variant="standard" placeholder="default" sx={{ width: "248px" }} />} />
                            : ""}
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Volume</Typography>
                        {pools.length > 0 ?
                            <Autocomplete sx={{ mb: "auto", ml: "auto" }} onChange={(e, value) => setTempDiskVolume(value.value)} value={tempDiskVolume} options={volumes.filter(vol => vol.pool == tempDiskPool)} renderInput={(params) => <TextField {...params} variant="standard" placeholder="default" sx={{ width: "248px" }} />} />
                            : ""}
                    </Grid>
                </DialogContent>

                <Button variant="contained" color="success" onClick={async () => {
                    try {
                        await axios.get(`/api/v1/instances/${instanceId}`).then(async (dat) => {
                            console.log(dat.data)
                            console.log("THE DATA")
                            await axios.patch(`/api/v1/instances/${instanceId}`, {
                                devices: {
                                    ...dat.data.metadata.devices,
                                    [tempDiskName]: {
                                        type: "disk",
                                        source: tempDiskVolume,
                                        pool: tempDiskPool,
                                        path: tempDiskPath
                                    }
                                }
                            })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                    setTempDiskName(null);
                    setCreatingDisk(false);
                    router.replace(router.asPath);
                }}>Attach Volume</Button>
            </Dialog>
            <Grid container>
                <Typography variant="h6">Disks</Typography>
                <Button variant="contained" color="info" sx={{ ml: "auto", mt: "auto", mb: "auto" }} onClick={() => {
                    setCreatingDisk(true);
                }}>Attach Volume</Button>
            </Grid>
            <Grid container direction="row" sx={{ mb: 1, display: { xs: "none", sm: "none", md: "flex" } }}>
                <Grid container xs={.6}>
                    <Checkbox sx={{ mt: "auto", mb: "auto", display: { xs: "none", sm: "none", md: "inherit" } }} />
                </Grid>
                <Grid container xs={3} sm={3} md={2} lg={2} xl={1.5}>
                    <Typography noWrap sx={{ mt: "auto", mb: "auto" }}>Name</Typography>
                </Grid>
                <Grid container xs={2} md={1.5} xl={1}>
                    <Typography sx={{ mt: "auto", mb: "auto" }}>Size</Typography>
                </Grid>
                <Grid container xs={2} md={1.5} xl={1}>
                    <Typography sx={{ mt: "auto", mb: "auto" }}>Mount</Typography>
                </Grid>
                <Grid container xs={2} md={1.5} xl={1}>
                    <Typography sx={{ mt: "auto", mb: "auto" }}>Pool</Typography>
                </Grid>
            </Grid>
            {disks.length == 0 ? <Typography variant="h6">No Disks</Typography> : ""}
            {disks.map((disk) => {
                console.log(disk)
                return (
                    <Paper sx={{ mt: 1, pt: 1, pb: 1 }} key={disk.name}>
                        <Grid container direction="row">
                            <Grid item container xs={.6}>
                                <Checkbox sx={{ mt: "auto", mb: "auto", display: { xs: "none", sm: "none", md: "flex" } }} />
                            </Grid>
                            <Grid container xs={3} sm={3} md={2} lg={2} xl={1.5} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography fontWeight="bold">{disk.name}</Typography>
                            </Grid>
                            <Grid container xs={2} md={1.5} xl={1} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography>{prettyBytes(disk.usage).replace(" ", "") + " / " + (disk.size ? disk.size : "∞")}</Typography>
                            </Grid>
                            <Grid container xs={2} md={1.5} xl={1} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography>{disk.path}</Typography>
                            </Grid>
                            <Grid container xs={2} md={1.5} xl={1} sx={{ mt: "auto", mb: "auto" }}>
                                <Typography>{disk.pool}</Typography>
                            </Grid>
                            <Grid container xs={3} md={4} xl={1.8} sx={{ ml: "auto" }} direction="row">
                                <Tooltip title="Delete" TransitionComponent={Zoom}>
                                    <Button onClick={() => {
                                        axios.get("/api/v1/instances/" + instanceId).then(async (dat) => {
                                            let devs = dat.data.metadata.devices;
                                            delete devs[disk.name];
                                            await axios.put("/api/v1/instances/" + instanceId, {
                                                ...dat.data.metadata,
                                                devices: devs
                                            })
                                        });
                                    }} sx={{ ml: "auto", mr: 2, mt: "auto", mb: "auto" }} variant="contained" color="error"><DeleteIcon /></Button>
                                </Tooltip>
                                <Tooltip title="Edit" TransitionComponent={Zoom}>
                                    <Button sx={{ mr: 2, mt: "auto", mb: "auto" }} variant="contained" color="warning"><Edit /></Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}
        </>
    )
}

Disks.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="disks">
                {page}
                <Footer />
            </Navigation>
        </InstanceStore.Provider>
    )
}