import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Typography, Checkbox, Menu, MenuItem } from "@mui/material"
import prettyBytes from "pretty-bytes"
import { Fragment, useState } from "react";
import { MoreHoriz } from "@mui/icons-material";


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
            <Grid item container xs={.6}>
                <Checkbox checked={checked || allChecked} id={file.name} sx={{ mt: "auto", mb: "auto" }} onClick={handleClick} />
            </Grid>
            <Grid item container xs={6} direction="row">
                <FontAwesomeIcon icon={file.type == "directory" ? faFolder : faFile} style={{ marginTop: "auto", marginBottom: "auto", marginRight: 6, color: "grey" }} />
                <Typography sx={{ mt: "auto", mb: "auto", mr: 3, fontWeight: "bold" }} variant="body2">{file.name}</Typography>
            </Grid>
            <Grid item container xs={1}>
                <Typography sx={{ mt: "auto", mb: "auto" }} variant="body2">{file.size ? prettyBytes(parseInt(file.size)) : ""}</Typography>
            </Grid>
            <Grid item container xs={1} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                <MoreHoriz id={`options${file.name}`} sx={{ ml: "auto", mr: 2 }} onClick={() => {
                    setOpen(!open);
                }} />
                <Menu open={open} onClose={() => setOpen(false)} anchorEl={() => {
                    return document.getElementById("options" + file.name);
                }}>
                    <MenuItem>Delete</MenuItem>
                </Menu>
            </Grid>
        </>
    )
}