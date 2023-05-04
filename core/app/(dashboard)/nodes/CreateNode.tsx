"use client";
import { useEffect, useState } from "react";
import {Dialog, DialogContent, DialogTitle, Divider, Typography, Stepper, Step, StepLabel, DialogActions, Button, Grid, TextField, CircularProgress, Grow} from "../../../components/base";
import cookie from "cookie";
import { Error } from "@mui/icons-material";
import Ansi2Html from "ansi-to-html"
import {useRouter} from "next/navigation";

export default function CreateNode() {

    const [creatingNode, setCreatingNode] = useState(false);

    let steps = ["Prerequisites", "SSH", "Installation", "Configuration"]
    const [currentStep, setCurrentStep] = useState(0);
    const [sshUsername, setSSHUsername] = useState("root")
    const [sshPassword, setSSHPassword] = useState("");
    const [sshAddress, setSSHAddress] = useState("")
    const [sshPort, setSSHPort] = useState("22");

    const [domain, setDomain] = useState("")
    const [port, setPort] = useState("443")
    const [ipAddress, setIpAddress] = useState("")
    const [locationId, setLocationId] = useState("")

    const [name, setName] = useState("")

    const [status, setStatus] = useState("Connecting");
    const [error, setError] = useState(null)
    const [currentLog, setCurrentLog] = useState("");

    const [webSocket, setWebSocket] = useState(null)

    const [configurationStage, setConfigurationStage] = useState(false);
    const AnsiToHtml = new Ansi2Html();

    const router = useRouter();
    async function installNode() {
        const websocket = new WebSocket("wss://" + window.location.host + "/api/v1/nodes/new");
        //@ts-ignore
        setWebSocket(websocket)
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
            if (data.event == "complete") {
                if (data.metadata = "Installation") setCurrentStep(3)
                if (data.metadata = "Configuration") router.refresh();
            }
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
        <>
        <Button onClick={() => setCreatingNode(true)} variant="contained" sx={{ml: "auto"}}>Create Node</Button>
        <Dialog open={creatingNode} fullWidth={true} onClose={() => {
            if(!(currentStep > 1)) {
                setCreatingNode(false)
            }
        }}>
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
                <div style={{backgroundColor: "black", borderRadius: 12, padding: 12,  textAlign: "center", marginTop: 8}} dangerouslySetInnerHTML={{__html: AnsiToHtml.toHtml(currentLog)}} />
                : ""}
                </Grid>
                : <Grid container direction="column">
                            <Error sx={{ mr: "auto", ml: "auto", fontSize: "70px", color: "#e85347", mb: 2 }} />
                            <Typography fontWeight="bold" textAlign={"center"} sx={{mr: "auto", ml: "auto", mt: 1}}>{error}</Typography>
                            <Typography textAlign="center">Please double check your information on the next screen.</Typography>
                    </Grid>}
                </>
                : ""}
                {
                    currentStep == 3 ?
                    <>
                    {configurationStage ?
                                    <Grid container direction="column">
                                    <CircularProgress sx={{mr: "auto", ml: "auto"}} />
                                    <Typography fontWeight="bold" textAlign={"center"} sx={{mr: "auto", ml: "auto", mt: 1}}>{status}</Typography>
                                    {currentLog.length > 1 ?
                <div style={{backgroundColor: "black", borderRadius: 12, padding: 12, textAlign: "center", marginTop: 8}} dangerouslySetInnerHTML={{__html: AnsiToHtml.toHtml(currentLog)}} />
                : ""}
                                    </Grid>
                    : 
                    <>
                                        <Typography sx={{mb: 2}} fontWeight="bold" fontSize={18} align="center">Listen</Typography>
                                        <Grid container >
                                        <Grid xs={6}>

                                        <Typography fontWeight={600} sx={{ mb: 1}}>Domain</Typography>
                    <TextField type="text" value={domain} onChange={(e) => setDomain(e.target.value)} variant="standard" placeholder="Domain" />
                    </Grid>
                    <Grid xs={2}>
                        <Typography fontWeight={600} sx={{ mb: 1}}>Port</Typography>
                    <TextField type="text" value={port} onChange={(e) => setPort(e.target.value)} variant="standard" placeholder="Port" />
                    </Grid>
                    </Grid>
                    <Typography sx={{mb: 2, mt: 2}} fontWeight="bold" fontSize={18} align="center">Connectivity</Typography>
                    <Typography fontWeight={600} sx={{ mb: 1}}>Accessible IP Address</Typography>
                    <TextField type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} variant="standard" placeholder="Accessible IP Address" />
                    <Typography sx={{mb: 2, mt: 2}} fontWeight="bold" fontSize={18} align="center">Identification</Typography>
                    <Grid container direction="row">
                        <Grid container direction="column">
                    <Typography fontWeight={600} sx={{ mb: 1}}>Name</Typography>
                    <TextField type="text" value={name} onChange={(e) => setName(e.target.value)} variant="standard" placeholder="Node Name" />
                    </Grid>
                    <Grid container direction="column">
                    <Typography fontWeight={600} sx={{ mb: 1}}>Location ID</Typography>
                    <TextField type="text" value={locationId} onChange={(e) => setLocationId(e.target.value)} variant="standard" placeholder="Location ID" />
                    </Grid>
                    </Grid>
                    </>
}
                    </>
                    
                    : ""
                }
            </DialogContent>
            <Divider />
            <DialogActions>
                <Grid container direction="row">
                    {currentStep == 0 ?
                    <Button sx={{ml: "auto", mr: 1}} variant="contained" color="error">Cancel</Button>
                    :                     <Button disabled={currentStep > 1} onClick={() => setCurrentStep(currentStep - 1)} sx={{ml: "auto", mr: 1}} variant="contained" color="error">Go Back</Button>}
                    <Button disabled={currentStep == 3 ? configurationStage : currentStep > 1} onClick={() => {
                        if (currentStep != 3) {
                        setCurrentStep(currentStep + 1)
                        } else {
                            //@ts-ignore
                            webSocket.send(JSON.stringify({
                                event: "sendConfiguration",
                                metadata: {
                               domain,
                               port,
                               ipAddress,
                               name,
                               location: locationId
                                }
                            })) 
                        setConfigurationStage(true)
                        }
                    }} variant="contained" color="info">Continue</Button>
                </Grid>
            </DialogActions>
        </Dialog>
        </>
    )
}