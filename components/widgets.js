import { Grid } from "@mui/material";
import dynamic from "next/dynamic";

const Console = dynamic(() => import("./instance/Console"), {
    ssr: false
});
const ResourceCharts = dynamic(() => import("../components/instance/ResourceCharts"), {
    ssr: false
});



export function Widget({ type, widget, size, id, index, dragDisabled, widgetObject }) {



    return (
        <>
            {type == "instance" ?
                <Grid container xs={JSON.parse(widget.size).xs}>
                    {widget.widget == "console" ? <Console /> : ""}
                    {widget.widget == "resourceCharts" ? <ResourceCharts /> : ""}

                </Grid>
                : ""}
        </>
    )


}






export function WidgetsArea({ areas, type, editMode, setAreas, children }) {
    console.log(areas, "areas")
    let ordered_grids = areas.map(area => area).sort((a, b) => a.index - b.index);
    console.log(ordered_grids)

    return (
        <Grid container>
            {areas.map((area, index) => {
                return (
                    <Grid key={index} container direction={area.direction} xs={JSON.parse(area.size).xs}>
                        {area.widgets.map((widget, index) => {
                            return (
                                <Widget key={index} type={type} widget={widget} />
                            )
                        })}
                    </Grid>
                )
            })}
        </Grid>
    )
}