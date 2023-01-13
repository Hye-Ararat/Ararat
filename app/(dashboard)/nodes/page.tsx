import {Typography, Button, Grid} from "../../../components/base";
import CreateNode from "./CreateNode";

export default async function Nodes() {
    return (
        <Grid container direction="row">
            <CreateNode />
        <Typography variant="h4">Nodes</Typography>
        <Button variant="contained" sx={{ml: "auto"}}>Create Node</Button>
        </Grid>
    )
}