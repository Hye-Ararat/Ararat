import Navigation from "../../../components/admin/Navigation";
import Overview from "../../../components/admin/nodes/[id]/Overview";
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableContainer, TableHead, TableCell, TableBody, Paper, Typography, Tabs, Tab, Grid } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { useState } from "react";
import ResizeObserver from "react-resize-observer";
import Network from "../../../components/admin/nodes/[id]/Network";
import prisma, { PrismaClient } from "@prisma/client";
export async function getServerSideProps({ req, res, query }) {
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
    var { verify, decode } = require("jsonwebtoken");
    const prisma = new PrismaClient();
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
    if (user_data.permissions.includes("view-node")) {
        console.log(query.id)
        console.time("e")
        var node = await prisma.node.findUnique({
            where: {
                id: query.id
            },
            select: {
                id: true,
                _count: true,
                name: true,
                cpu: true,
                disk: true,
                hostname: true,
                memory: true,
                port: true,
                ssl: true,
                networks: user_data.permissions.includes("list-networks")
            }
        })
        console.timeEnd("e")
        console.log(node)
    }
    return {
        props: {
            node: node ? JSON.parse(JSON.stringify(node)) : null,
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`
    };
}
export default function Nodes({ node, user }) {
    console.log(node)
    console.log(user)
    const [tab, setTab] = useState(0);
    const [width, setWidth] = useState();
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    return (
        <>
            {node ?
                <>
                    <Typography variant="h4" sx={{ mb: 1 }}>{node.name}</Typography>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={tab} onChange={handleChange} scrollButtons="auto">
                            <Tab label="Overview" {...a11yProps(0)} wrapped />
                            <Tab label="Settings" {...a11yProps(1)} wrapped />
                            <Tab label="Configuration" {...a11yProps(2)} wrapped />
                            <Tab label="Network" {...a11yProps(3)} wrapped />
                            <Tab label="Instances" {...a11yProps(4)} wrapped />
                        </Tabs>
                    </Box>
                    <TabPanel value={tab} index={0}>
                        <Overview node={node} />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        Yes
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        Yes
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        <Network user={user} node={node} />
                    </TabPanel>
                    <TabPanel value={tab} index={4}>
                        Yes
                    </TabPanel>
                </>
                : "You do not have access to this resource"}
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