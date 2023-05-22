"use client";

import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, MenuItem, Select, Typography, Grid, Button, Divider, Skeleton } from "../../../../components/base";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import lxd from "../../../../lib/lxd";

export default function Storage({ volumes, setVolumes, storagePools, accessToken, setStep }) {
    const [update, setUpdate] = useState(false);
    const [poolVolumes, setPoolVolumes] = useState([]);
    return (
        <>
            <Typography variant="h6" sx={{ mb: 1 }}>Disks</Typography>

            {volumes ? volumes.map(volume => {
                return (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <TextField placeholder="Disk Name" onChange={(e) => {
                                let newVolumes = volumes;
                                newVolumes.forEach((vol, index) => {
                                    if (vol.name == volume.name) {
                                        newVolumes[index].name = e.target.value;
                                    }
                                })
                                setVolumes(newVolumes)
                                setUpdate(!update);
                            }} value={volume.name} disabled={volume.name == "root" || volume.profile == true} />
                        </AccordionSummary>
                        <Grid container direction="column" sx={{ px: 2, pb: 2 }}>
                            <Typography>Storage Pool</Typography>
                            <Select onChange={() => {
                                let newPoolVolumes = poolVolumes;
                                setPoolVolumes(null);
                                volumes.forEach((volume) => {
                                    if (!volume.profile && volume.name != "root" && volume.pool) {
                                        setUpdate(!update);
                                        async function run() {
                                            let volumes = await (await (lxd(accessToken).storagePools.storagePool(volume.pool))).getVolumes();
                                            volumes.filter((volume => volume.type != "container")).forEach((vol) => {
                                                newPoolVolumes.push({
                                                    ...vol,
                                                    pool: volume.pool
                                                })
                                            })
                                            setPoolVolumes(newPoolVolumes);
                                        }
                                        run()
                                    }
                                })
                            }} value={volume.pool} disabled={volume.profile} size="small" label="Storage Pool" sx={{ width: "100%" }}>
                                {storagePools.map((pool) => {
                                    return (
                                        <MenuItem onClick={() => {
                                            let newVolumes = volumes;
                                            newVolumes.forEach((vol, index) => {
                                                if (vol.name == volume.name) {
                                                    newVolumes[index].pool = pool.name;
                                                }
                                            })
                                            setVolumes(newVolumes)
                                            setUpdate(!update);
                                        }} value={pool.name}>{pool.name}</MenuItem>)
                                })}
                            </Select>
                            {volume.name != "root" ?
                                <>
                                    <Typography>Volume</Typography>
                                    {poolVolumes ?
                                        <Select disabled={poolVolumes.length == 0} value={volume.source} size="small" label="Source" sx={{ width: "100%" }}>
                                            {poolVolumes.map((poolVolume) => {
                                                return (
                                                    <MenuItem onClick={() => {
                                                        let newVolumes = volumes;
                                                        newVolumes.forEach((vol, index) => {
                                                            if (vol.name == volume.name) {
                                                                newVolumes[index].source = poolVolume.name;
                                                            }
                                                        })
                                                        setVolumes(newVolumes)
                                                        setUpdate(!update);
                                                    }} value={poolVolume.name}>{poolVolume.name}</MenuItem>)
                                            })}
                                        </Select>
                                        : <Skeleton sx={{ width: "100%", height: "70px", borderRadius: 2, m: 0 }} />}
                                </>
                                : ""}
                            <Typography>Mountpoint</Typography>
                            <TextField onChange={(e) => {
                                let newVolumes = volumes;
                                newVolumes.forEach((vol, index) => {
                                    if (vol.name == volume.name) {
                                        newVolumes[index].path = e.target.value;
                                    }
                                })
                                setVolumes(newVolumes)
                                setUpdate(!update);
                            }} disabled={volume.profile} value={volume.path}></TextField>
                            {volume.name == "root" ?
                                <>
                                    <Typography>Size</Typography>
                                    <Grid container direction="row">
                                        <TextField value={volume.size ? volume.size.split("GB")[0].split("MB")[0] : ""} disabled={volume.profile} sx={{ width: "70%" }} />
                                        <Select value={volume.size ? volume.size.includes("GB") ? "GB" : volume.size.includes("MB") ? "MB" : "none" : "none"} disabled={volume.profile} size="small" label="Unit" sx={{ width: "30%" }}>
                                            <MenuItem value="none">No Limit</MenuItem>
                                            <MenuItem value="GB">GB</MenuItem>
                                            <MenuItem value="MB">MB</MenuItem>
                                        </Select>
                                    </Grid>
                                </>
                                : ""}
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Button disabled={volume.profile || volume.name == "root"} onClick={() => {
                                let newVolumes = volumes;
                                newVolumes.forEach((vol, index) => {
                                    if (vol.name == volume.name) {
                                        newVolumes.splice(index, 1)
                                    }
                                })
                                setVolumes(newVolumes)
                                setUpdate(!update)
                            }} sx={{ ml: "auto" }} variant="contained" color="error">Remove Volume</Button>
                        </Grid>
                    </Accordion>
                )
            }) : ""}
            <Grid container sx={{mt: 2}}>
                <Button onClick={() => {
                    let newVolumes = volumes;
                    newVolumes.push({
                        profile: false
                    });
                    setVolumes(volumes)
                    setUpdate(!update)
                }} sx={{ ml: "auto" }} variant="contained" color="success">Add Volume</Button>
            </Grid>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Grid container>
                                                <Button sx={{mr: "auto"}} onClick={() => setStep("instanceDetails")} variant="contained" color="info">Back</Button>
                    <Button sx={{ml: "auto"}} onClick={() => setStep("networks")} sx={{ml: "auto"}} variant="contained" color="info">Next</Button>
                    </Grid>
        </>
    )
}