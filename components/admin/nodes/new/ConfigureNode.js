import { Grid, Paper, Typography, Divider, FormControl, Box, TextField, Switch, Button } from "@mui/material"
import { useState } from "react"

export default function ConfigureNode(props) {
    const [name, setName] = useState("");
    const [group, setGroup] = useState("");
    const [hostname, setHostname] = useState("");
    const [port, setPort] = useState("");
    const [ssl, setSSL] = useState(false);
    const [cpu, setCPU] = useState("");
    const [memory, setMemory] = useState("");
    const [disk, setDisk] = useState("");
    return (
        <>
            <Grid container direction="row">
                <Paper sx={{ mt: 1, width: "100%" }}>
                    <Typography variant="h6" sx={{ ml: 2, mt: 2, mb: 1 }}>Identification</Typography>
                    <Divider />
                    <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <Grid container direction="row">
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">Name</Typography>
                                    <TextField onChange={(e) => {
                                        e.preventDefault();
                                        setName(e.target.value);
                                    }} placeholder="Name" variant="outlined" />
                                </Box>
                                <Box sx={{ mr: 3 }}>
                                    <Typography fontWeight="bold">Group (Coming Soon)</Typography>
                                    <TextField onChange={(e) => {
                                        e.preventDefault();
                                        setGroup(e.target.value);
                                    }} variant="outlined" placeholder="Group" />
                                </Box>
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Typography variant="h6" sx={{ ml: 2, mb: 1 }}>Connectivity</Typography>
                    <Divider />

                    <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <Grid container direction="row">
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">Hostname</Typography>
                                    <TextField placeholder="examplenode.hye.gg" variant="outlined" />
                                </Box>
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">Port</Typography>
                                    <TextField placeholder="3434" variant="outlined" />
                                </Box>
                                <Box sx={{ mr: 3 }}>
                                    <Typography fontWeight="bold">SSL</Typography>
                                    <Switch></Switch>
                                </Box>
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Typography variant="h6" sx={{ ml: 2, mb: 1 }}>Configuration</Typography>
                    <Divider />
                    <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <Grid container direction="row">
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">CPU</Typography>
                                    <TextField placeholder="4" variant="outlined" />
                                </Box>
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">Memory</Typography>
                                    <TextField placeholder="2048" variant="outlined" />
                                </Box>
                                <Box sx={{ mr: 3, mb: 2 }}>
                                    <Typography fontWeight="bold">Disk</Typography>
                                    <TextField placeholder="5000" variant="outlined" />
                                </Box>
                            </Grid>
                        </FormControl>
                    </Grid>
                </Paper>
            </Grid>
        </>
    )
}