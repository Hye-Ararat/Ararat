import { LinearProgress, Grid, Typography } from "@mui/material";

export default function ConnectToNode(props) {
    return (
        <Grid container direction="column">
        <Typography sx={{mr: "auto", ml: "auto", mt: 2  }}>Connecting to Node</Typography>
        <LinearProgress sx={{width: "50%", mr: "auto", ml: "auto", mt: 3}}/>
        </Grid>
    )
}