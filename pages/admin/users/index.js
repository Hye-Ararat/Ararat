import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Navigation from "../../../components/admin/Navigation"
import Table from "../../../components/admin/Table"

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
    if (user_data.admin && user_data.admin.users && user_data.admin.users.read) {
        var users = await db.collection("users").find({}).toArray()
        console.log(users)
    }
    return {
        props: {
            users: users ? JSON.parse(JSON.stringify(users)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}

export default function Users({ users, user }) {
    const [userRows, setUserRows] = useState([]);
    useEffect(() => {
        let rows = [];
        users.forEach(async user => {
            rows.push({ cells: [user.first_name, user.last_name, user.email] })
        })
        setUserRows(rows);
    }, [])
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>Users</Typography>
            {user.admin && user.admin.users && user.admin.users.read ?
                <>
                    {users.length > 0 ?
                        <Table cells={["First Name", "Last Name", "Email"]} rows={userRows} />
                        : <Typography>No Users</Typography>}
                </>
                : <Typography>You do not have permission to access this resource</Typography>}
        </>
    )
}

Users.getLayout = (page) => {
    return (
        <Navigation page="users">
            {page}
        </Navigation>
    )
}