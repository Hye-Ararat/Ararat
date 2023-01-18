import prisma from "../../../lib/prisma.js";

import {Typography, Button, Grid} from "../../../components/base";
import CreateNode from "./CreateNode";

export const revalidate = 0;

export default async function Nodes() {
    const nodes = await prisma.node.findMany({})
    console.log(nodes)
    return (
        <>
        <Grid container direction="row">
        <Typography variant="h4">Nodes</Typography>
 
                   <CreateNode />

        </Grid>
        {nodes.map((node) => {
            return (
                <p key={node.id}>{node.name}</p>
            )
        })}
        </>
    )
}