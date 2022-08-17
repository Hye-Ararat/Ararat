import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import permissions from "../lib/permissions.json";



export default function PermissionsSelector({ permSection, currentPerms }) {
    const [viewedPane, setViewedPane] = useState(0);
    const [fullPerms, setFullPerms] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState(currentPerms)
    useEffect(() => {
        console.log(permissions)
        let perms = permissions;
        let count = 0;
        Object.keys(permissions).forEach(section => {
            if (permissions[section].scopes) {
                if (permissions[section].scopes[permSection]) {
                    if (Object.keys(permissions[section].scopes[permSection]).length > 0) {
                        perms = {
                            ...perms,
                            [permSection]: {
                                ...perms[permSection],
                                [section]: {
                                    ...permissions[section].scopes[permSection]
                                }
                            }
                        }


                    }
                    let sec = permissions[section]
                    //delete sec.scopes
                    perms = {
                        ...perms,
                        [permSection]: {
                            ...perms[permSection],
                            [section]: {
                                ...sec,
                                ...permissions[section].scopes[permSection]
                            }
                        }
                    }
                }
            }
            count++;
            if (count == Object.keys(permissions).length) {
                console.log(perms)
                setFullPerms(perms);
            }
        });
    }, [])
    const [allPermissions, setAllPermissions] = useState([])
    useEffect(() => {
        console.log(fullPerms)
        if (Object.keys(fullPerms).length > 0) {
            console.log("EEE")
            let perms = [];
            Object.keys(fullPerms[permSection]).filter((perm) => perm != "scopes").forEach(perm => {
                Object.keys(fullPerms[permSection][perm]).forEach(permS => {
                    console.log(permS)
                    if (fullPerms[permSection][perm][permS][0]) {
                        fullPerms[permSection][perm][permS].forEach(perm => {
                            perms.push(perm);
                        })
                    } else {
                        Object.keys(fullPerms[permSection][perm][permS]).forEach(permis => {
                            if (fullPerms[permSection][perm][permS][permis][0]) {
                                fullPerms[permSection][perm][permS][permis].forEach(perm => {
                                    perms.push(perm);
                                })
                            }

                        }
                        )
                    }

                })
            })
            setAllPermissions(perms)

        }
    }, [fullPerms])

    return (
        <>
            <FormControlLabel control={<Checkbox checked={selectedPermissions.length == allPermissions.length} onClick={(e) => {
                console.log(allPermissions)
                console.log(selectedPermissions)
                if (e.target.checked) {
                    setSelectedPermissions(allPermissions)
                } else {
                    setSelectedPermissions([]);
                }
            }} />} label="All Permissions" />
            {fullPerms[permSection] ? <>
                {Object.keys(fullPerms[permSection]).filter((value) => value != "scopes").map((permissionHead, index) => {
                    return (
                        <Accordion key={permissionHead} expanded={viewedPane == index} onClick={() => setViewedPane(index)}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" fontFamily="Poppins">
                                    {permissionHead[0].toUpperCase() + permissionHead.substring(1, permissionHead.length).replace("-", " ")}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container direction="column">
                                    {Object.keys(fullPerms[permSection][permissionHead]).filter(value => value != "scopes").map((permSec) => {
                                        return (
                                            <>
                                                <Typography key={permSec} variant="h6" fontSize="large" fontWeight="700">
                                                    {permSec[0].toUpperCase() + permSec.substring(1, permSec.length)}
                                                </Typography>
                                                <Grid container direction="row">
                                                    {fullPerms[permSection][permissionHead][permSec][0] ? fullPerms[permSection][permissionHead][permSec].map((perm) => {
                                                        return (
                                                            <FormControlLabel
                                                                key={perm}
                                                                label={
                                                                    perm.split("-").length > 1 ? perm.split("-").join(" ").split("_")[0].split(" ").map((word) => {
                                                                        return (
                                                                            word.charAt(0).toUpperCase() + word.substring(1, word.length) + " "
                                                                        )
                                                                    }) : perm.split("_").join(" ").split("-").join(" ").split(" ").map(word => {
                                                                        return (
                                                                            word.charAt(0).toUpperCase() + word.substring(1, word.length) + " "
                                                                        )
                                                                    })

                                                                }
                                                                control={
                                                                    <Checkbox
                                                                        checked={selectedPermissions.includes(perm)}
                                                                        onChange={(e) => {
                                                                            let perms = user.permissions;
                                                                            if (e.target.checked) {
                                                                                perms.push(perm);
                                                                            } else {
                                                                                perms.splice(perms.indexOf(perm), 1);
                                                                            }
                                                                            setSelectedPermissions(perms);
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        );
                                                    }) : Object.keys(fullPerms[permSection][permissionHead][permSec]).map((perm) => {
                                                        return (
                                                            <Grid key={perm} container direction="column">
                                                                <Typography fontWeight={500} sx={{ mt: .5 }} color="lightgray">
                                                                    {perm[0].toUpperCase() + perm.substring(1, perm.length)}
                                                                </Typography>
                                                                <Grid container direction="row">
                                                                    {fullPerms[permSection][permissionHead][permSec][perm].map((perm) => {
                                                                        return (
                                                                            <FormControlLabel
                                                                                key={perm}
                                                                                label={
                                                                                    perm.split("-").length > 1 ? perm.split("-").join(" ").split("_")[0].split(" ").map((word) => {
                                                                                        return (
                                                                                            word.charAt(0).toUpperCase() + word.substring(1, word.length) + " "
                                                                                        )
                                                                                    }) : perm.split("_").join(" ").split("-").join(" ").split(" ").map(word => {
                                                                                        return (
                                                                                            word.charAt(0).toUpperCase() + word.substring(1, word.length) + " "
                                                                                        )

                                                                                    })
                                                                                }
                                                                                control={
                                                                                    <Checkbox
                                                                                        checked={selectedPermissions.includes(perm)}
                                                                                        onChange={(e) => {
                                                                                            let perms = selectedPermissions;
                                                                                            if (e.target.checked) {
                                                                                                perms.push(perm);
                                                                                            } else {
                                                                                                perms.splice(perms.indexOf(perm), 1);
                                                                                            }
                                                                                            setSelectedPermissions(perms)
                                                                                        }}
                                                                                    />
                                                                                }
                                                                            />
                                                                        )
                                                                    })}
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </>
                                        );
                                    })}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </> : <></>}
        </>
    )
}