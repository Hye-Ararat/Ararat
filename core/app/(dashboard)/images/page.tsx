import {Typography, Grid} from "../../../components/base";
import CreateImage from "./CreateImage";

export default async function Images() {
    return (
        <>
                <Grid container direction="row"> 
        <Typography variant="h4">Images</Typography>
        <CreateImage />
        </Grid>
        </>
    )
}