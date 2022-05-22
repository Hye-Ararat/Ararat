import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";

export default function Identity({ setPage, setName }) {
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="poppins">What do you want this instance to be called?</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <TextField onChange={(e) => setName(e.target.value)} sx={{ mr: "auto", ml: "auto" }} placeholder="Enter name" />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPage("users")} variant="contained" color="success" sx={{ mr: "auto", ml: "auto" }}>Continue</Button>
            </DialogActions>
        </Dialog>
    )
}