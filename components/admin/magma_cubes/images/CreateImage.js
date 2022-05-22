import { Grid, FormControl, TextField, Typography, Box, Select, MenuItem, Button } from "@mui/material"
import axios from "axios";
import { useState } from "react";

export default function CreateImage(props) {
    const [name, setName] = useState(null)
    const [stateless, setStateless] = useState(false)
    const [amd64, setAmd64] = useState(null);
    const [arm64, setArm64] = useState(null);
    const [entrypoint, setEntrypoint] = useState(null);
    const [type, setType] = useState("n-vps");
    const [imageServer, setImageServer] = useState(null);
    const [console, setConsole] = useState("xterm");
    return (
        <>
            <Grid sx={{ p: 2 }} container md={12} xs={12} lg={12} direction="column">
                <FormControl sx={{ m: 2 }} variant="outlined">
                    <Grid container direction="row">
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Name</Typography>
                            <TextField value={name} onChange={(e) => {
                                e.preventDefault();
                                setName(e.target.value);
                            }} placeholder="Name" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Stateless</Typography>
                            <TextField value={stateless} onChange={(e) => {
                                e.preventDefault();
                                setStateless(e.target.value);
                            }} placeholder="Stateless" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">amd64</Typography>
                            <TextField value={amd64} onChange={(e) => {
                                e.preventDefault();
                                setAmd64(e.target.value);
                            }} placeholder="amd64" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">arm64</Typography>
                            <TextField value={arm64} onChange={(e) => {
                                e.preventDefault();
                                setArm64(e.target.value);
                            }} placeholder="arm64" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">entrypoint</Typography>
                            <TextField value={entrypoint} onChange={(e) => {
                                e.preventDefault();
                                setEntrypoint(e.target.value);
                            }} placeholder="entrypoint" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">type</Typography>
                            <TextField value={type} onChange={(e) => {
                                e.preventDefault();
                                setType(e.target.value);
                            }} placeholder="type" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">image server</Typography>
                            <TextField value={imageServer} onChange={(e) => {
                                e.preventDefault();
                                setImageServer(e.target.value);
                            }} placeholder="Image Server ID" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">console</Typography>
                            <TextField value={console} onChange={(e) => {
                                e.preventDefault();
                                setConsole(e.target.value);
                            }} placeholder="console" variant="outlined" />
                        </Box>
                    </Grid>
                </FormControl>
                <Button variant="contained" color="success" sx={{ ml: 2, width: "10%" }} onClick={async () => {
                    var data = await axios.post(`/api/v1/admin/magma_cubes/${props.cubeID}/images`, {
                        name: name,
                        stateless: stateless,
                        amd64: amd64,
                        arm64: arm64,
                        entrypoint: entrypoint,
                        type: type,
                        imageServer: imageServer,
                        console: console
                    });
                }}>Create</Button>
            </Grid>
        </>
    )
}