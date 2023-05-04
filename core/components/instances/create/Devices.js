import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Devices({ devices, setDevices, node, setPage, nodeData }) {
    const [panel, setPanel] = useState("disks");
    const [creatingDisk, setCreatingDisk] = useState(false);
    const [creatingNetwork, setCreatingNetwork] = useState(false);

    const [pools, setPools] = useState([]);
    const [networks, setNetworks] = useState([]);

    const [tempDiskName, setTempDiskName] = useState("");
    const [tempDiskPath, setTempDiskPath] = useState("/")
    const [tempDiskSize, setTempDiskSize] = useState("");
    const [tempDiskPool, setTempDiskPool] = useState("default");
    const [tempNetwork, setTempNetwork] = useState(null);
    const [netIndex, setNetIndex] = useState(0);

    useEffect(() => {
        axios.get(`${nodeData.url}/api/v1/storage_pools`).then(res => {
            let tempPools = [];
            res.data.metadata.forEach(pool => {
                tempPools.push({
                    label: pool.name,
                    value: pool.name
                })
            })
            setPools(tempPools)
            console.log(tempPools)
        })
        axios.get(`${nodeData.url}/api/v1/networks`).then(res => {
            let tempNetworks = [];
            res.data.metadata.forEach(network => {
                tempNetworks.push({
                    label: network.name,
                    value: network.name
                })
            })
            setNetworks(tempNetworks)
            console.log(tempNetworks)
        })
    }, [])
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" fontFamily="Poppins" align="center">Devices</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 600 }}>
                <Accordion expanded={panel == "disks"} onChange={() => panel == "disks" ? setPanel("") : setPanel("disks")}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">Disks</Typography>
                        <Typography sx={{ ml: 1, mt: .6, mb: "auto", color: "text.secondary" }}>{Object.keys(devices).filter((device) => devices[device].type == "disk").length != 0 ? Object.keys(devices).filter((device) => devices[device].type == "disk").length > 1 ? Object.keys(devices).filter((device) => devices[device].type == "disk").length + " Disks" : 1 + " Disk" : "No Disks"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Dialog open={creatingDisk}>
                            <DialogTitle>
                                <Typography variant="h6" fontFamily="Poppins" align="center">Add Disk</Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Grid container direction="row">
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Name</Typography>
                                    <TextField onChange={(e) => setTempDiskName(e.target.value)} variant="standard" placeholder="root" value={tempDiskName} sx={{ ml: "auto", mb: "auto" }} />
                                </Grid>
                                <Grid container direction="row" sx={{ mt: 2 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Path</Typography>
                                    <TextField onChange={(e) => setTempDiskPath(e.target.value)} variant="standard" value={tempDiskPath} sx={{ ml: "auto", mb: "auto" }} />
                                </Grid>
                                <Grid container direction="row" sx={{ mt: 2 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Pool</Typography>
                                    {pools.length > 0 ?
                                        <Autocomplete sx={{ mb: "auto", ml: "auto" }} onChange={(e, value) => setTempDiskPool(value.value)} value={tempDiskPool} options={pools} renderInput={(params) => <TextField {...params} variant="standard" placeholder="default" sx={{ width: "248px" }} />} />
                                        : ""}
                                </Grid>
                                <Grid container direction="row" sx={{ mt: 2 }}>
                                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Size</Typography>
                                    <TextField onChange={(e) => setTempDiskSize(e.target.value)} variant="standard" value={tempDiskSize} sx={{ ml: "auto", mb: "auto" }} placeholder="Leave blank for unmetered" />
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setCreatingDisk(false)} variant="contained" color="error">Cancel</Button>
                                <Button onClick={() => {
                                    let tempDevs = devices;
                                    setDevices({})
                                    setTimeout(() => {
                                        setDevices({ ...tempDevs, [tempDiskName]: { type: "disk", pool: tempDiskPool, size: tempDiskSize, path: tempDiskPath } });
                                        setTempDiskSize("");
                                        setTempDiskPool("default");
                                        setTempDiskName("");
                                        setCreatingDisk(false)
                                    }, 100)
                                }
                                } variant="contained" color="success">Add</Button>
                            </DialogActions>
                        </Dialog>
                        {Object.keys(devices).filter((device) => devices[device].type == "disk").length == 0 ?
                            <Typography variant="body1" align="center" fontWeight={500}>No Disks. Try adding one.</Typography>
                            : ""}
                        {Object.keys(devices).map((device, index) => {
                            if (devices[device].type == "disk") {
                                return (
                                    <Paper key={device} sx={{ backgroundColor: "background.default", backgroundImage: "none" }}>
                                        <Grid container direction="row" sx={{ mt: 1 }}>
                                            <Grid container direction="column" sx={{ ml: 2, mt: 2, mb: 2, mr: "auto", maxWidth: "50%" }}>
                                                <Typography variant="h6">{device.charAt(0).toUpperCase() + device.slice(1)}</Typography>
                                                <Typography>Path: {devices[device].path}</Typography>
                                                <Typography>Pool: {devices[device].pool}</Typography>
                                                <Typography>Size: {devices[device].size ? devices[device].size : "unmetered"}</Typography>
                                            </Grid>
                                            <Button sx={{ ml: "auto", mt: "auto", mb: "auto", mr: 2 }} variant="contained" color="error" onClick={() => {
                                                let tempDevices = devices;
                                                delete tempDevices[device];
                                                setDevices({});
                                                setTimeout(() => {
                                                    setDevices(tempDevices);

                                                }, 100)
                                                setCreatingDisk(true);
                                                setCreatingDisk(false);
                                            }}>Remove</Button>
                                        </Grid>
                                    </Paper>
                                )
                            }
                        })}
                    </AccordionDetails>
                    <AccordionActions>
                        <Button onClick={() => setCreatingDisk(true)} variant="contained" color="success">Add Disk</Button>
                    </AccordionActions>
                </Accordion>
                <Accordion expanded={panel == "networks"} onChange={() => panel == "networks" ? setPanel("") : setPanel("networks")}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6" fontFamily="Poppins">Networks</Typography>
                        <Typography sx={{ ml: 1, mt: .6, mb: "auto", color: "text.secondary" }}>{Object.keys(devices).filter((device) => devices[device].type == "nic").length != 0 ? Object.keys(devices).filter((device) => devices[device].type == "nic").length > 1 ? Object.keys(devices).filter((device) => devices[device].type == "nic").length + " Networks" : 1 + " Network" : "No Networks"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Dialog open={creatingNetwork}>
                            <DialogTitle>
                                <Typography variant="h6" align="center">Attach Network</Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Typography align="center">Select the network you would like to attach:</Typography>
                                <Grid container sx={{ mt: 2 }}>
                                    {Object.keys(networks).length > 0 ?
                                        <Autocomplete sx={{ mr: "auto", ml: "auto" }} onChange={(e, value) => {
                                            let tempDevices = devices;
                                            setDevices({});
                                            setTimeout(() => {
                                                setDevices({ ...tempDevices, ["eth" + netIndex]: { type: "nic", network: value.value } });
                                                setNetIndex(netIndex + 1);
                                                setCreatingNetwork(false);
                                            }, 30)
                                        }} options={networks} renderInput={(params) => <TextField {...params} placeholder="Select Network" sx={{ width: "248px" }} />} />
                                        : ""}
                                </Grid>
                            </DialogContent>
                        </Dialog>
                        {Object.keys(devices).filter((device) => devices[device].type == "nic").length == 0 ?
                            <Typography align="center" fontWeight={500} variant="body1">This instance will not have internet access without a network.</Typography>
                            : ""}
                        {Object.keys(devices).map((device, index) => {
                            if (devices[device].type == "nic") {
                                console.log(devices[device])
                                return (
                                    <Paper key={device} sx={{ backgroundColor: "background.default", backgroundImage: "none" }}>
                                        <Grid container direction="row" sx={{ mt: 1 }}>
                                            <Grid container direction="column" sx={{ ml: 2, mt: 2, mb: 2, mr: "auto", maxWidth: "50%" }}>
                                                <Typography variant="h6">{devices[device].network}</Typography>
                                            </Grid>
                                            <Button sx={{ ml: "auto", mt: "auto", mb: "auto", mr: 2 }} variant="contained" color="error" onClick={() => {
                                                let tempDevices = devices;
                                                delete tempDevices[device];
                                                setDevices({});
                                                setTimeout(() => {
                                                    setDevices(tempDevices);

                                                }, 100)
                                                setCreatingDisk(true);
                                                setCreatingDisk(false);
                                            }}>Remove</Button>
                                        </Grid>
                                    </Paper>
                                )
                            }
                        })}
                    </AccordionDetails>
                    <AccordionActions>
                        <Button variant="contained" color="success" onClick={() => setCreatingNetwork(true)}>Add Network</Button>
                    </AccordionActions>
                </Accordion>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPage("identity")} variant="contained" color="info">Continue</Button>
            </DialogActions>
        </Dialog >
    )
}