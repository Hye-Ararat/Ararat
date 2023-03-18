"use client";

import { useEffect } from "react";
import { Typography, CircularProgress } from "../../../components/base";

export default function Redirect({interaction, url}) {
    useEffect(() => {
        if (!interaction) {
        window.location.href = url;
        }
    }, [])

    return (
        <>
        <CircularProgress sx={{mt: 2}} />
        <Typography variant="h6">Getting ready for authentication...</Typography>
        </>
    )
}