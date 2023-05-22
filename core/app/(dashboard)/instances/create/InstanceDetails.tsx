"use client";

import { Button, DialogTitle, MenuItem, Select, TextField, Typography, Grid, Divider } from "../../../../components/base";
import {useState, useEffect} from "react";

export default function InstanceDetails({image, type, setType, setStep, profiles, setProfile, profile, instanceName, setInstanceName}) {
    const [availableTypes, setAvailableTypes] = useState([]);
        useEffect(() => {
        if (image) {
            let types: string[] = [];
            Object.keys(image.versions).forEach(version => {
                Object.keys(image.versions[version].items).forEach(item => {
                    let ftype = image.versions[version].items[item].ftype
                    console.log(ftype)
                    console.log(types)
                    if (!types.includes("virtual-machine")) {
                        if ( ftype == "disk-kvm.img" || ftype == "disk1.img" || ftype == "uefi1.img") {
                            types.push("virtual-machine");
                        }
                    }
                    console.log(types.includes("container"))
                    if (!types.includes("container")) {
                        console.log("type not include container")
                        console.log(ftype, "FTYPE")
                        if (ftype == "root.tar.xz") {
                            types.push("container");
                        }
                         if (ftype == "root.tar.gz") {
                            types.push("container")
                        }
                    }
                })
            })
        setAvailableTypes(types);
        if (availableTypes.length == 1) {
        setType(types[0]);
        }
        }
    }, [])
    return (
        <>
                <Typography>Instance Name</Typography>
        <TextField onChange={(e) => setInstanceName(e.target.value)} value={instanceName} sx={{width: "100%"}} placeholder="My Instance" />
        <Typography>Instance Type</Typography>
        <Select size="small" label="Type" sx={{width: "100%"}} value={type} onChange={(e, value) => setType(value.props.value)}>
            {availableTypes.map(type => {
                return (
                    <MenuItem value={type}>{type == "container" ? "N-VPS": "KVM"}</MenuItem>
                )
            })}
        </Select>
                <Typography>Profile</Typography>
             <Select size="small" label="Profile" sx={{width: "100%"}} value={profile} onChange={(e, value) => {
                setProfile(value.props.value)
             }}>
            {profiles.map(profile => {
                return (
                    <MenuItem value={profile.name}>{profile.name}</MenuItem>
                )
            })}
        </Select>
                    <Divider sx={{mt: 2, mb: 2}} />
        <Grid container sx={{mt: 2}}>
        <Button onClick={() => setStep("storage")} sx={{ml: "auto"}} variant="contained" color="info">Next</Button>
        </Grid>
        </>
    )
}