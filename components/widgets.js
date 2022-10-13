import { Button, Grid, Popover, Typography } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import AddGridPopover from "./addGridDialog";
import AddWidgetDialog from "./addWidgetDialog";
import InstanceInfoTop from "./InstanceInfoTop";
import widgetsList from "../lib/widgets.json"
import ExtensionWidget from "./instance/ExtensionWidget";

const Console = dynamic(() => import("./instance/Console"), {
    ssr: false
});
const CpuChart = dynamic(() => import("../components/instance/CpuChart"), {
    ssr: false
});
const MemoryChart = dynamic(() => import("../components/instance/MemoryChart"), {
    ssr: false
});



export function Widget({ type, widget, editMode, widgets, resourceId, userId, resourceData }) {
    const router = useRouter();


    return (
        <>
            {type == "instance" ?
                <Grid direction="column" container xs={JSON.parse(widget.size).xs} sx={{ border: editMode ? "dashed gray" : "" }}>
                    <Grid container sx={{ padding: 1 }}>
                        {widget.widget == "console" ? <Console /> : ""}
                        {widget.widget == "memory-chart" ? <MemoryChart /> : ""}
                        {widget.widget == "cpu-chart" ? <CpuChart /> : ""}
                        {!widgetsList[type].includes(widget.widget) ? resourceData ? <ExtensionWidget widget={widget.widget} image={resourceData.metadata.config} /> : "" : ""}
                    </Grid>
                    {editMode ? <Button onClick={async () => {
                        console.log("DELETE")
                        console.log(widget.id, "IDDD")
                        let newWidgets = widgets.filter((w) => w.id != widget.id)
                        console.log(newWidgets, "new")
                        await axios.patch(`/api/v1/${type}s/${resourceId}/users/${userId}/widgetGrids/${widget.widgetGridId}/widgets`, newWidgets)
                        let path = router.asPath
                        if (!router.query.edit) path = path + "?edit=true"
                        router.replace(path, path, { shallow: false })
                        router.reload()
                    }} sx={{ ml: "auto" }} variant="contained" color="error">Delete Widget</Button> : ""}

                </Grid>
                : ""}
        </>
    )


}






export function WidgetsArea({ areas, type, editMode, setAreas, children, resourceId, userId, resourceData }) {
    console.log(areas, "areas")
    const router = useRouter()
    console.log("editMode", editMode)
    const [ordered_grids, setOrderedGrids] = useState(areas.map(area => area).sort((a, b) => a.index - b.index))
    console.log(ordered_grids, "ordered")
    const [anchorEl, setAnchorEl] = useState(null)
    const [openId, setOpenId] = useState(null)
    const [addOpen, setAddOpen] = useState(false)
    const [addGridOpen, setAddGridOpen] = useState(false)
    console.log(resourceData, "resourceData")
    return (
        <Grid container>
            {ordered_grids.length == 0 ? <Grid container direction="column">
                <Typography sx={{ mr: "auto", ml: "auto" }} variant="h5">You do not have any widget grids</Typography>
                <Button color="success" variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={(e) => {
                    setAnchorEl(e.currentTarget)
                    setAddGridOpen(true)
                }}>Add One</Button>

            </Grid> : ""}
            {ordered_grids.map((area, index) => {
                console.log(area, "le area")
                let area_id = area.id;
                console.log(area_id, "area_id")
                console.log("THE AREA", area)
                return (
                    <Grid key={index} container direction={area.direction} xs={JSON.parse(area.size).xs} sx={{ border: editMode ? "dashed #133542" : "", mb: 1 }}>
                        {area.widgets.length == 0 && editMode ? <Grid container direction="column">
                            <Typography sx={{ mr: "auto", ml: "auto" }} variant="h5">You do not have any widgets in this grid</Typography>
                            <Button color="success" variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={(e) => {
                                setAnchorEl(e.currentTarget)
                                setOpenId(area_id)
                                setAddOpen(true)
                            }}>Add One</Button>
                        </Grid> : ""}
                        {area.widgets.map((widget, index) => {
                            return (
                                <Widget resourceData={resourceData} userId={userId} resourceId={resourceId} editMode={editMode} key={index} type={type} widget={widget} widgets={area.widgets} />
                            )
                        })}
                        {editMode ?
                            <Grid container>
                                {editMode ? <Button onClick={async () => {
                                    await axios.delete(`/api/v1/${type}s/${resourceId}/users/${userId}/widgetGrids/${area_id}`)
                                    let path = router.asPath
                                    if (!router.query.edit) path = path + "?edit=true"
                                    router.replace(path, path, { shallow: false })
                                    router.reload()
                                }} sx={{ ml: "auto" }} variant="contained" color="error">Delete Grid</Button> : ""}
                                {editMode ? <Button onClick={(e) => {
                                    setAnchorEl(e.currentTarget)
                                    setAddOpen(true)
                                    setOpenId(area_id)
                                }} variant="contained" color="success">Add Widget</Button> : ""}
                            </Grid>
                            : ""}

                    </Grid>
                )
            })}
            <Popover onClose={() => setAddOpen(false)} sx={{ borderRadius: "20px" }} open={addOpen} anchorEl={anchorEl} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}>
                <AddWidgetDialog type={type} resourceId={resourceId} userId={userId} gridId={openId} />
            </Popover>
            <Popover onClose={() => setAddGridOpen(false)} sx={{ borderRadius: "20px" }} open={addGridOpen} anchorEl={anchorEl} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}>
                <AddGridPopover type={type} resourceId={resourceId} userId={userId} />
            </Popover>
            {editMode ? <Button sx={{ ml: "auto" }} variant="contained" color="success" onClick={(e) => {
                setAnchorEl(e.currentTarget)
                setAddGridOpen(true)
            }}>Add Grid</Button> : ""}
        </Grid>
    )
}