import {Typography, Grid} from "../../../components/base";
import prisma from "../../../lib/prisma";
import CreateImageBuilder from "./CreateImageBuilder";
import ImageBuilderTable from "./ImageBuilderTable";

export const revalidate = 0;

export default async function ImageBuilders() {
    const imageBuilders = await prisma.imageBuilder.findMany({});
    return (
        <>
                <Grid container direction="row"> 
        <Typography variant="h4">Image Builders</Typography>
        <CreateImageBuilder />
        </Grid>
        <ImageBuilderTable imageBuilders={imageBuilders} />
        </>
    )
}