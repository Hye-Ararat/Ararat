import { Grid, FormControl, Box, Typography, TextField, Button, Checkbox, Select, MenuItem, Paper } from "@mui/material"
import axios from "axios"
import { useState } from "react"
export default function CreateNetwork({ node }) {
    const [ipv4, setIpv4] = useState(null);
    const [ipv6, setIpv6] = useState(null);
    const [ip_alias, setIpAlias] = useState(null);
    const [name, setName] = useState(null);
    const [error, setError] = useState(null);
    const [tunnel, setTunnel] = useState(false);
    const [primaryNetwork, setPrimaryNetwork] = useState(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [protocol, setProtocol] = useState("gre");
    return (
        <Grid sx={{ p: 2 }} item container md={12} xs={12} lg={12} direction="column">
            {error ? error : ""}
            <FormControl sx={{ m: 2 }} variant="outlined">
                <Grid container direction="row">
                    <Box sx={{ mr: 3, mb: 2 }}>
                        <Typography fontWeight="bold">Name</Typography>
                        <TextField placeholder="Example Network" value={name} variant="outlined" onChange={(e) => setName(e.target.value)}></TextField>
                    </Box>
                    <Box sx={{ mr: 3, mb: 2 }}>
                        <Typography fontWeight="bold">Remote Network</Typography>
                        <Checkbox checked={tunnel} onChange={() => {
                            setTunnel(!tunnel)
                        }} />
                    </Box>
                    {tunnel ?
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Is Primary Network</Typography>
                            <Checkbox checked={isPrimary} onChange={() => {
                                setIsPrimary(!isPrimary)
                            }} />
                        </Box>
                        : ""}
                    {tunnel && !isPrimary ? <Box sx={{ mr: 3, mb: 2 }}>
                        <Typography fontWeight="bold">Remote Network</Typography>
                        <TextField placeholder="Network ID" value={primaryNetwork} variant="outlined" onChange={(e) => setPrimaryNetwork(e.target.value)}></TextField>
                    </Box> : ""
                    }
                    {tunnel && isPrimary ?
                        <Box sx={{ mr: 3, mb: 2 }}>
                            <Typography fontWeight="bold">Protocol</Typography>
                            <Select value={protocol}>
                                <MenuItem value="gre">GRE</MenuItem>
                            </Select>
                        </Box>
                        : ""}
                    <Box sx={{ mr: 3 }}>
                        <Typography fontWeight="bold">{isPrimary || !tunnel ? "IPv4" : "Local IPv4"}</Typography>
                        <TextField placeholder="192.0.2.146" variant="outlined" value={ipv4} onChange={(e) => setIpv4(e.target.value)}></TextField>
                    </Box>

                    {!tunnel ? <Box sx={{ mr: 3 }}>
                        <Typography fontWeight="bold">IPv6</Typography>
                        <TextField placeholder="2001:0db8:85a3:0000:0000:8a2e:0370:7334" variant="outlined" value={ipv6} onChange={(e) => setIpv6(e.target.value)}></TextField>
                    </Box> : ""}
                    <Box sx={{ mr: 3 }}>
                        <Typography fontWeight="bold">IP Alias</Typography>
                        <TextField placeholder="example.hye.gg" variant="outlined" value={ip_alias} onChange={(e) => setIpAlias(e.target.value)}></TextField>
                    </Box>
                </Grid>
            </FormControl>
            <Button variant="contained" color="success" sx={{ width: "10%", ml: 2 }} onClick={async () => {
                try {
                    await axios.post("/api/v1/admin/networks", {
                        name: name,
                        node: node,
                        address: {
                            ipv4: ipv4,
                            ipv6: ipv6,
                            ip_alias: ip_alias
                        },
                        remote: {
                            remote: tunnel,
                            primary: isPrimary,
                            protocol: protocol,
                            primaryNetwork: primaryNetwork
                        }
                    })
                } catch (err) {
                    console.log(err)
                    setError(err.response.data.error)
                    return;
                } finally {
                    window.location.reload();
                }
            }}>Create</Button>
        </Grid>
    )
}