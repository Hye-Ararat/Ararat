import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Grid, Typography, Checkbox} from "@mui/material"
import prettyBytes from "pretty-bytes"
import { useState } from "react";


export default function File({file, allChecked}) {
    const [checked, setChecked] = useState(false)
    function handleClick(e){
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
        <Checkbox checked={checked || allChecked} id={file.name} sx={{mt: "auto", mb: "auto"}} onClick={handleClick}/>
    </Grid>
    <Grid item container xs={6} direction="row">
        <FontAwesomeIcon icon={file.type == "directory" ? faFolder : faFile} style={{marginTop: "auto", marginBottom: "auto", marginRight: 6, color: "grey"}}/>
        <Typography sx={{mt: "auto", mb: "auto", mr: 3, fontWeight: "bold"}} variant="body2">{file.name}</Typography>
    </Grid>
    <Grid item container xs={1}>
        <Typography sx={{mt: "auto", mb: "auto"}} variant="body2">{file.size ? prettyBytes(parseInt(file.size)) : ""}</Typography>
    </Grid>
    <Grid item container xs={4}>
        {/*<Typography sx={{mt: "auto", mb: "auto"}} variant="body2">{time ? time : ""}</Typography>*/}
    </Grid>
    </>
    )
}