import { useRouter } from "next/router";
import { Typography, Paper, Button, Grid, Checkbox, Container, CircularProgress, Skeleton } from "@mui/material";
import useSWR from "swr";
import nookies from "nookies"
import { Suspense, useEffect, useState } from "react";
import axios from "axios"
import prettyBytes from "pretty-bytes";
import moment from "moment"
import Link from "next/link";
import File from "../../../components/instance/files/file";
import dynamic from "next/dynamic";
const FileEditor = dynamic(import("../../../components/instance/files/FileEditor"), { ssr: false });
export default function Files(props) {
    const [checked, setChecked] = useState([])
    const [allChecked, setAllChecked] = useState(false)
    const [theFiles, setTheFiles] = useState([])
    const router = useRouter();
    var { id, path } = router.query;
    if (path == undefined) {
        path = "/";
    }
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const {data: files, error} = useSWR(() => id ? `/api/v1/client/instances/${id}/files?path=${path.replace("//", "/")}` : null, fetcher)
    function HandleClicked(e) {
        e.preventDefault();
        console.log(e.target)
        if (e.target.localName == "input") {
            console.log("checkbox")
            var tempChecked = checked;
            if (tempChecked.includes(e.target.id)) {
                tempChecked.splice(tempChecked.indexOf(e.target.id), 1)
            } else {
                tempChecked.push(e.target.id);
            }
            console.log(tempChecked)
            setChecked(tempChecked);
        } else {
            console.log(e.target)
            router.push(`/instance/${id}/files?path=${path}/${e.target.innerText}`.replace("//", "/"))
        }
    }
    return (
        <>
        {files ? console.log("THE FILES:", files) : ""}
        {error ? console.log("ERROR:", error) : ""}
        <Container>
            <Grid xs={12} container direction="row">
                <Grid item container xs={.6}>
                    {files ? files.list ? <Checkbox checked={allChecked} onClick={(e) => {
                        e.preventDefault();
                        setAllChecked(!allChecked);
                        setChecked([]);
                    }} sx={{mt: "auto", mb: "auto"}}/> : "" : <CircularProgress size={15} color="info" sx={{mt: "auto", mb: "auto"}}/>}
                </Grid>
                <Grid item container xs={4}>
                    <Typography sx={{mt: "auto", mb: "auto"}} variant="body2">{path}</Typography>
                </Grid>
                <Grid item container xs={7.4}>
                    <Button variant="contained" color="info" sx={{mt: "auto", mb: "auto", ml: "auto"}}>Create Directory</Button>
                    <Button variant="contained" color="info" sx={{mt: "auto", mb: "auto", ml: 3}}>Upload</Button>
                    <Button variant="contained" color="info" sx={{mt: "auto", mb: "auto", ml: 3}}>New File</Button>
                </Grid>
            </Grid>
            <Grid xs={12} container sx={{mt: 1}}>
                {!files ? <><Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/>
                <Skeleton  sx={{width: "100%", height: "50px"}} animation="wave"/></> : <></>}
            {files && files.list ? files.list.map((file) => {
/*                 if (file.lastModified) {
                    //if time is less than a day
                    if (moment().diff(moment(file.lastModified), 'days') < 1) {
                        //print fromNow
                        var time = moment(file.lastModified).fromNow()
                    } else {
                        //print date
                        var time = moment(file.lastModified).format("MMMM Do YYYY, h:mm:ss A")
                    }
                } */
                return (
                    <Grid xs={12} id={file.name} key={file.name} container direction="row" sx={{backgroundColor: "#141c26", mb: .2, cursor: "pointer"}} onClick={HandleClicked}>
                        <File file={file} allChecked={allChecked}/>
                        </Grid>
                        )
            }) : ""}
            {files ? typeof(files) != "object" ? <FileEditor file={files} /> : "" : ""}
            </Grid>
            </Container>
        </>
    )
}