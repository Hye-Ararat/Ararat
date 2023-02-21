"use client";

import { Circle } from "@mui/icons-material";
import { Prisma } from "@prisma/client";
import {Typography, Button, Grid} from "../../../components/base";
import Table from "../../../components/table";
import deleteImageServer from "../../../scripts/api/v1/image_servers/delete";



export default function ImageBuilderTable({imageBuilders} : {imageBuilders: Prisma.ImageBuilderGetPayload<{}>[]}) {
    let rows = [];
    imageBuilders.forEach((imageBuilder) => {
        rows.push([
            <Typography sx={{m: "auto"}} fontWeight="bold">{imageBuilder.name}</Typography>,
            <Typography sx={{m: "auto"}}>{imageBuilder.url}</Typography>,
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
            
            ]} rows={rows} actions={[{name: "Delete", action: (checked) => {
                checked.forEach(async (checked) => {
                    let imageBuilder = imageBuilders[checked];
                    await deleteImageServer(imageBuilder.id);

                })
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            }}]} />
    </>
)
}
