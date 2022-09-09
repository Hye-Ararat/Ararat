import { Button, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import widgets from "../lib/widgets.json";
import { WidgetsArea } from "./widgets";
const Console = dynamic(() => import("./instance/Console"), {
    ssr: false
});

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
export default function AddWidgetPopover({ type, gridId, resourceId, userId }) {
    const [sizeReady, setSizeReady] = useState(false)
    const [selectedWidget, setSelectedWidget] = useState(null)
    const [sizes, sizeState] = useState({});
    const [widget, setWidget] = useState({})
    console.log("THIS IS THE TYPE", type)

    useEffect(() => {
        setWidget({
            widget: selectedWidget,
            size: JSON.stringify(sizes),
            widgetGridId: gridId
        })
        console.log(widget)
    }, [selectedWidget, sizes])
    const router = useRouter()
    return (
        <Paper sx={{ padding: 2, minWidth: 400 }}>
            <Grid container direction="column">
                <Typography variant="h6" align="center" fontFamily="Poppins">Add Widget</Typography>
                <Divider sx={{ mt: 1, mb: 1 }} />
                <Typography variant="h6" align="center" fontFamily="Poppins">Select Widget</Typography>
                {widgets[type].map((widget, index) => {
                    return (
                        <Button key={index} sx={{ mr: "auto", ml: "auto", mb: 1 }} onClick={() => {
                            setSizeReady(true)
                            setSelectedWidget(widget)
                        }} variant="contained" color={selectedWidget == widget ? "primary" : "info"}>{widget.charAt(0).toUpperCase() + widget.slice(1)}</Button>
                    )
                })}
                {sizeReady ?
                    <>
                        <SizeSelect sizeState={sizeState} />
                        <Button onClick={async () => {
                            console.log(sizes)
                            let widgs = []
                            widgs.push(widget)
                            console.log(widget, "widget")
                            if (type == "instance") {
                                await axios.put(`/api/v1/instances/${resourceId}/users/${userId}/widgetGrids/${widget.widgetGridId}/widgets`, widgs)
                                router.reload()
                            }
                        }} variant="contained" color="success">Add Widget</Button>
                    </> : ""}
            </Grid>
        </Paper>
    )
}