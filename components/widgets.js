import { Button, Grid, Popover } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import AddGridPopover from "./addGridDialog";
import AddWidgetDialog from "./addWidgetDialog";
import InstanceInfoTop from "./InstanceInfoTop";

const Console = dynamic(() => import("./instance/Console"), {
    ssr: false
});
const ResourceCharts = dynamic(() => import("../components/instance/ResourceCharts"), {
    ssr: false
});



export function Widget({ type, widget, editMode, widgets, resourceId, userId }) {
    const router = useRouter();


    return (
        <>
            {type == "instance" ?
                <Grid direction="column" container xs={JSON.parse(widget.size).xs} sx={{ border: editMode ? "dashed gray" : "" }}>
                    <Grid container>
                        {widget.widget == "console" ? <Console /> : ""}
                        {widget.widget == "instanceInfoBar" ? <InstanceInfoTop /> : ""}
                        {widget.widget == "resourceCharts" ? <ResourceCharts /> : ""}
                    </Grid>
                    {editMode ? <Button onClick={async () => {
                        console.log("DELETE")
                        console.log(widget.id, "IDDD")
                        let newWidgets = widgets.filter((w) => w.id != widget.id)
                        console.log(newWidgets, "new")
                        await axios.patch(`/api/v1/${type}s/${resourceId}/users/${userId}/widgetGrids/${widget.widgetGridId}/widgets`, newWidgets)
                        router.reload()
                    }} sx={{ ml: "auto" }} variant="contained" color="error">Delete Widget</Button> : ""}

                </Grid>
                : ""}
        </>
    )


}






export function WidgetsArea({ areas, type, editMode, setAreas, children, resourceId, userId }) {
    console.log(areas, "areas")
    const router = useRouter()
    console.log("editMode", editMode)
    const [ordered_grids, setOrderedGrids] = useState(areas.map(area => area).sort((a, b) => a.index - b.index))
    console.log(ordered_grids, "ordered")
    const [anchorEl, setAnchorEl] = useState(null)
    const [openId, setOpenId] = useState(null)
    const [addOpen, setAddOpen] = useState(false)
    const [addGridOpen, setAddGridOpen] = useState(false)
    return (
        <Grid container>
            {ordered_grids.map((area, index) => {
                console.log(area, "le area")
                let area_id = area.id;
                console.log(area_id, "area_id")
                console.log("THE AREA", area)
                return (
                    <Grid key={index} container direction={area.direction} xs={JSON.parse(area.size).xs} sx={{ border: editMode ? "dashed #133542" : "", mb: 1 }}>
                        {area.widgets.map((widget, index) => {
                            return (
                                <Widget userId={userId} resourceId={resourceId} editMode={editMode} key={index} type={type} widget={widget} widgets={area.widgets} />
                            )
                        })}
                        {editMode ?
                            <Grid container>
                                {editMode ? <Button onClick={async () => {
                                    await axios.delete(`/api/v1/${type}s/${resourceId}/users/${userId}/widgetGrids/${area_id}`)
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