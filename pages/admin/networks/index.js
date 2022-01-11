import { Typography, Grid, Button, Paper, Modal, Box, FormControl, TextField } from "@mui/material"
import Navigation from "../../../components/admin/Navigation"
import Table from "../../../components/admin/Table";
import { useState } from "react";
import CreateNetwork from "../../../components/admin/networks/CreateNetwork";

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
    if (user_data.admin && user_data.admin.networks && user_data.admin.networks.read) {
        var networks = await db.collection('networks').find({}).toArray();
        console.log(networks)
    }
    return {
        props: {
            networks: networks ? JSON.parse(JSON.stringify(networks)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }


}
export default function Networks({ networks, user }) {
    const [createNetworkOpen, setCreateNetworkOpen] = useState(false);
    function getRows(arr) {
        var networks = []
        arr.forEach(async network => {
            networks.push({
                link: `/admin/networks/${network._id}`,
                cells: [network.name, network.node, network.address.ipv4, network.address.ipv6, network.address.ip_alias]
            })
        })
        return networks;
    }
    return (
        <>
            <Grid direction="row" container>
                <Typography variant="h4" sx={{ mb: 1 }}>Networks</Typography>
                {user.admin && user.admin.networks && user.admin.networks.write ? <Button sx={{ mt: "auto", mb: "auto", ml: "auto" }} variant="contained" color="primary" onClick={() => setCreateNetworkOpen(true)}>Create Network</Button> : ""}
            </Grid>
            <Modal open={createNetworkOpen} onClose={() => setCreateNetworkOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "80%",
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6">Create a Network</Typography>
                    <CreateNetwork />
                </Box>
            </Modal>
            {user.admin && user.admin.networks && user.admin.networks.read ?
                <Table cells={["Name", "Node", "IPv4", "IPv6", "IP Alias"]} rows={getRows(networks)} />
                : "You do not have permission to read networks."}
        </>
    )
}
Networks.getLayout = function getLayout(page) {
    return (
        <Navigation page="networks">
            {page}
        </Navigation>
    )
}