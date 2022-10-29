import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { Avatar, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Typography } from "@mui/material"

export default function NodeInfo({ setPage, nodeName, setNodeName, nodeAddress, setNodeAddress, nodePort, setNodePort, lxdPort, setLxdPort, sftpPort, setSftpPort }) {
    return (
        <>
            <Dialog open={true}>
                <DialogTitle>
                    <Grid container direction="row">
                        <IconButton size="small" sx={{ mr: "auto", backgroundColor: "#133542", borderRadius: 2 }} variant="contained" onClick={() => {
                            setPage("host")
                        }}>
                            <ArrowBack sx={{ color: "#09c2de" }} />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 700, mt: "auto", mb: "auto" }} align="center">We need a little more information</Typography>
                        <IconButton size="small" sx={{ ml: "auto", backgroundColor: "#133542", borderRadius: 2 }} variant="contained">
                            <ArrowForward sx={{ color: "#09c2de" }} onClick={() => {
                                if (location.protocol == "https:") {
                                    setPage("install");
                                } else {
                                    setPage("install")

                                }
                            }}
                            />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Node Name</Typography>
                        <TextField value={nodeName} onChange={(e) => setNodeName(e.target.value)} variant="standard" sx={{ ml: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Node Address</Typography>
                        <TextField value={nodeAddress} onChange={(e) => setNodeAddress(e.target.value)} variant="standard" sx={{ ml: "auto", mt: "auto", mb: "auto" }} />
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Grid container direction="row">
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Node Port</Typography>
                        <TextField onChange={(e) => setNodePort(e.target.value)} value={nodePort} variant="standard" sx={{ ml: "auto", mt: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>LXD Port</Typography>
                        <TextField onChange={(e) => setLxdPort(e.target.value)} value={lxdPort} variant="standard" sx={{ ml: "auto", mt: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>SFTP Port</Typography>
                        <TextField onChange={(e) => setSftpPort(e.target.value)} value={sftpPort} variant="standard" sx={{ ml: "auto", mt: "auto", mb: "auto" }} />
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}
