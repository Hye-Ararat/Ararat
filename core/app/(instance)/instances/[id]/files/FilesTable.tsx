"use client";

import {Breadcrumbs, Grid, Typography} from "../../../../../components/base";
import Table from "../../../../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder, faFileImage, faFilePdf, faFileWord, faFilePowerpoint, faFileExcel, faFileCsv, faFileAudio, faFileVideo, faFileArchive, faFileCode, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import getClassNameForExtension from 'font-awesome-filetypes'
import Link from "next/link";
import lxd from "../../../../../lib/lxd";
import prettyBytes from "pretty-bytes";


export default function FilesTable({files, path, id, accessToken}) {
    function getIcon(code) {
        if (code == "fa-file") return faFile;
        if (code == "fa-folder") return faFolder;
        if (code == "fa-file-image") return faFileImage;
        if (code == "fa-file-pdf") return faFilePdf;
        if (code == "fa-file-word") return faFileWord;
        if (code == "fa-file-powerpoint") return faFilePowerpoint;
        if (code == "fa-file-excel") return faFileExcel;
        if (code == "fa-file-csv") return faFileCsv;
        if (code == "fa-file-audio") return faFileAudio;
        if (code == "fa-file-video") return faFileVideo;
        if (code == "fa-file-archive") return faFileArchive;
        if (code == "fa-file-code") return faFileCode;
        if (code == "fa-file-alt") return faFileAlt;
        if (code == "fa-file-file") return faFile;
    }
    let rows: JSX.Element[][] = [];
    let rowLinks: object[] = [];
    files.forEach(async (file, index) => {
        const icon = getClassNameForExtension(file.name.split(".").pop());
        let filePath = (path + "/" + file.name).replace("//", "/");
        //let fileMetadata = await lxd(accessToken).instances.instance(id).getFileMetadata(filePath);
        //console.log(fileMetadata)
        rowLinks.push({"link": `/instances/${id}/files?path=${filePath}`, "prefetch": false})
        rows.push([
            <Grid key={index} sx={{maxWidth: "20px", m: "auto"}}>
                {file.type != "directory" ?
                /*@ts-ignore*/
                <FontAwesomeIcon icon={getIcon(icon)} style={{  color: "grey" }} />
:                 <FontAwesomeIcon icon={file.type == "directory" ? faFolder : faFile} style={{  color: "grey" }} />
        }
            </Grid>,
            <Typography key={index} sx={{m: "auto"}} fontWeight="bold">{file.name}</Typography>,
            <Typography key={index} sx={{m: "auto"}}>{file.size ? prettyBytes(file.size) : ""}</Typography>,
            <Typography key={index} sx={{m: "auto"}}>{file.modified}</Typography>
        ])
    })
    return (
        <>
        <Table columns={[
                        {
                            title: "Icon",
                            sizes: {
                                xs: 1
                            }
                        },
            {
                title: "Name",
                fontWeight: 500,
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Size",
                sizes: {
                    xs: 3
                }
            },
            {
                title: "Last Modified",
                sizes: {
                    xs: 3
                }
            },
        ]} rows={rows} top={
            <Grid xs={5} sx={{marginTop: "auto", marginBottom: "auto", ml: 2}} container>
                 <Link prefetch={false} href={`/instances/${id}/files?path=/`} style={{textDecoration: "none", color: "rgba(255, 255, 255, 0.7)", marginTop: "auto", marginBottom: "auto", marginRight: "10px"}}>
                            {"/"}
                        </Link>
            <Breadcrumbs sx={{my: "auto"}}>
                {path.split("/").map((item, index) => {
                    if (item == "") return;
                   let newPath = path.split("/").slice(0, index + 1).join("/");
                    return (
                        <Link key={index} prefetch={false} href={`/instance/${id}/files?path=${newPath}`} style={{textDecoration: "none", color: "inherit"}}>
                            {item}
                        </Link>
                    )
                })
            }
            </Breadcrumbs>
            </Grid>
         } rowLinks={rowLinks} />
        </>
    )
}