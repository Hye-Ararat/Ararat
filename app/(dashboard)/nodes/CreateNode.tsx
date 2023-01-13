"use client";
import { useState } from "react";
import {Dialog, DialogContent, DialogTitle, Divider, Typography, Stepper, Step, StepLabel, DialogActions, Button, Grid, TextField} from "../../../components/base";

export default function CreateNode() {
    let steps = ["Prerequisites", "SSH", "Installation", "Configuration"]
    const [currentStep, setCurrentStep] = useState(0);
    const [sshUsername, setSSHUsername] = useState("root")
    const [sshPassword, setSSHPassword] = useState("");
    const [sshAddress, setSSHAddress] = useState("")
    const [sshPort, setSSHPort] = useState("22");

    return (
        <Dialog open={true}>
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
                    <Typography fontWeight="bold" fontSize={18} align="center" sx={{mb: 2}}>SSH Connection</Typography>
                    <Grid container direction="row">
                        <Typography sx={{m: "auto"}} variant="h6">ssh</Typography>
                         <TextField spellCheck={false} sx={{m: "auto", maxWidth: "150px"}} variant="standard" placeholder="Username" />  
                         <Typography sx={{m: "auto"}} variant="h6">@</Typography>
                         <TextField spellCheck={false} sx={{m: "auto", maxWidth: "150px"}} variant="standard" placeholder="Address" />
                         <Typography sx={{m: "auto"}} variant="h6">-p</Typography>
                         <TextField onChange={(e) => setSSHPort(e.target.value)} value={sshPort} spellCheck={false} sx={{m: "auto", maxWidth: "80px"}} variant="standard" placeholder="Port" />
                    </Grid>
                    <Typography fontWeight="bold" fontSize={18} align="center" sx={{ mt: 2}}>Authentication</Typography>
                    <Typography fontWeight={600} sx={{ mb: 1}}>Password</Typography>
                    <Grid container>
                    <TextField variant="standard" placeholder="Password" />
                    </Grid>
                    </>
                    : ""
                }
            </DialogContent>
            <Divider />
            <DialogActions>
                <Grid container direction="row">
                    {currentStep == 0 ?
                    <Button sx={{ml: "auto", mr: 1}} variant="contained" color="error">Cancel</Button>
                    :                     <Button onClick={() => setCurrentStep(currentStep - 1)} sx={{ml: "auto", mr: 1}} variant="contained" color="error">Go Back</Button>}
                    <Button onClick={() => setCurrentStep(currentStep + 1)} variant="contained" color="info">Continue</Button>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}