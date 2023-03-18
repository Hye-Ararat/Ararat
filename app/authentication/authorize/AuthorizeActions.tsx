"use client";
import { Button, Grid } from "../../../components/base";

export default function AuthorizeActions({interaction}) {
    function confirm() {
        document.getElementById("leForm").submit();
    }
    return (
        <form method="post" id="leForm" action={`/api/authentication/interaction/${interaction}/confirm`}>
        <Grid sx={{mt: 2}} container direction="row">
        <Button sx={{ml: "auto", mr: 1, minWidth: "100px"}} variant="contained" color="error">Block</Button>
        <Button onClick={() => confirm()} sx={{mr: "auto", ml: 1, minWidth: "100px"}} variant="contained" color="success">Allow</Button>
        </Grid>
        </form>
    );
}