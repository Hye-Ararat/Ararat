import { Button, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Navigation from "../../../components/admin/Navigation"
import Table from "../../../components/admin/Table"
import Link from "next/link"

export async function getServerSideProps({ req, res }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }

    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")

    var { connectToDatabase } = require("../../../util/mongodb")
    var { db } = await connectToDatabase()
    var { verify, decode } = require("jsonwebtoken")
    var { ObjectId } = require("mongodb")

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
    if (user_data.admin && user_data.admin.instances && user_data.admin.instances.read) {
        var instances = await db.collection("instances").find({}).toArray()
        console.log(instances)
    }

    return {
        props: {
            instances: instances ? JSON.parse(JSON.stringify(instances)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}
export default function Instances({ instances, user }) {
    const [instanceRows, setInstanceRows] = useState([]);
    useEffect(() => {
        var rows = [];
        instances.forEach(async instance => {
            rows.push({ cells: [instance.name] })
        })
        setInstanceRows(rows);
    }, [])
    return (
        <>
            <Grid direction="row" container>
                <Typography variant="h4" sx={{ mb: 1 }}>Instances</Typography>
                {user.admin && user.admin.instances && user.admin.instances.write ?
                    <>
                        <Link href="/admin/instances/new">
                            <Button variant="contained" color="primary" sx={{ ml: "auto", mt: "auto", mb: "auto" }}>Create Instance</Button>
                        </Link>
                    </> : ""}
            </Grid>
            {user.admin && user.admin.instances && user.admin.instances.read ?
                <>
                    {instances.length > 0 ?
                        <Table cells={["Name"]} rows={instanceRows} />
                        : <Typography>No Instances</Typography>}
                </> : <Typography>You do not have access to this resource</Typography>}
        </>
    )
}

Instances.getLayout = function getLayout(page) {
    return (
        <Navigation page="instances">
            {page}
        </Navigation>
    )
}