import { Badge, CardActionArea, Dialog, DialogContent, DialogTitle, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

export default function SelectType({ imageData, setType, setPage }) {
    useEffect(() => {
        console.log(imageData)
        if (imageData.type == "N-VPS") {
            setType("N-VPS");
            setPage("resources");
        }
        if (imageData.type == "Virtual Machine") {
            setType("Virtual Machine");
            setPage("resources");
        }
        if (imageData.type == "Stateless N-VPS") {
            setType("Stateless N-VPS");
            setPage("statelessConf")
        }
    }, [])
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography align="center" variant="h6" fontFamily={"Poppins"}>What Type Do You Want To Use?</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <CardActionArea onClick={() => {
                        setType("N-VPS");
                        setPage("resources");
                    }} sx={{ maxWidth: "45%", mr: "auto", ml: "auto", maxWidth: "45%", borderRadius: 2, height: "90%" }}>
                        <Paper sx={{ p: 2, height: "100%" }}>

                            <Grid direction="row">
                                <Typography variant="h6" align="center">N-VPS</Typography>
                            </Grid>
                            <Grid container direction="column">
                                <Typography align="center">Efficient, lightweight, and performs like bare metal</Typography>
                                <Badge sx={{ mr: "auto", ml: "auto", mt: 2, mb: 1 }} color="info" badgeContent="Reccomended" />
                            </Grid>

                        </Paper>
                    </CardActionArea>
                    <CardActionArea onClick={() => {
                        setType("Virtual Machine");
                        setPage("resources");
                    }} sx={{ maxWidth: "45%", mr: "auto", ml: "auto", maxWidth: "45%", borderRadius: 2, height: "90%" }}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                            <Typography variant="h6" align="center">KVM</Typography>
                            <Typography align="center">Fully virtualized and isolated, but resource intensive.</Typography>
                        </Paper>
                    </CardActionArea>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}