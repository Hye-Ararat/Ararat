"use client";
import { useState } from "react";
import {Typography, Switch, FormGroup, FormControlLabel, Grid, Button, Divider} from "../../../../components/base";

export default function SecurityPolicies({securityPolicies, type, setSecurityPolicies, setStep}) {
    const [update, setUpdate] = useState(false);
    return (
        <>
        <FormGroup>
        {Object.keys(securityPolicies).map((policy) => {
            let policyCondition = securityPolicies[policy].condition;
            console.log(type)
            console.log(policyCondition)
            return (
                policyCondition == type || !policyCondition ?
                <>
                <FormControlLabel control={<Switch onClick={() => {
                    let newPolicies = securityPolicies;
                    newPolicies[policy].value = !newPolicies[policy].value;
                    setSecurityPolicies(newPolicies);
                    setUpdate(!update)
                }} checked={securityPolicies[policy].value} />} label={securityPolicies[policy].title} />
                <Typography variant="caption">{securityPolicies[policy].description}</Typography>
                </>
                : ""
            ) 
        })}
        </FormGroup>
        <Divider sx={{mt: 2, mb: 2}} />
        <Grid container>
                                                <Button sx={{mr: "auto"}} onClick={() => setStep("resourceLimits")} variant="contained" color="info">Back</Button>
                    <Button sx={{ml: "auto"}} onClick={() => setStep("snapshots")} sx={{ml: "auto"}} variant="contained" color="info">Next</Button>
                    </Grid>
        </>
    )
}