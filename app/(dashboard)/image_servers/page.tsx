import {Typography, Grid} from "../../../components/base";
import prisma from "../../../lib/prisma";
import CreateImageServer from "./CreateImageServer";
import ImageServerTable from "./ImageServerTable";

export const revalidate = 0;

export default async function ImageServers() {
    const imageServers = await prisma.imageServer.findMany({});
    return (
        <>
                <Grid container direction="row"> 
        <Typography variant="h4">Image Servers</Typography>
        <CreateImageServer />
        </Grid>
        <ImageServerTable imageServers={imageServers} />
        </>
    )
}