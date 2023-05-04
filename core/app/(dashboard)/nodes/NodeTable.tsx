"use client";

import { Circle } from "@mui/icons-material";
import { Prisma } from "@prisma/client";
import {Typography, Button, Grid} from "../../../components/base";
import Table from "../../../components/table";



export default function NodeTable({nodes} : {nodes: Prisma.NodeGetPayload<{}>[]}) {
    let rows: JSX.Element[][] = [];
    let rowLinks: object[] = [];
    nodes.forEach((node, index) => {
        rowLinks.push({link: `${node.url}/node/${node.id}`})
        rows.push([
            <Typography key={index} sx={{m: "auto"}} fontWeight="bold">{node.name}</Typography>,
            <Typography key={index} sx={{m: "auto"}}>{node.url}</Typography>,
            <>
             <Grid sx={{maxWidth: "15px", ml: "auto", mt: "auto", mb: "auto" }} container>
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac" }} />
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
                    </Grid>
                    <Typography sx={{mt: "auto", mb: "auto", ml: 1, mr: "auto"}}>Online</Typography>
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
                }
            },
            {
                title: "URL",
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Status",
                sizes: {
                    xs: 3
                }
            },
            
            ]} rows={rows} rowLinks={rowLinks} />
    </>
)
}
