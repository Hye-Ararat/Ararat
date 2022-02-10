import Navigation from "../../../components/admin/Navigation";
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableContainer, TableHead, TableCell, TableBody, Paper, Typography, Button, Grid, TableRow } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
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
    var { connectToDatabase } = require("../../../util/mongodb")
    var { db } = await connectToDatabase();
    var { verify, decode } = require("jsonwebtoken");
    var { ObjectId } = require("mongodb");
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
    var user_data = decode(req.cookies.access_token)
    console.log(user_data)
    if (user_data.admin && user_data.admin.nodes && user_data.admin.nodes.read) {
        var nodes = await db.collection('nodes').find({}).toArray();
        console.log(nodes)
        var safeNodes = [];
        nodes.forEach(node => {
            node.access_token = undefined;
            node.access_token_iv = undefined;
            node.id = node._id;
            node._id = undefined;
            safeNodes.push(node);
        })
    }
    console.log(safeNodes)
    return {
        props: {
            nodes: safeNodes ? JSON.parse(JSON.stringify(safeNodes)) : JSON.parse(JSON.stringify([])),
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
            <Grid direction="row" container><Typography variant="h4" sx={{ mb: 1 }}>Nodes</Typography> {user.admin && user.admin.nodes && user.admin.nodes.write ? <Link href={"/admin/nodes/new"}><Button sx={{ mt: "auto", mb: "auto", ml: "auto" }} variant="contained" color="primary">Create Node</Button></Link> : ""}</Grid>
            {user.admin && user.admin.nodes && user.admin.nodes.read ?
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
                                        <TableRow>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }}>{node.name}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.limits.memory}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.limits.disk}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.limits.cpu}</TableCell>
                                            <TableCell onClick={() => {
                                                router.push(`/admin/nodes/${node.id}`)
                                            }} style={{ cursor: "pointer" }} align="left">{node.address.ssl ? "true" : "false"}</TableCell>
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