import { Checkbox, Grid, Paper, Typography, Button, List, ListItemText, ListItem, ListItemButton, Divider, Stack, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Tooltip, useMediaQuery } from "@mui/material"
import Footer from "../../../components/footer"
import Navigation from "../../../components/instance/Navigation"
import prisma from "../../../lib/prisma"
import { InstanceStore } from "../../../states/instance"
import { Delete, Edit, ExpandMore } from "@mui/icons-material";
import { useState } from "react"
import { useTheme } from "@emotion/react"

export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.authorization) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
    const instanceUsers = await prisma.instanceUser.findMany({
        where: {
            instanceId: query.id,
        },
        include: {
            permissions: true,
            user: true
        }
    })
    return {
        props: { users: instanceUsers }
    }
}

export default function Users({ users }) {
    const [selected, setSelected] = useState(0);
    const [permissionPanel, setPermissionPanel] = useState("files");
    return (
        <>
            <Grid container direction="row" sx={{ mb: 2 }}>
                <Grid container xs={3}>
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>Users</Typography>
                </Grid>
                <Grid container xs={4} sm={4} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                    <Button color="info" variant="contained" sx={{ ml: "auto" }}>Add User</Button>
                </Grid>
            </Grid>
            <Stack direction={useMediaQuery(useTheme().breakpoints.up("md")) ? "row" : "column"} divider={useMediaQuery(useTheme().breakpoints.up("md")) ? <Divider orientation="vertical" flexItem /> : ""} spacing={2}>
                <Grid container xs={12} sm={12} md={3}>
                    <List dense sx={{ backgroundColor: "background.paper", width: "100%" }}>
                        {users.map((user, index) => {
                            return (
                                <ListItem selected={selected == index} disablePadding key={user.user.id} secondaryAction={<Checkbox sx={{ ml: "auto" }} />}>
                                    <ListItemButton>
                                        <ListItemText primary={user.user.firstName + " " + user.user.lastName} secondary={user.user.email} />
                                        {/*
                        <Paper key={user.user.id} sx={{ mt: 1, pt: 1, pb: 1 }}>
                            <Grid container direction="row">
                                <Grid container xs={.6}>
                                    <Checkbox sx={{ mt: "auto", mb: "auto" }} />
                                </Grid>
                                <Grid container xs={3} sm={3} md={2} lg={3} xl={3} direction="column">
                                    <Typography variant="h6" noWrap sx={{ mt: "auto", mb: "auto" }}>{user.user.firstName} {user.user.lastName}</Typography>
                                    <Typography noWrap sx={{ mt: "auto", mb: "auto", color: "text.secondary" }}>{user.user.email}</Typography>
                                </Grid>
                                <Grid container xs={3} sm={3} md={3} lg={3} xl={1.5} sx={{ ml: "auto" }}>
                                    <Button variant="contained" color="error" sx={{ mr: 1, ml: "auto" }}><Delete /></Button>
                                    <Button variant="contained" color="warning" sx={{ mr: 2 }}><Edit /></Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        */}
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
                <Grid container xs={12} sm={12} md={9} direction="column">
                    <Divider sx={{ mb: 1.5 }} />
                    <Grid container direction="row">
                        <Grid container direction="column" xs={5}>
                            <Grid container direction="row">
                                {useMediaQuery(useTheme().breakpoints.up("md")) ?
                                    <Typography variant="h6">{users[selected].user.firstName} {users[selected].user.lastName}</Typography>
                                    : ""}
                                <Typography fontWeight={400} variant="h6" color="text.secondary" sx={{ mt: "auto", mb: "auto", ml: .8 }}>{users[selected].user.username}</Typography>
                            </Grid>
                            {useMediaQuery(useTheme().breakpoints.up("md")) ?

                                <Typography color="text.secondary">{users[selected].user.email}</Typography>
                                : ""}
                        </Grid>
                        <Grid container direction="row" xs={4} sx={{ ml: "auto" }}>
                            {useMediaQuery(useTheme().breakpoints.up("md")) ?

                                <Grid container direction="column" xs={5} sx={{ ml: "auto" }}>
                                    <Typography variant="h6" align="center">{users[selected].permissions.length}</Typography>
                                    <Typography align="center" sx={{ color: "text.secondary" }}>Permissions</Typography>
                                </Grid>
                                : ""}

                            <Grid container direction="column" xs={10} sm={10} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                                <Tooltip title="Delete User">
                                    <Button variant="contained" color="error"><Delete /></Button>
                                </Tooltip>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography variant="h6">Permissions</Typography>
                    <Accordion sx={{ mt: 2 }} expanded={permissionPanel == "files"}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">Files</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction="column">
                                <Typography fontWeight={600}>Read Permissions</Typography>
                                <Grid container>
                                    <FormControlLabel control={<Checkbox />} label="View Files" />
                                    <FormControlLabel control={<Checkbox />} label="Download Files" />
                                </Grid>
                                <Typography fontWeight={600}>Write Permissions</Typography>
                                <Grid container>
                                    <FormControlLabel control={<Checkbox />} label="Create Files" />
                                    <FormControlLabel control={<Checkbox />} label="Delete Files" />
                                    <FormControlLabel control={<Checkbox />} label="Edit Files" />
                                    <FormControlLabel control={<Checkbox />} label="Upload Files" />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Button variant="contained" color="success" sx={{ mt: 2 }}>Save</Button>
                </Grid>
            </Stack>
        </>
    )
}

Users.getLayout = (page) => {
    return (
        <InstanceStore.Provider>
            <Navigation page="users">
                {page}
                <Footer />
            </Navigation>
        </InstanceStore.Provider>
    )
}