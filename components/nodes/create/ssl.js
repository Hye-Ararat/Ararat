import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from "@mui/material";

export default function SSL({ setPage, sslKeyPath, setSslKeyPath, sslCertPath, setSslCertPath }) {
    return (
        <>
            <Dialog open={true}>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 700, mt: "auto", mb: "auto" }} align="center">Looks like you are using SSL</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>Using SSL requires a bit more configuration. Please please your SSL key and SSL path in a directory on your node, and provide the corrosponding paths here.</Typography>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Grid container direction="row">
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>SSL Key Path</Typography>
                        <TextField value={sslKeyPath} onChange={(e) => setSslKeyPath(e.target.value)} variant="standard" sx={{ ml: "auto", mb: "auto" }} />
                    </Grid>
                    <Grid container direction="row" sx={{ mt: 2 }}>
                        <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>SSL Certificate Path</Typography>
                        <TextField value={sslCertPath} onChange={(e) => setSslCertPath(e.target.value)} variant="standard" sx={{ ml: "auto", mt: "auto", mb: "auto" }} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ mr: "auto", ml: "auto", minWidth: "200px" }} variant="contained" color="info" onClick={() => {
                        setPage("install");
                    }}>Continue</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}