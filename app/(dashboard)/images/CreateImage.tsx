"use client";
import { useState } from "react";
import {Button, Dialog, DialogContent, DialogTitle, Divider, Typography, Grid} from "../../../components/base";

export default function CreateImage() {
    const [creatingImage, setCreatingImage] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <>
                <Button onClick={() => setCreatingImage(true)} variant="contained" sx={{ml: "auto"}}>Create Image</Button>
                <Dialog open={creatingImage} fullWidth={true} onClose={() => {
                    if (!(currentStep > 0)) {
                        setCreatingImage(false);
                    }
                }}>
                    <DialogTitle>
                    <Typography variant="h6" align="center" fontFamily="Poppins" fontWeight="bold">Create Image</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {currentStep == 0 ? 
                                <>
                <Typography fontWeight="bold" fontSize={18} align="center" sx={{mb: 2}}>How would you like to create this image?</Typography>
                <Grid container direction="row">
                    <Button color="info" sx={{m: "auto", width: "200px", height: "50px", fontSize: 16}} variant="contained">Import Image</Button>
                    
                    <Button color="success" sx={{m: "auto", width: "200px", height: "50px", fontSize: 16}} variant="contained">Create New</Button>
                </Grid>
                                </>
                             : ""}
                    </DialogContent>

                </Dialog>
        </>
    )
}
