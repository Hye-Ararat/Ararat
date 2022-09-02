import { Grid, Paper } from "@mui/material";
import dynamic from "next/dynamic";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, rectIntersection, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { rectSortingStrategy, rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Console = dynamic(() => import("./instance/Console"), {
    ssr: false
});
const ResourceCharts = dynamic(() => import("../components/instance/ResourceCharts"), {
    ssr: false
});

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: isDragging ? grid * 2 : "",
    background: isDragging ? 'lightgreen' : '',
    borderRadius: isDragging ? "5px" : "",
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    display: 'flex',
    padding: isDraggingOver ? grid : "",
    overflow: 'auto',
    borderRadius: isDraggingOver ? "5px" : "",
    backgroundColor: isDraggingOver ? 'grey' : '',
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