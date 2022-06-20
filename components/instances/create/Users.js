import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import permissions from "../../../lib/permissions.json";
import AddUserDialog from "../../addUserDialog";

export default function Users({ setPage, setUsers, users }) {
    const [acUsers, setacUsers] = useState(null);
    const [fullUsers, setFullUsers] = useState(null);
    const [addingUser, setAddingUser] = useState(true);
    const [tempUser, setTempUser] = useState({});
    const [userPanel, setUserPanel] = useState("files");
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (user) {
            console.log(user)
            setAddingUser(false)
            setUsers([...users, user])
        }
    }, [user])
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" fontFamily="Poppins" align="center">Users</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 600 }}>
                <AddUserDialog open={addingUser} permSection="instance" userState={setUser} />
                {users.map((user, index) => {
                    return (
                        <Paper key={user.id} sx={{ backgroundColor: "background.default", backgroundImage: "none", p: 1, mt: 2 }}>
                            <Grid container direction="row" sx={{ mt: 1, mb: 1 }}>
                                <Grid container direction="column" sx={{ ml: 3, mt: "auto", mb: "auto", mr: "auto", maxWidth: "30%" }}>
                                    <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                                    <Typography>{user.email}</Typography>
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