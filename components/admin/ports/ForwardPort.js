import { Grid, FormControl, TextField, Typography, Box, Select, MenuItem, Button, Autocomplete } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";

export default function ForwardPort(props) {
    console.log(props)
    const [description, setDescription] = useState(null)
    const [ports, setPorts] = useState(null)
    const [targetPorts, setTargetPorts] = useState(null)
    const [protocol, setProtocol] = useState("tcp")
    const [targetAddress, setTargetAddress] = useState(null)
    const [targetType, setTargetType] = useState("instance");
    const [instances, setInstances] = useState(null);

    useEffect(() => {
        console.log(props.instances)
        let tempInstances = [];
        props.instances.forEach(instance => {
            let tempInstance = {};
            tempInstance.label = instance.name;
            tempInstance.id = instance._id.toString();
            tempInstances.push(tempInstance);
        })
        console.log(tempInstances)
        setInstances(tempInstances);
    }, [props.instances])
    return (
        <>
            <Grid sx={{ p: 2 }} container md={12} xs={12} lg={12} direction="column">
                <FormControl sx={{ m: 2 }} variant="outlined">
                    <Grid container direction="row">
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Description</Typography>
                            <TextField value={description} onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }} placeholder="Web Server" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Listen Port(s)</Typography>
                            <TextField value={targetPorts} onChange={(e) => {
                                e.preventDefault();
                                setTargetPorts(e.target.value);
                            }} placeholder="80,81,8080-8090" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Target Port(s)</Typography>
                            <TextField value={ports} onChange={(e) => {
                                e.preventDefault();
                                setPorts(e.target.value);
                            }} placeholder="80,81,8080-8090" variant="outlined" />
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Protocol</Typography>
                            <Select value={protocol} onChange={(e) => {
                                e.preventDefault();
                                setProtocol(e.target.value);
                            }}>
                                <MenuItem value="tcp">TCP</MenuItem>
                                <MenuItem value="udp">UDP</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Target Type</Typography>
                            <Select value={targetType} onChange={(e) => setTargetType(e.target.value)}>
                                <MenuItem value="instance">Instance</MenuItem>
                                <MenuItem value="ip">IP</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Target</Typography>
                            {targetType == "instance" ?
                                <Autocomplete onChange={(e, newValue) => {
                                    if (newValue) {
                                        setTargetAddress(newValue.id)
                                    } else {
                                        setTargetAddress(null);
                                    }
                                }} disablePortal options={instances} renderInput={(params) => <TextField {...params} onChange={(e) => {
                                    e.preventDefault();
                                    setTargetAddress(e.target.value)
                                }} placeholder={targetType == "ip" ? "10.153.164.81" : "Instance"} variant="outlined" sx={{ minWidth: 300 }} />} />
                                : <TextField value={targetAddress} onChange={(e) => {
                                    e.preventDefault();
                                    setTargetAddress(e.target.value)
                                }} placeholder={targetType == "ip" ? "10.153.164.81" : "Instance"} variant="outlined" sx={{ minWidth: 300 }} />}
                        </Box>
                    </Grid>
                </FormControl>
                <Button variant="contained" color="success" sx={{ ml: 2, width: "10%" }} onClick={async () => {
                    var data = await axios.post(`/api/v1/admin/networks/${props.id}/ports`, {
                        ports: [
                            {
                                description: description,
                                target_address: targetAddress,
                                target_port: targetPorts,
                                protocol: protocol,
                                listen_port: ports
                            }
                        ],
                        target_type: targetType,
                        target: targetAddress
                    })
                    console.log(data)
                }}>Forward</Button>
            </Grid>
        </>
    )
}