import { Button, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Navigation from "../../../components/admin/Navigation"
import Table from "../../../components/admin/Table"

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
    )

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
    if (user_data.admin && user_data.admin.magma_cubes && user_data.admin.magma_cubes.read) {
        var magma_cubes = await db.collection("magma_cubes").find({}).toArray()
        console.log(magma_cubes)
    }
    return {
        props: {
            magma_cubes: magma_cubes ? JSON.parse(JSON.stringify(magma_cubes)) : JSON.parse(JSON.stringify([])),
            user: JSON.parse(JSON.stringify(user_data))
        }
    }
}

export default function MagmaCubes({ magma_cubes, user }) {
    const [magmaCubeRows, setMagmaCubeRows] = useState([]);
    useEffect(() => {
        var rows = []
        magma_cubes.forEach(async magma_cube => {
            rows.push({cells: [magma_cube.name, magma_cube.stateless && magma_cube.type == "n-vps" ? "Stateless N-VPS" : magma_cube.type]})
        })
        setMagmaCubeRows(rows)
    }, [])
    return (
        <>
            <Grid direction="row" container>
                <Typography variant="h4" sx={{ mb: 1 }}>Images</Typography>
                {user.admin && user.admin.magma_cubes && user.admin.magma_cubes.write ? <Button variant="contained" color="primary" sx={{mt: "auto", mb: "auto", ml: "auto"}}>Create Image</Button> : ""}
            </Grid>
            {!user.admin || !user.admin.magma_cubes || !user.admin.magma_cubes.read ? <Typography variant="h6" sx={{ mb: 1 }}>You do not have permission to view this page.</Typography>
            : 
            <Table cells={["Name", "Type"]} rows={magmaCubeRows} />}

        </>
    )
}

MagmaCubes.getLayout = (page) => {
    return (
        <Navigation page="magma_cubes">
            {page}
        </Navigation>
    )
}