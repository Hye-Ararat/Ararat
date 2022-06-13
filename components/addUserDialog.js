import { Expand, ExpandMore } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    Button
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import permissions from "../lib/permissions.json";

export default function AddUserDialog({ open, permSection, userState }) {
    const [acUsers, setacUsers] = useState(null);
    const [fullUsers, setFullUsers] = useState(null);
    const [user, setUser] = useState({});
    const [viewedPane, setViewedPane] = useState(0);
    const [fullPerms, setFullPerms] = useState({});
    useEffect(() => {
        let perms = permissions;
        let count = 0;
        Object.keys(permissions).forEach(section => {
            if (permissions[section].scopes) {
                if (permissions[section].scopes[permSection]) {
                    if (Object.keys(permissions[section].scopes[permSection]).length > 0) {
                        Object.keys(permissions[section].scopes[permSection]).forEach(permS => {
                            perms = {
                                ...perms,
                                [permSection]: {
                                    ...perms[permSection],
                                    [section]: {
                                        ...perms[permSection][permSection],
                                        [permS]: {
                                            ...permissions[section].scopes[permSection][permS],
                                        }
                                    }
                                }
                            }
                        })

                    }
                    let sec = permissions[section]
                    //delete sec.scopes
                    perms = {
                        ...perms,
                        [permSection]: {
                            ...perms[permSection],
                            [section]: {
                                ...sec
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
    const [allPermissions, setAllPermissions] = useState(() => {
        let perms = [];
        Object.keys(permissions).forEach(section => {
            if (permissions[section].scopes) {
                if (permissions[section].scopes[permSection]) {
                    if (Object.keys(permissions[section].scopes[permSection]).length > 0) {
                        Object.keys(permissions[section].scopes[permSection]).forEach(permS => {
                            permissions[section].scopes[permSection][permS].forEach(perm => {
                                perms.push(perm);
                            })
                        })
                    }
                }
            }
        })
        Object.keys(permissions[permSection]).filter((perm) => perm != "scopes").forEach(perm => {
            Object.keys(permissions[permSection][perm]).forEach(permS => {
                permissions[permSection][perm][permS].forEach(perm => {
                    perms.push(perm);
                })
            })
        })
        console.log(perms)
        return perms;
    })

    useEffect(() => {
        axios.get("/api/v1/users").then((res) => {
            setFullUsers(res.data.metadata);
            let tempUsers = [];
            res.data.metadata.forEach((user) => {
                tempUsers.push({
                    label: user.firstName + " (" + user.email + ")",
                    id: user.id,
                    value: user.id
                });
            });
            setacUsers(tempUsers);
        });
    }, []);
    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="Poppins">
                    Add User to {permSection[0].toUpperCase() + permSection.substring(1, permSection.length)}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 600 }}>
                <Typography align="center" sx={{ mb: 1 }}>
                    Select the user you would like to add to this {permSection}:
                </Typography>
                {acUsers ? (
                    <Autocomplete
                        onChange={(e, value) => {
                            if (value) {
                                setUser({
                                    id: fullUsers[e.target.value].id,
                                    firstName: fullUsers[e.target.value].firstName,
                                    lastName: fullUsers[e.target.value].lastName,
                                    email: fullUsers[e.target.value].email,
                                    permissions: []
                                });
                            } else {
                                setUser({});
                            }
                        }}
                        sx={{ mr: "auto", ml: "auto" }}
                        options={acUsers}
                        renderInput={(params) => (
                            <TextField autoComplete="off" placeholder="Enter email" {...params} sx={{ minWidth: "300px" }} />
                        )}
                    />
                ) : (
                    ""
                )}
                {user.permissions ? (
                    <>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Typography align="center" fontFamily="Poppins" variant="h6" sx={{ mb: 1 }}>
                            Permissions
                        </Typography>
                        <FormControlLabel control={<Checkbox checked={true} />} label="All Permissions" />
                        {Object.keys(fullPerms[permSection]).filter((value) => value != "scopes").map((permissionHead, index) => {
                            return (
                                <Accordion key={permissionHead} expanded={viewedPane == index} onClick={() => setViewedPane(index)}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant="h6" fontFamily="Poppins">
                                            {permissionHead[0].toUpperCase() + permissionHead.substring(1, permissionHead.length)}
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
                                                                                checked={user.permissions.includes(perm)}
                                                                                onChange={(e) => {
                                                                                    let perms = user.permissions;
                                                                                    if (e.target.checked) {
                                                                                        perms.push(perm);
                                                                                    } else {
                                                                                        perms.splice(perms.indexOf(perm), 1);
                                                                                    }
                                                                                    setUser({ ...user, permissions: perms });
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
                                                                                                checked={user.permissions.includes(perm)}
                                                                                                onChange={(e) => {
                                                                                                    let perms = user.permissions;
                                                                                                    if (e.target.checked) {
                                                                                                        perms.push(perm);
                                                                                                    } else {
                                                                                                        perms.splice(perms.indexOf(perm), 1);
                                                                                                    }
                                                                                                    setUser({ ...user, permissions: perms });
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
                        {Object.keys(fullPerms[permSection]).filter(value => value != "scopes").length == 0 ? <p>e</p> : ""}
                    </>
                ) : (
                    ""
                )}
            </DialogContent>
            <DialogActions>
                {user.permissions ? (
                    <Button
                        onClick={() => {
                            userState(user);
                            setTimeout(() => {
                                setUser({});
                                setViewedPane(0);
                            }, 500);
                        }}
                        variant="contained"
                        color="info"
                    >
                        Add User
                    </Button>
                ) : (
                    ""
                )}
            </DialogActions>
        </Dialog>
    );
}
