"use client";
import {Typography, Divider, Grid, Button, TextField, Select, MenuItem} from "../../../../components/base";

export default function ResourceLimits({setStep, profiles, profile, memoryLimit, setMemoryLimit, cpuCores, setCpuCores}) {
    let profileData = profiles.filter((prof) => prof.name == profile)[0];
    console.log(profileData, "PROFDATA")
    if (profileData.config["limits.memory"]) {
        setMemoryLimit(profileData.config["limits.memory"]);
    }
    if (profileData.config["limits.cpu"]) {
        setCpuCores(profileData.config["limits.cpu"]);
    }
    return (
        <>
                        <Typography>Memory</Typography>
                        <Grid container direction="row">
                        <TextField onChange={(e) => {
                            setMemoryLimit(e.target.value)
                        }} sx={{width: "70%"}} type="number" value={memoryLimit ? memoryLimit.split("GB")[0].split("MB")[0] : ""} disabled={profileData.config["limits.memory"]} />
                        <Select onChange={(e) => {
                            if (e.target.value == "none") {
                                setMemoryLimit(null)
                            } else {
                            setMemoryLimit(memoryLimit + e.target.value)
                            }
                        }} disabled={profileData.config["limits.memory"]} size="small" sx={{width: "30%"}} value={memoryLimit ? memoryLimit.includes("GB") ? "GB" : memoryLimit.includes("MB") ? "MB" : "none" : "none"}>
                            <MenuItem value="none">No Limit</MenuItem>
                            <MenuItem value="GB">GB</MenuItem>
                            <MenuItem value="MB">MB</MenuItem>
                        </Select>
                        </Grid>
                        <Typography>CPU Cores</Typography>
                        <TextField sx={{width: "100%"}} onChange={(e) => {
                            setCpuCores(e.target.value)
                        }} disabled={profileData.config["limits.cpu"]} value={cpuCores} />
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Grid container>
                                                <Button sx={{mr: "auto"}} onClick={() => setStep("networks")} variant="contained" color="info">Back</Button>
                    <Button sx={{ml: "auto"}} onClick={() => setStep("securityPolicies")} sx={{ml: "auto"}} variant="contained" color="info">Next</Button>
                    </Grid>

        </>
    )
}