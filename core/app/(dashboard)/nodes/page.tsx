import prisma from "../../../lib/prisma.js/index.js";

import {Typography, Grid} from "../../../components/base";
import CreateNode from "./CreateNode";
import NodeTable from "./NodeTable"

export const revalidate = 0;

export default async function Nodes() {
    const nodes = await prisma.node.findMany({})
    console.log(nodes);
    return (
        <>
        <Grid container direction="row"> 
        <Typography variant="h4">Nodes</Typography>
                   <CreateNode />
        </Grid>
        <NodeTable nodes={nodes} />
        </>
    )
}