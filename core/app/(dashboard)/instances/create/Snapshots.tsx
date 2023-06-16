"use client";

import {FormControlLabel, Grid, MenuItem, Select, Switch, Typography, TextField, Button, Divider} from "../../../../components/base"
import lxd from "../../../../lib/lxd";

export default function Snapshots({setStep, snapshotSchedule, setSnapshotSchedule, snapshotExpiration, setSnapshotExpiration, autoWhileStopped, setAutoWhileStopped, configuration, accessToken}) {
    return (
        <>
                        <Typography>Snapshot Expiration</Typography>
                <TextField type="number" sx={{width: "80%"}} onChange={(e) => {
                    setSnapshotExpiration(e.target.value)
                        }} disabled={false} value={snapshotExpiration.replace(/\D/g, "")} />
         <Select size="small" sx={{width: "20%"}} value={snapshotExpiration.includes("d") ? "Days" : snapshotExpiration.includes("w") ? "Weeks" : snapshotExpiration.includes("m") ? "Months": snapshotExpiration.includes("H") ? "Hours" : snapshotExpiration.includes("M") ? "Minutes": snapshotExpiration.includes("y") ? "Years" : ""}>
            <MenuItem onClick={() => setSnapshotExpiration("")} value="">Never</MenuItem>
            <MenuItem onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "M")} value="Minutes">Minutes</MenuItem>
            <MenuItem value="Hours" onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "H")}>Hours</MenuItem>
            <MenuItem value="Days" onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "d")}>Days</MenuItem>
            <MenuItem value="Weeks" onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "w")}>Weeks</MenuItem>
            <MenuItem value="Months" onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "m")}>Months</MenuItem>
            <MenuItem value="Years" onClick={() => setSnapshotExpiration(snapshotExpiration.replace(/\D/g, "") + "y")}>Years</MenuItem>
        </Select>
        <Typography>Take Snapshots Automatically</Typography>
        <Select size="small" sx={{width: "100%"}} value={snapshotSchedule} onChange={(e) => {
            setSnapshotSchedule(e.target.value);
        }}>
            <MenuItem value="">Never</MenuItem>
            <MenuItem value="@hourly">Hourly</MenuItem>
            <MenuItem value="@daily">Daily</MenuItem>
            <MenuItem value="@weekly">Weekly</MenuItem>
            <MenuItem value="@monthly">Monthly</MenuItem>
            <MenuItem value="@yearly">Yearly</MenuItem>
        </Select>
        <Grid container direction="column">
        <FormControlLabel control={<Switch onClick={() => {
            setAutoWhileStopped(!autoWhileStopped)
                }} checked={autoWhileStopped} />} label={"Automatically Take Snapshots While Stopped"} />
                <Typography variant="caption">Controls whether or not snapshots are automatically taken while the instance is stopped</Typography>
                </Grid>
                <Divider sx={{mt: 2, mb: 2}} />
                <Grid container>
                                                <Button sx={{mr: "auto"}} onClick={() => setStep("securityPolicies")} variant="contained" color="info">Back</Button>
                    <Button sx={{ml: "auto"}} onClick={async () => {
                                  let createOperation = await lxd(accessToken).createInstance(configuration);
                                  setTimeout(() => {
                                    window.location.href = `/operations/${createOperation.id}`
                                  }, 500)
                    }} sx={{ml: "auto"}} variant="contained" color="success">Create Instance</Button>
                    </Grid>
        </>
    )
}