"use client";

import {Grid, Tooltip, IconButton, Button, Paper, Typography, Popover, Select, MenuItem, TextField} from "../../../../components/base";
import { Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

export default function WidgetEditor({editingWidgets, setEditingWidgets, widgets}) {
    const [addingGrid, setAddingGrid] = useState(false);
    const [currentAnchor, setCurrentAnchor] = useState(null);
    return (
    <Grid container sx={{mt: 3}}>
        {editingWidgets ? 
        <>
        <Popover open={addingGrid} onClose={() => setAddingGrid(false)} anchorEl={currentAnchor}>
            <AddGridPopover />
        </Popover>
        <Button
        onClick={(e) => {
            setCurrentAnchor(e.currentTarget);
            setAddingGrid(!addingGrid)
        }}
        sx={{my: "auto"}} variant="contained" color="success">Add Grid</Button>
        </>
        : ""}
    <Tooltip sx={{ml: "auto", my: "auto"}} title={`${editingWidgets ? "Exit Layout Editor" : "Edit Layout"}`}>
        <IconButton onClick={() => setEditingWidgets(!editingWidgets)}>
            <Edit />
        </IconButton>
    </Tooltip>
</Grid>
    )
}

function AddGridPopover() {
    const [direction, setDirection] = useState("row" as "row" | "column" | "row-reverse" | "column-reverse" | undefined);
    const [index, setIndex] = useState(0);
    const [size, setSize] = useState(null)
    return (
        <Paper sx={{p: 2, minWidth: 400}}>
            <Grid container direction="column">
            <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily={"Poppins"}>Add Grid</Typography>
            </Grid>
            <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily="Poppins">Direction</Typography>
            <Paper sx={{ backgroundColor: "#0d141d" }}>
                    <Select sx={{ width: "100%" }} value={direction} variant="standard">
                        <MenuItem onClick={() => setDirection("row")} value="row">Row</MenuItem>
                        <MenuItem onClick={() => setDirection("column")} value="column">Column</MenuItem>
                    </Select>
                </Paper>
                <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily="Poppins">Index</Typography>
                <TextField onChange={(e) => setIndex(parseInt(e.target.value))} variant="standard" placeholder="0" />
                <GridSizeSelect sizeState={setSize} />
                <Button variant="contained" color="success" sx={{width: "100%", mt: 2}}>Add Grid</Button>
        </Paper>
    )
}

function GridSizeSelect({ sizeState }) {
    const [sizeXs, setSizeXs] = useState(null)
    const [sizeSm, setSizeSm] = useState(null)
    const [sizeMd, setSizeMd] = useState(null)
    const [sizeLg, setSizeLg] = useState(null)
    const [sizeXl, setSizeXl] = useState(null)
    useEffect(() => {
        sizeState({
            xs: sizeXs,
            sm: sizeSm,
            md: sizeMd,
            lg: sizeLg,
            xl: sizeXl
        })
    }, [sizeXs, sizeSm, sizeMd, sizeLg, sizeXl])
    return (
        <Grid container direction="column" sx={{mt: 1}}>
            <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily={"Poppins"}>Configure Size</Typography>
            <Grid container direction="row" >
                <Typography fontWeight={400} fontSize="20px" sx={{ mr: 5, fontWeight: 600, mb: 1 }}>Extra Small</Typography>
                <TextField onChange={(e) => setSizeXs(parseInt(e.target.value))} variant="standard" placeholder="12" sx={{ ml: "auto", mb: "auto" }} />
            </Grid>
            <Grid container direction="row" >
                <Typography fontWeight={400} fontSize="20px" sx={{ mr: 5, fontWeight: 600, mb: 1 }}>Small</Typography>
                <TextField onChange={(e) => setSizeSm(parseInt(e.target.value))} variant="standard" placeholder="12" sx={{ ml: "auto", mb: "auto" }} />
            </Grid>
            <Grid container direction="row" >
                <Typography fontWeight={400} fontSize="20px" sx={{ mr: 5, fontWeight: 600, mb: 1 }}>Medium</Typography>
                <TextField onChange={(e) => setSizeMd(parseInt(e.target.value))} variant="standard" placeholder="12" sx={{ ml: "auto", mb: "auto" }} />
            </Grid>
            <Grid container direction="row" >
                <Typography fontWeight={400} fontSize="20px" sx={{ mr: 5, fontWeight: 600, mb: 1 }}>Large</Typography>
                <TextField onChange={(e) => setSizeLg(parseInt(e.target.value))} variant="standard" placeholder="12" sx={{ ml: "auto", mb: "auto" }} />
            </Grid>
            <Grid container direction="row" >
                <Typography fontWeight={400} fontSize="20px" sx={{ mr: 5, fontWeight: 600, mb: 1 }}>Extra Large</Typography>
                <TextField onChange={(e) => setSizeXl(parseInt(e.target.value))} variant="standard" placeholder="12" sx={{ ml: "auto", mb: "auto" }} />
            </Grid>

        </Grid>)
}