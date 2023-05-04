import { Button, Divider, Grid, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export function SizeSelect({ sizeState }) {
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
        <Grid container direction="column">
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

export default function AddGridPopover({ type, resourceId, userId }) {
    const [size, setSize] = useState(null)
    const [index, setIndex] = useState(null)
    const [direction, setDirection] = useState("row")
    const router = useRouter()
    return (
        <Paper sx={{ padding: 2, minWidth: 400 }}>
            <Grid container direction="column">
                <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily={"Poppins"}>Add Grid</Typography>
                <Divider />
                <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily="Poppins">Direction</Typography>
                <Paper sx={{ backgroundColor: "#0d141d" }}>
                    <Select sx={{ width: "100%" }} value={direction} variant="standard">
                        <MenuItem onClick={() => setDirection("row")} value="row">Row</MenuItem>
                        <MenuItem onClick={() => setDirection("column")} value="column">Column</MenuItem>
                    </Select>
                </Paper>
                <Typography sx={{ mr: "auto", ml: "auto" }} variant="h6" fontFamily="Poppins">Index</Typography>
                <TextField onChange={(e) => setIndex(parseInt(e.target.value))} variant="standard" placeholder="0" />
                <SizeSelect sizeState={setSize} />
            </Grid>
            <Button onClick={async () => {
                const data = {
                    direction,
                    index,
                    size: JSON.stringify(size)
                }
                await axios.post(`/api/v1/${type}s/${resourceId}/users/${userId}/widgetGrids`, data)
                let path = router.asPath
                if (!router.query.edit) path = path + "?edit=true"
                router.replace(path, path, { shallow: false })
                router.reload()
            }} variant="contained" color="success" sx={{ width: "100%" }}>Add Grid</Button>
        </Paper>
    )
}