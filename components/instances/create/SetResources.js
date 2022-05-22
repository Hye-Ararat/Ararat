import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";

export default function SetResources({ setCpu, setMemory, setPage }) {
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="Poppins">Resource Limits</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>CPU</Typography>
                    <TextField onChange={(e) => setCpu(e.target.value)} variant="standard" placeholder="2" sx={{ ml: "auto", mb: "auto" }} />
                </Grid>
                <Grid container direction="row" sx={{ mt: 2 }}>
                    <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>Memory</Typography>
                    <TextField onChange={(e) => setMemory(e.target.value)} variant="standard" placeholder="4GB" sx={{ ml: "auto", mb: "auto" }} />
                </Grid>
            </DialogContent>
            <Button onClick={() => setPage("devices")} variant="contained" color="info">Continue</Button>
        </Dialog>
    )
}