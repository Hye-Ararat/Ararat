"use client";
import { useEffect, useState } from "react";
import {Dialog, DialogContent, DialogTitle, Divider, Typography, Stepper, Step, StepLabel, DialogActions, Button, Grid, TextField, CircularProgress} from "../../../components/base";
import cookie from "cookie";
import { Error } from "@mui/icons-material";

export default function CreateNode() {

    let steps = ["Prerequisites", "SSH", "Installation", "Configuration"]
    const [currentStep, setCurrentStep] = useState(0);
    const [sshUsername, setSSHUsername] = useState("root")
    const [sshPassword, setSSHPassword] = useState("");
    const [sshAddress, setSSHAddress] = useState("")
    const [sshPort, setSSHPort] = useState("22");

    const [status, setStatus] = useState("Connecting");
    const [error, setError] = useState(null)
    const [currentLog, setCurrentLog] = useState("");

    async function installNode() {
        const websocket = new WebSocket("wss://" + window.location.host + "/api/v1/nodes/new");
        websocket.onopen = () => {
            websocket.send(JSON.stringify({
                event: "sendCredentials",
                metadata: {
                sshUsername,
                sshPassword, 
                sshAddress,
                sshPort
                }
            }))
        }
        websocket.addEventListener("message", (event) => {
            console.log(event.data)
            let data = JSON.parse(event.data);
            if (data.event == "status") setStatus(data.metadata);
            if (data.event == "error"){
                 setError(data.metadata); 
                 websocket.close()
            }
            if (data.event == "log") setCurrentLog(data.metadata);
        })
    }

    useEffect(() => {
        if (currentStep == 2) {
            installNode();
        }
    }, [currentStep])

    useEffect(() => {
        if (error) {
           setTimeout(() => {
            setError(null);
            setCurrentStep(currentStep - 1);
           }, 6000)
        }
    }, [error])
    return (
        <Dialog open={true} fullWidth={true}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="Poppins" fontWeight="bold">Create Node</Typography>
            </DialogTitle>
            <Stepper sx={{mb: 3, mr: 3, ml: 3}} activeStep={currentStep}>
                    {steps.map((label) => {
                        return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        )
                    })}
                </Stepper>
            <Divider />
            <DialogContent>
                {currentStep == 0?
                <>
                <Typography fontWeight="bold" fontSize={18} align="center" sx={{mb: 2}}>Prerequisites</Typography>
                <Typography fontWeight={500} sx={{mb: 1}}>Hello! Thanks for choosing Hye Ararat!</Typography>
                <Typography fontWeight={500} sx={{mb: 1}}>Hye Ararat will automatically be installed on your node through SSH. Please make sure you have a system ready which meets the following prerequisites.</Typography>
                <Typography variant="h6">Prerequisites</Typography>
                <ul style={{marginTop: -2}}>
                    <li><Typography fontWeight={500}>SSH with username/password authentication enabled</Typography></li>
                    <li><Typography fontWeight={500}>A user with superuser permissions</Typography></li>
                    <li><Typography fontWeight={500}>Ubuntu 20.04+</Typography></li>
                </ul>
                </>
                : ""}
                {
                    currentStep == 1? 
                    <>
                    <Typography fontWeight="bold" fontSize={18} align="center">SSH Connection</Typography>
                    <Grid container direction="row">
                        <Typography sx={{m: "auto"}} variant="h6">ssh</Typography>
                         <TextField value={sshUsername} onChange={(e) => setSSHUsername(e.target.value)} spellCheck={false} sx={{m: "auto", maxWidth: "150px"}} variant="standard" placeholder="Username" />  
                         <Typography sx={{m: "auto"}} variant="h6">@</Typography>
                         <TextField value={sshAddress} onChange={(e) => setSSHAddress(e.target.value)} spellCheck={false} sx={{m: "auto", maxWidth: "150px"}} variant="standard" placeholder="Address" />
                         <Typography sx={{m: "auto"}} variant="h6">-p</Typography>
                         <TextField onChange={(e) => setSSHPort(e.target.value)} value={sshPort} spellCheck={false} sx={{m: "auto", maxWidth: "80px"}} variant="standard" placeholder="Port" />
                    </Grid>
                    <Typography fontWeight="bold" fontSize={18} align="center" sx={{ mt: 2}}>Authentication</Typography>
                    <Typography fontWeight={600} sx={{ mb: 1}}>Password</Typography>
                    <Grid container>
                    <TextField type="password" onChange={(e) => setSSHPassword(e.target.value)} variant="standard" placeholder="Password" />
                    </Grid>
                    </>
                    : ""
                }
                {currentStep == 2 ? 
                <>
                {!error ?
                <Grid container direction="column">
                <CircularProgress sx={{mr: "auto", ml: "auto"}} />
                <Typography fontWeight="bold" textAlign={"center"} sx={{mr: "auto", ml: "auto", mt: 1}}>{status}</Typography>
                {currentLog.length > 1 ?
                <Typography fontWeight="bold" textAlign={"center"} sx={{mr: "auto", ml: "auto", mt: 1, backgroundColor: "black", padding: 1, borderRadius: 2, fontFamily: "monospace"}}>{currentLog}</Typography>
                : ""}
                </Grid>
                : <Grid container direction="column">
                            <Error sx={{ mr: "auto", ml: "auto", fontSize: "70px", color: "#e85347", mb: 2 }} />
                            <Typography fontWeight="bold" textAlign={"center"} sx={{mr: "auto", ml: "auto", mt: 1}}>{error}</Typography>
                            <Typography textAlign="center">Please double check your information on the next screen.</Typography>
                    </Grid>}
                </>
                : ""}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Grid container direction="row">
                    {currentStep == 0 ?
                    <Button sx={{ml: "auto", mr: 1}} variant="contained" color="error">Cancel</Button>
                    :                     <Button disabled={currentStep > 1} onClick={() => setCurrentStep(currentStep - 1)} sx={{ml: "auto", mr: 1}} variant="contained" color="error">Go Back</Button>}
                    <Button disabled={currentStep > 1} onClick={() => setCurrentStep(currentStep + 1)} variant="contained" color="info">Continue</Button>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}