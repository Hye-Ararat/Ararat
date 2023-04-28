"use client";

import { useState } from "react";
import WidgetEditor from "./WidgetEditor";
import {Grid} from "../../../../components/base"
import dynamic from "next/dynamic"
const Console = dynamic(() => import("./Console"), {ssr: false})

export default function Widgets({instance, widgets}) {
    const [editingWidgets, setEditingWidgets] = useState(false);
    /*
    [
    {
        "widget":"console",
        "sizes": {
            "xs": sizeXs,
            "sm": sizeSm,
            "md": sizeMd,
            "lg": sizeLg,
            "xl": sizeXl
        }
    }
]
*/
    return (
        <>
        {widgets.map((widget) => {
            return (
                <Grid container xs={widget.sizes?.xs} sm={widget.sizes?.sm} md={widget.sizes?.md} lg={widget.sizes?.lg} xl={widget.sizes?.xl} sx={{border: editingWidgets ? "dashed" : "", borderColor: "gray"}}>
                    {widget.widget == "console" ? 
                    <>
                    <Console instance={instance} />
                    </>
                    : ""}
                    
                </Grid>
            )
        })}
        <WidgetEditor widgets={widgets} editingWidgets={editingWidgets} setEditingWidgets={setEditingWidgets} />
        </>
    )
}