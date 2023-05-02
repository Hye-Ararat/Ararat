"use client";
import nookies from "nookies";
import lxd from "../../../../lib/lxd";

import {Grid, Paper, Typography} from "../../../../components/base"
import StateIndicator from "./StateIndicator";
import StateButtons from "./StateButtons";
import { useEffect, useState } from "react";
export default function InfoTop({instance}) {
    const [status, setStatus] = useState(instance.status);
    let access_token = nookies.get().access_token;
    let client = lxd(access_token);
    useEffect(() => {
        let interval = setInterval(async () => {
            let state = await client.instances.instance(instance.name).getState()
            setStatus(state.status);
        }, 5000);
        return () => clearInterval(interval);
    }, [])
    return (
    <Grid component={Paper} container direction="row" sx={{p: 2, mb: 2}}>
        <Grid xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto", mr: 1 }} container direction="row">
        <StateIndicator status={status} />
        </Grid>
        <Grid container xs={5}>
        <Typography sx={{my: "auto"}}>{status}</Typography>
        </Grid>
        <Grid sx={{ml: "auto"}} container xs={5}>
        <StateButtons instance={instance} status={status}/>
        </Grid>
    </Grid>
    )
}