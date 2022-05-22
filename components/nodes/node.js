import { Circle } from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material";

export default function Node({ name, address, port }) {
    return (
        <Paper sx={{ p: 2, mt: 1 }} on >
            <Grid container direction="row">
                <Grid container xs={.5} sm={.8} md={.3} lg={.2} xl={.2}>
                    <Grid container xs={.5} sm={.8} md={.3} lg={.2} sx={{ mt: "auto", mb: "auto" }}>
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac" }} />
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
                    </Grid>
                </Grid>
                <Grid container xs={4} sm={5} md={3} lg={2} xl={1.5}>
                    <Typography noWrap fontWeight="bold" sx={{ mr: "auto", ml: "auto" }}>{name}</Typography>
                </Grid>
                <Grid container xs={2} md={3} xl={4}>
                    <Typography noWrap sx={{ mr: "auto", ml: "auto" }}>{address}:{port}</Typography>
                </Grid>

            </Grid>
        </Paper >
    )
}