import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import permissions from "../../../lib/permissions.json";

export default function Users({ setPage, setUsers, users }) {
    const [acUsers, setacUsers] = useState(null);
    const [fullUsers, setFullUsers] = useState(null);
    const [addingUser, setAddingUser] = useState(true);
    const [tempUser, setTempUser] = useState({});
    const [userPanel, setUserPanel] = useState("files");
    useEffect(() => {
        axios.get("/api/v1/users").then(res => {
            setFullUsers(res.data.metadata)
            let tempUsers = [];
            res.data.metadata.forEach(user => {
                tempUsers.push({
                    label: user.firstName + " (" + user.email + ")",
                    id: user.id,
                    value: user.id
                })
            });
            setacUsers(tempUsers)
        })
    }, [])
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" fontFamily="Poppins" align="center">Users</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 600 }}>
                <Dialog open={addingUser}>
                    <DialogTitle>
                        <Typography variant="h6" fontFamily="Poppins" align="center">Add User</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Typography align="center" sx={{ mb: 1 }}>Select the user you want to add:</Typography>
                        {acUsers ?
                            <Autocomplete onChange={(e, value) => {
                                if (value) {
                                    setTempUser({
                                        id: fullUsers[e.target.value].id,
                                        firstName: fullUsers[e.target.value].firstName,
                                        lastName: fullUsers[e.target.value].lastName,
                                        email: fullUsers[e.target.value].email,
                                        permissions: []
                                    })
                                } else {
                                    setTempUser({})
                                }
                            }} sx={{ mr: "auto", ml: "auto" }} options={acUsers} renderInput={(params) => <TextField autoComplete="off" placeholder="Enter email" {...params} sx={{ minWidth: "300px" }} />} />
                            : ""}
                        {tempUser.permissions ?
                            <>

                                <Divider sx={{ mt: 2, mb: 2 }} />
                                <Typography align="center" fontFamily="Poppins" variant="h6" sx={{ mb: 1 }}>Permissions</Typography>
                                <Grid container>
                                    <FormControlLabel control={<Checkbox checked={tempUser.permissions.all} onChange={(e) => {
                                        let perms = []
                                        if (e.target.checked) {
                                            Object.keys(permissions.instance).forEach(key => {
                                                Object.keys(permissions.instance[key]).forEach(key2 => {
                                                    permissions.instance[key][key2].forEach(permission => {
                                                        perms.push(permission)
                                                    })
                                                })
                                            })
                                        }
                                        setTempUser({ ...tempUser, permissions: perms })
                                    }} />} label="All Permissions" />
                                </Grid>
                                {Object.keys(permissions.instance).map(key => {
                                    return (
                                        <Accordion key={key} sx={{ mt: 1 }} expanded={userPanel == key} onChange={() => userPanel == key ? setUserPanel("") : setUserPanel(key)}>
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">{key[0].toUpperCase() + key.slice(1, key.length)}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container direction="column">
                                                    {Object.keys(permissions.instance[key]).map(key2 => {
                                                        return (
                                                            <>
                                                                <Typography fontWeight={600}>{key2[0].toUpperCase() + key2.slice(1, key2.length)}</Typography>
                                                                <Grid container>
                                                                    {permissions.instance[key][key2].map(yes => {
                                                                        return (
                                                                            <>
                                                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.includes(yes)} onChange={(e) => {
                                                                                    let perms = tempUser.permissions;
                                                                                    if (e.target.checked) {
                                                                                        perms.push(yes)
                                                                                    } else {
                                                                                        perms.splice(perms.indexOf(yes), 1)
                                                                                    }
                                                                                    setTempUser({ ...tempUser, permissions: perms })
                                                                                }} />} label={yes.split("-")[0].toUpperCase()[0] + yes.split("-")[0].slice(1, yes.split("-")[0].length) + " " + yes.split("-")[1].toUpperCase()[0] + yes.split("-")[1].slice(1, yes.split("-")[1].length)} />
                                                                            </>
                                                                        )
                                                                    })}

                                                                </Grid>
                                                            </>
                                                        )
                                                    })}


                                                </Grid>

                                            </AccordionDetails>

                                        </Accordion>
                                    )
                                })}
                            </>
                            : ""}
                    </DialogContent>
                    {tempUser.id ?
                        <DialogActions>
                            <Button variant="contained" color="info" onClick={() => {
                                setUsers([...users, tempUser]);
                                setTimeout(() => {
                                    setTempUser({});
                                }, 50)
                                setAddingUser(false)
                            }}>Add User</Button>
                        </DialogActions>
                        : ""}
                </Dialog>
                {users.map((user, index) => {
                    return (
                        <Paper key={user.id} sx={{ backgroundColor: "background.default", backgroundImage: "none", p: 1, mt: 2 }}>
                            <Grid container direction="row" sx={{ mt: 1, mb: 1 }}>
                                <Grid container direction="column" sx={{ ml: 3, mt: "auto", mb: "auto", mr: "auto", maxWidth: "30%" }}>
                                    <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                                    <Typography>{user.email}</Typography>
                                </Grid>
                                <Grid container direction="row" sx={{ mr: "auto", ml: 5, mt: 2, mb: 2, maxWidth: "55%" }}>
                                    {user.permissions.all ?
                                        <>
                                            <Grid container>
                                                <Typography noWrap sx={{ mr: "auto", mt: "auto", mb: "auto" }}>Full access</Typography>
                                                <Button onClick={() => {
                                                    let tempUsers = users;
                                                    tempUsers.splice(index, 1);
                                                    setUsers([]);
                                                    setTimeout(() => {
                                                        setUsers(tempUsers);
                                                        if (tempUsers.length == 0) {
                                                            setAddingUser(true);
                                                        }
                                                    }, 20)
                                                }} sx={{ ml: "auto", mt: "auto", mb: "auto" }} variant="contained" color="error">Remove</Button>
                                            </Grid>
                                        </>
                                        :
                                        <>
                                            <Grid container direction="column" sx={{ ml: 2, maxWidth: "40%" }}>
                                                {Object.keys(user.permissions.files).map((e) => {
                                                    return (
                                                        <Typography key={e}>{user.permissions.files[e] ? e + " files" : ""}</Typography>
                                                    )
                                                })
                                                }
                                            </Grid>
                                            <Button sx={{ ml: "auto", mt: "auto", mb: "auto" }} onClick={() => {
                                                let tempUsers = users;
                                                tempUsers.splice(index, 1);
                                                setUsers([]);
                                                setTimeout(() => {
                                                    setUsers(tempUsers);
                                                    if (tempUsers.length == 0) {
                                                        setAddingUser(true);
                                                    }
                                                }, 20)
                                            }} variant="contained" color="error">Remove</Button>
                                        </>
                                    }
                                </Grid>


                            </Grid>
                        </Paper>
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="info" onClick={() => {
                    setAddingUser(true)
                }}>Add User</Button>
                <Button variant="contained" color="success" onClick={() => setPage("deploy")}>Save and Deploy Instance</Button>
            </DialogActions>
        </Dialog>
    )
}