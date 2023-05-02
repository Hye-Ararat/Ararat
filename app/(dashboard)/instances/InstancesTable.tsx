"use client";

import Table from "../../../components/table";
import { Circle } from "@mui/icons-material";
import { Typography, Grid } from "../../../components/base";

export default function InstancesTable({ instances }) {
    let rows = [];
    instances.forEach((instance) => {
        rows.push([
            <Typography sx={{ m: "auto" }} fontWeight="bold">{instance.name}</Typography>,
            <Typography sx={{ m: "auto" }}>{instance.type}</Typography>,
            <>
                <Grid sx={{ maxWidth: "15px", ml: "auto", mt: "auto", mb: "auto" }} container>
                    <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac" }} />
                    <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
                </Grid>
                <Typography sx={{ mt: "auto", mb: "auto", ml: 1, mr: "auto" }}>{instance.status}</Typography>
            </>
        ])
    })
    return (
        <>
            <Table columns={[
                {
                    title: "Name",
                    fontWeight: 500,
                    sizes: {
                        xs: 4
                    },
                },
                {
                    title: "Type",
                    fontWeight: 500,
                    sizes: {
                        xs: 4
                    },
                },
                {
                    title: "Status",
                    sizes: {
                        xs: 3
                    }
                },

            ]}
                rows={rows} rowLinks={[{link: "/instances/demo"}]} />
        </>
    )
}