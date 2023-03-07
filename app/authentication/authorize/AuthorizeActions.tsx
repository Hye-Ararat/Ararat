"use client";
import { Button, Grid } from "../../../components/base";

export default function AuthorizeActions() {
    return (
        <Grid sx={{mt: 2}} container direction="row">
        <Button sx={{ml: "auto", mr: 1}} variant="contained" color="error">Block, cancel</Button>
        <Button sx={{mr: "auto", ml: 1}} variant="contained" color="success">Allow, continue</Button>
        </Grid>
    );
}