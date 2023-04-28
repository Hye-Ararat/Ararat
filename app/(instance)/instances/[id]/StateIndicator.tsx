"use client";

import { Circle } from "../../../../components/base";


export default function StateIndicator({status}) {

    return (
        <>
       <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: status == "Running" ? "#1ee0ac" : "red" }} />
      <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: status == "Running" ? "#1ee0ac" : "red", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
        </>
    )
}