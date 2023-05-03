"use client";

import FileEditor from "./FileEditor"
import { Tabs, Tab, Grid, Divider, IconButton, Tooltip, Paper, Typography, Accordion, AccordionActions, AccordionSummary } from "../../../../../components/base";
import Console from "../Console";
import { useEffect } from "react";
import { Close, ExpandMore } from "@mui/icons-material";

export default function FileView({ file, path, instance, accessToken, instanceData }) {
    return (
        <>
            <Grid container direction="row" sx={{mt: 2}}>
                <Grid container xs={1.8}>
                    <Paper sx={{width: "100%", p: 2}}>
                    <Typography variant="h6">/root</Typography>
                    <Accordion elevation={-1.5}>
                        <AccordionSummary expandIcon={<ExpandMore />}>server</AccordionSummary>
                        <Paper sx={{p: 1, borderRadius: "4px", m: 1}}>eula.txt</Paper>
                    </Accordion>
                    <Paper elevation={-1.5} sx={{p: 1, borderRadius: "4px", mb: 1}}>donut</Paper>
                    <Paper elevation={-1.5} sx={{p: 1, borderRadius: "4px", mb: 1}}>donut.c</Paper>
                    <Paper elevation={19} sx={{p: 1, borderRadius: "4px", mb: 1}}>eee.js</Paper>

                    </Paper>
                </Grid>
                <Grid container xs={10} sx={{ml: "auto"}}>
                    <Paper sx={{width: "100%"}}>
                    <Tabs value={0} sx={{ maxWidth: '80vw', m: 0.7}} variant="scrollable" scrollButtons="auto">
                        <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>
                        } />
                         <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>

                        } /> <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>

                        } /> <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>

                        } /> <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>

                        } /> <Tab label={
                            <span>
                                <Tooltip title="Close File">
                                    <IconButton sx={{ color: "#e85347" }} size="small">
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                eee.js
                            </span>

                        } />


                    </Tabs>
                    </Paper>
                    <FileEditor file={file.data} path={path} instance={instance} />
                </Grid>
                <Grid xs={12} sx={{ maxHeight: "20vh", width: "100%" }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography sx={{mb: 1}}>Console</Typography>
                        <Console instance={instanceData} />
                    </Grid>
            </Grid>
        </>
    )
}