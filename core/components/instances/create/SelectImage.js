import { CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Table from "../../table";

export default function SelectImage({ setPage, setImageData, node }) {
    const [images, setImages] = useState(null);
    const [formattedImages, setFormattedImages] = useState(null);
    useEffect(() => {
        axios.get("/api/v1/nodes/" + node + "/system").then(res => {
            let arch = res.data.metadata.arch
            axios.get("/api/v1/images?arch=" + arch).then(res => {
                setImages(res.data)
                console.log(res.data)
                let sorted = [];
                res.data.forEach(imageServer => {
                    Object.keys(imageServer.images).forEach(image => {
                        let kvm = false;
                        let container = false;
                        let stateless = false;
                        Object.keys(imageServer.images[image].versions).forEach(version => {
                            Object.keys(imageServer.images[image].versions[version].items).forEach(item => {
                                if (!kvm) {
                                    if (imageServer.images[image].versions[version].items[item].ftype == "disk-kvm.img" || imageServer.images[image].versions[version].items[item].ftype == "disk1.img" || imageServer.images[image].versions[version].items[item].ftype == "uefi1.img") {
                                        kvm = true;
                                    }
                                }
                                if (!container) {
                                    if (imageServer.images[image].versions[version].items[item].ftype == "root.tar.xz" || imageServer.images[image].versions[version].items[item].ftype == "root.tar.gz") {
                                        container = true;
                                    }
                                }
                                if (!stateless) {
                                    if (imageServer.images[image].variant == "stateless") {
                                        stateless = true;
                                    }
                                }
                            })
                        })
                        let type;
                        if (kvm && container) {
                            type = "Virtual Machine and N-VPS";
                        } else if (container && !kvm) {
                            type = "N-VPS";
                        } else if (kvm) {
                            type = "Virtual Machine";
                        }
                        if (stateless) {
                            type = "Stateless N-VPS";
                        }
                        sorted.push({
                            id: image,
                            server: imageServer.server.name,
                            serverId: imageServer.server.id,
                            name: imageServer.images[image].os + " " + imageServer.images[image].release_title,
                            type: type,
                            imageDat: imageServer.images[image]
                        })
                    })
                })
                let formatted = [];
                console.log("SORT", sorted)
                sorted.forEach((image, index) => {
                    formatted.push([
            <Typography key={index} onClick={(e) => {
                setImageData(image)
                setPage("imageType")
            }} sx={{m: "auto"}} fontWeight="bold">{image.name}</Typography>,
                        
            <Typography key={index} onClick={(e) => {
                setImageData(image)
                setPage("imageType")
            }} sx={{m: "auto"}}>{image.type}</Typography>,
            
                         <>
                                     <Typography onClick={(e) => {
                setImageData(image)
                setPage("imageType")
            }} sx={{m: "auto"}}>{image.server}</Typography>
                         </>
                    ])
                })
                console.log("FORM", formatted)
                setFormattedImages(formatted)
            })
        })

    }, [])
    return (
        <Dialog open={true} sx={{ minWidth: 600, py: 5, px: 10 }} fullScreen>
            <DialogTitle>

                <Typography variant="h6" fontFamily={"Poppins"}>{images ? "Select an Image" : "Fetching Images..."}</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 600 }}>
                {formattedImages ?
                    <div style={{ width: "100%", height: 400 }}>
           <Table columns={[
            {
                title: "Name",
                fontWeight: 500,
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Type",
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Server",
                sizes: {
                    xs: 3
                }
            },
            
            ]} rows={formattedImages} />
{/*                                     <DataGrid onRowClick={(e) => {
                            setImageData(e.row);
                            setPage("imageType");
                        }} columns={[{ field: "name", headerName: "Name", width: 150 }, { field: "type", headerName: "Type", width: 205 }, { width: 190, field: "server", headerName: "Server" }]} rows={formattedImages} /> */}
                    </div>
                    : ""}
                {/*
                <Grid container direction="column">
                    {images ?
                        images.map(imageS => {
                            return (
                                <>
                                    <Divider />
                                    <p>{imageS.server}</p>
                                    <Divider />
                                    {Object.keys(imageS.images).map(image => {
                                        return (
                                            <Grid item key={image}>
                                                <p>{imageS.images[image].os + " " + imageS.images[image].release_title + " " + `${imageS.images[image].variant ? imageS.images[image].variant != "default" && imageS.images[image].variant != "cloud" ? "(" + imageS.images[image].variant + ")" : "" : ""}`}</p>
                                            </Grid>
                                        )
                                    })}

                                </>
                            )

                        })
                        : (
                            <>
                                <CircularProgress sx={{ mr: "auto", ml: "auto" }} />
                                <Typography align="center" sx={{ mt: 1 }}>Just a moment...</Typography>
                            </>)}
                </Grid>
                        */}
            </DialogContent>
        </Dialog>
    )

}