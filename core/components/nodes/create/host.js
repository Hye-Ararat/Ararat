import { Dialog, Grid, DialogTitle, DialogContent, Typography, Divider, Modal, Box, Button } from "@mui/material"
import { Cloud, Nightlight, CloudOutlined, CorporateFare, Security, SupportAgent, SignalCellularAlt } from "@mui/icons-material"
import { useState } from "react";
export default function SelectHost({ setPage }) {
    const [hovering, setHovering] = useState(false);
    const [sure, setSure] = useState(false);

    return (
        <>
            <Modal open={sure}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 550,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3
                }}>
                    <Grid container sx={{ mt: 1 }}>
                        <img src="/logo.png" width="120px" style={{ marginLeft: "auto", marginRight: 10 }} />
                        <Typography variant="h3" sx={{ mr: "auto", mb: 1, fontWeight: "bold", fontFamily: "Poppins" }}>Cloud</Typography>
                    </Grid>
                    <Grid container>
                        <Typography sx={{ mr: "auto", ml: "auto" }}>Are you sure you want to miss out?</Typography>
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Grid container direction="row">
                        <Grid container direction="column" sx={{ maxWidth: "33%" }}>
                            <Security sx={{ fontSize: "40px", mr: "auto", ml: "auto" }} />
                            <Typography variant="h6" align="center">Anti-DDoS</Typography>
                        </Grid>
                        <Grid container direction="column" sx={{ maxWidth: "33%" }}>
                            <SupportAgent sx={{ fontSize: "40px", mr: "auto", ml: "auto" }} />
                            <Typography variant="h6" align="center">24/7 Support</Typography>
                        </Grid>
                        <Grid container direction="column" sx={{ maxWidth: "33%" }}>
                            <SignalCellularAlt sx={{ fontSize: "40px", mr: "auto", ml: "auto" }} />
                            <Typography variant="h6" align="center">99.9% Uptime</Typography>
                        </Grid>

                    </Grid>
                    <Grid container direction="column" sx={{ width: "300px", mr: "auto", ml: "auto", mt: 2 }}>
                        <Button variant="contained" color="info" sx={{ mt: 2 }} onClick={() => {
                            setSure(false);
                            setPage("cloudPlan");
                        }} autoFocus>Use Hye Cloud</Button>
                        <Button sx={{ mt: 1, color: "gray" }} onClick={() => {
                            setSure(false);
                            setPage("nodeInfo")
                        }}>Miss Out</Button>
                    </Grid>
                </Box>
            </Modal>
            <Dialog open={true}>
                <Grid container>
                    <DialogTitle sx={{ mr: "auto", ml: "auto" }}>Where do you want to host this node?</DialogTitle>
                </Grid>
                <div onMouseLeave={() => setHovering(false)} onMouseOver={() => setHovering(true)} onClick={() => {
                    setPage("cloudPlan");
                }} style={{ cursor: "pointer" }}>
                    <Grid container sx={{ backgroundImage: hovering ? "linear-gradient(transparent, rgba(255, 255, 255, 0.15), transparent)" : "linear-gradient(transparent, rgba(255, 255, 255, 0.12), transparent)", p: 3 }} direction="column">
                        <Grid container direction="row" sx={{ maxWidth: "30px" }}>
                            <Cloud sx={{ fontSize: "60px", zIndex: "30", mt: 2 }} />
                            <Nightlight sx={{ fontSize: "60px", color: "#ffb800", position: "absolute", ml: 3, zIndex: "1", rotate: "-30deg" }} />
                            <Cloud sx={{ fontSize: "30px", position: "absolute", ml: 8, mt: 3 }} />
                        </Grid>
                        <Typography align="center" fontWeight={500} variant="h6" sx={{ position: "absolute", left: "38.5%", bottom: "56%", fontFamily: "Poppins", fontWeight: "bold" }}>Hye Cloud</Typography>
                        <CloudOutlined sx={{ position: "absolute", left: "30%", bottom: "39.5%", fontSize: "180px", color: "transparent", fill: "white" }} />
                        <Cloud sx={{ fontSize: "65px", position: "absolute", ml: 0, mb: 5, right: "15%", top: "13%" }} />
                        <Cloud sx={{ fontSize: "85px", zIndex: "30", position: "absolute", right: "2%", top: "30%" }} />
                    </Grid>
                </div>

                <DialogContent>
                    <Divider sx={{ m: 1 }} />
                    <Grid container direction="column" onClick={() => {
                        setSure(true);
                    }} sx={{ cursor: "pointer" }}>
                        <Typography fontWeight={500} variant="h6" sx={{ mr: "auto", ml: "auto", fontFamily: "Poppins" }}>My Own Infrastructure</Typography>
                        <CorporateFare sx={{ fontSize: "70px", mr: "auto", ml: "auto" }} />
                    </Grid>
                </DialogContent>
            </Dialog >
        </>
    )
}