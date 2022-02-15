import Navigation from "../../../components/admin/Navigation";
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableContainer, TableHead, TableCell, TableBody, Paper, Typography, Button, Grid, TableRow } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import prisma from "../../../lib/prisma";
export async function getServerSideProps({ req, res }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        }
    }
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );
    const { verify, decode } = require("jsonwebtoken");
    try {
        var valid_session = verify(req.cookies.access_token, process.env.ENC_KEY)
    } catch {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    if (!valid_session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }
    const user_data = decode(req.cookies.access_token)
    console.log(user_data)
    let nodes = [];
    if (user_data.permissions.includes("list-nodes")) {
        nodes = await prisma.node.findMany({
            select: {
                id: true,
                name: true,
                _count: true,
                cpu: true,
                memory: true,
                disk: true,
                hostname: true,
                port: true,
                ssl: true
            }
        })
        console.log(nodes)
    }
    return {
        props: {
            nodes: nodes ? JSON.parse(JSON.stringify(nodes)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}
export default function Nodes({ nodes, user }) {
    console.log(nodes)
    console.log(user)
    const router = useRouter()
    return (
        <>
            <Grid direction="row" container><Typography variant="h4" sx={{ mb: 1 }}>Nodes</Typography> {user.permissions.includes("create-node") ? <Link href={"/admin/nodes/new"}><Button sx={{ mt: "auto", mb: "auto", ml: "auto" }} variant="contained" color="primary">Create Node</Button></Link> : ""}</Grid>
            {user.permissions.includes("list-nodes") ?
                <Paper sx={{ borderRadius: 1.5 }}>
                    <TableContainer sx={{ borderRadius: 1.5 }}>
                        <Table>
                            <TableHead>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Memory</TableCell>
                                <TableCell align="left">Disk</TableCell>
                                <TableCell align="left">CPU</TableCell>
                                <TableCell align="left">SSL</TableCell>
                            </TableHead>
                            <TableBody sx={{ borderRadius: 1.5 }}>
                                {nodes.map(node => {
                                    return (
                                        <TableRow key={node.id}>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }}>{node.name}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.memory}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.disk}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.cpu}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.ssl ? "true" : "false"}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper> : "You do not have access to this resource"}
        </>
    )
}

Nodes.getLayout = function getLayout(page) {
    return (
        <Navigation page="nodes">
            {page}
        </Navigation>
    )
}