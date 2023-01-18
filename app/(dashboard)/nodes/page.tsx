import {Typography, Button, Grid} from "../../../components/base";
import CreateNode from "./CreateNode";

export default async function Nodes() {
    return (
        <Grid container direction="row">
        <Typography variant="h4">Nodes</Typography>
 
                   <CreateNode />

        </Grid>
    )
}