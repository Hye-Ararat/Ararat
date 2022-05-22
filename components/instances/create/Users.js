import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

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
                                        permissions: {
                                            all: true,
                                            files: {
                                                view: false,
                                                download: false,
                                                create: false,
                                                delete: false,
                                                edit: false,
                                                upload: false
                                            },
                                        }
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
                                        setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, all: e.target.checked } })
                                    }} />} label="All Permissions" />
                                </Grid>
                                <Accordion sx={{ mt: 1 }} expanded={userPanel == "files"} onChange={() => userPanel == "files" ? setUserPanel("") : setUserPanel("files")}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">Files</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container direction="column">
                                            <Typography fontWeight={600}>Read Permissions</Typography>
                                            <Grid container>
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.view || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, view: e.target.checked } } })} />} label="View Files" />
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.download || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, download: e.target.checked } } })} />} label="Download Files" />
                                            </Grid>
                                            <Typography fontWeight={600}>Write Permissions</Typography>
                                            <Grid container>
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.create || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, create: e.target.checked } } })} />} label="Create Files" />
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.delete || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, delete: e.target.checked } } })} />} label="Delete Files" />
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.edit || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, edit: e.target.checked } } })} />} label="Edit Files" />
                                                <FormControlLabel control={<Checkbox checked={tempUser.permissions.files.upload || tempUser.permissions.all} onChange={(e) => setTempUser({ ...tempUser, permissions: { ...tempUser.permissions, files: { ...tempUser.permissions.files, upload: e.target.checked } } })} />} label="Upload Files" />
                                            </Grid>

                                        </Grid>

                                    </AccordionDetails>

                                </Accordion>
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