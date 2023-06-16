import {Grid, Typography} from "../../../components/base";
import { lxdUnix } from "../../../lib/lxd";
import OperationsTable from "./OperationsTable";

export default async function Operations() {
    let operations = await lxdUnix().getOperations();
    console.log(operations)
    return (
        <>
        <Grid container direction="row">
            <Typography variant="h4">Operations</Typography>
        </Grid>
        <OperationsTable operations={operations.running} />
        </>
    )
}