import { Accordion, AccordionSummary, Button, Grid, MenuItem, Select, TextField, Typography, Divider } from "../../../../components/base"
import { ExpandMore } from "@mui/icons-material";
import {useState} from "react";

export default function Networks({networks, instanceNetworks, setInstanceNetworks, setStep}) {
    const [update, setUpdate] = useState(false);
    return (
        <>
        <Typography variant="h6" sx={{mb: 1}}>Networks</Typography>
        {instanceNetworks.map((network) => {
            return (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <TextField placeholder="Interface Name" value={network.name} disabled={network.profile} onChange={(e) => {
                            let newInstanceNetworks = instanceNetworks;
                            newInstanceNetworks.forEach((net, index) => {
                                if (net.name == network.name) {
                                    newInstanceNetworks[index].name = e.target.value;
                                }
                            })
                            setInstanceNetworks(newInstanceNetworks);
                            setUpdate(!update)
                        }} />
                    </AccordionSummary>
                                            <Grid container direction="column" sx={{px: 2, mb: 2}}>
                            <Typography>Network</Typography>
                            <Select disabled={network.profile} size="small" value={network.network}>
                                {networks.map((net) => {
                                    return (
                                        <MenuItem value={net.name} onClick={() => {
                                            let newInstanceNetworks = instanceNetworks;
                                            newInstanceNetworks.forEach((net, index) => {
                                                if (net.name == network.name) {
                                                    newInstanceNetworks[index].network = net.name;
                                                }
                                            })
                                            setInstanceNetworks(newInstanceNetworks);
                                            setUpdate(!update)
                                        }}>{net.name}</MenuItem>
                                    )
                                })}
                            </Select>
                                                        <Divider sx={{ mt: 2, mb: 2 }} />
                                                        <Button variant="contained" color="error" sx={{ml: "auto"}} disabled={network.profile} onClick={() => {
                                                            let newInstanceNetworks = instanceNetworks;
                                                            newInstanceNetworks.forEach((net, index) => {
                                                                if (net.name == network.name) {
                                                                    newInstanceNetworks.splice(index, 1);
                                                                }
                                                            })
                                                            setInstanceNetworks(newInstanceNetworks);
                                                            setUpdate(!update)
                                                        }}>
                                                            Remove Network
                                                        </Button>
                        </Grid>
                </Accordion>
            )
        })}
        <Grid container sx={{mt: 2}}>
            <Button sx={{ml: "auto"}} variant="contained" color="success" onClick={() => {
                let newInstanceNetworks = instanceNetworks;
                newInstanceNetworks.push({
                    profile: false
                })
                setInstanceNetworks(newInstanceNetworks);
                setUpdate(!update)
            }}>Add Network</Button>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Grid container>
                                                <Button sx={{mr: "auto"}} onClick={() => setStep("storage")} variant="contained" color="info">Back</Button>
                    <Button sx={{ml: "auto"}} onClick={() => setStep("resourceLimits")} sx={{ml: "auto"}} variant="contained" color="info">Next</Button>
                    </Grid>
        </>
    )
}