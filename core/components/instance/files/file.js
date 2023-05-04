import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Typography, Checkbox, Menu, MenuItem, Fade, useMediaQuery } from "@mui/material"
import prettyBytes from "pretty-bytes"
import { Fragment, useState } from "react";
import { MoreHoriz } from "@mui/icons-material";
import moment from "moment";
import {useTheme} from "@mui/material/styles";


export default function File({ file, allChecked }) {
    const [checked, setChecked] = useState(false)
    const [open, setOpen] = useState(false)
    function handleClick(e) {
        console.log("clicked")
        e.preventDefault()
        //set prop checked to true
        if (checked == false) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }

    return (
        <>
            {useMediaQuery(useTheme().breakpoints.up("sm")) ?
                <Grid item container xs={.6} sm={1.5} md={.7} lg={.6}>
                    <Checkbox checked={checked || allChecked} id={file.Name} sx={{ mt: "auto", mb: "auto" }} onClick={handleClick} />
                </Grid>
                : ""}
            <Grid item container xs={6.5} sm={4} md={5} direction="row">
                <FontAwesomeIcon icon={file.IsDir ? faFolder : faFile} style={{ marginTop: "auto", marginBottom: "auto", marginRight: 6, color: "grey" }} />
                <Typography noWrap sx={{ mt: "auto", mb: "auto", mr: 3, fontWeight: "bold" }} variant="body2">{file.Name}</Typography>
            </Grid>
            {useMediaQuery(useTheme().breakpoints.up("sm")) ?
                <Grid item container xs={1}>
                    <Typography sx={{ mt: "auto", mb: "auto" }} variant="body2">{file.Size != null || file.Size != undefined ? prettyBytes(parseInt(file.Size)) : ""}</Typography>
                </Grid>
                : ""}
            <Grid item container xs={4} sm={3} sx={{ ml: "auto" }}>
                <Typography noWrap sx={{ mt: "auto", mb: "auto" }} variant="body2">{file.ModTime != null || file.ModTime != undefined ? moment().diff(moment(file.ModTime), 'days') < 7 ? moment(file.ModTime).fromNow() : moment(file.ModTime).format("MMMM Do YYYY, h:mm A") : ""}</Typography>
            </Grid>
            <Grid item container xs={1} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                <MoreHoriz id={`options${file.Name}`} sx={{ ml: "auto", mr: 2 }} onClick={() => {
                    setOpen(!open);
                }} />
                <Menu open={open} onClose={() => setOpen(false)} anchorEl={() => {
                    return document.getElementById("options" + file.Name);
                }}>
                    <MenuItem>Delete</MenuItem>
                </Menu>
            </Grid>
        </>
    )
}