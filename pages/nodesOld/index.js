import { Button, Grid, Typography } from "@mui/material"
import { useState } from "react"
import Navigation from "../../components/navigation"
import Link from "next/link"
import Footer from "../../components/footer"
import Create from "../../components/nodes/CreateNode"
import prisma from "../../lib/prisma"
import Node from "../../components/nodes/node"
import { Box } from "@mui/system"


export async function getServerSideProps({ req, res }) {
    if (!req.cookies.authorization) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
    const { verify, decode } = require("jsonwebtoken");

    let valid;
    try {
        valid = verify(req.cookies.authorization, process.env.ENC_KEY)
    } catch {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    if (!valid) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    const userData = decode(req.cookies.authorization)

    const nodes = await prisma.node.findMany({
        select: {
            id: true,
            name: true,
            address: true,
            port: true
        }
    })
    return {
        props: {
            nodes: nodes ? nodes : [],
            user: userData
        }
    }
}

export default function Nodes({ nodes, user }) {
    const [creatingNode, setCreatingNode] = useState(false);
    return (
        <>
            <Grid container direction="row">
                <Typography variant="h4">Nodes</Typography>
                <Button onClick={() => setCreatingNode(true)} variant="contained" color="primary" sx={{ mt: "auto", mb: "auto", ml: "auto" }}>Create Node</Button>
            </Grid>
            <Grid container direction="row" sx={{ mb: 1, mt: 2 }}>
                <Grid container xs={.5} sm={.8} md={.3} lg={.2} xl={.2} />
                <Grid container xs={4} sm={5} md={3} lg={2} xl={1.5}>
                    <Typography sx={{ mr: "auto", ml: "auto" }}>Name</Typography>
                </Grid>
                <Grid container xs={2} md={3} xl={4}>
                    <Typography sx={{ mr: "auto", ml: "auto" }}>Address</Typography>
                </Grid>
            </Grid>
            {nodes.map((node) => {
                return (
                    <Link passHref={true} key={node.id} href={`/node/${node.id}`}>
                        <Box sx={{ cursor: "pointer" }}>
                            <Node {...node} />
                        </Box>
                    </Link>
                )
            })}
            {creatingNode ?
                <Create />
                : ""}

        </>
    )
}

Nodes.getLayout = (page) => {
    return (
        <Navigation page="nodes">
            {page}
            <Footer />
        </Navigation>
    )
}