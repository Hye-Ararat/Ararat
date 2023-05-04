import { useEffect, useState, memo } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import { FitAddon } from "xterm-addon-fit"
import Spice from "./spice";
import ResizeObserver from "react-resize-observer";
import axios from "axios"
import { InstanceStore } from "../../states/instance";
import { Fade, Paper, Typography, Grid } from "@mui/material"
import StateIndicator from "../instance/StateIndicator";
const fitAddon = new FitAddon();
function TermComponent(props) {
    let term;
    const instance = {
        sockets: {
            console: InstanceStore.useStoreState(state => state.sockets.console),
            setConsole: InstanceStore.useStoreActions(state => state.sockets.setConsole),
            control: InstanceStore.useStoreState(state => state.sockets.control),
            setControl: InstanceStore.useStoreActions(state => state.sockets.setControl),
            consoleReady: InstanceStore.useStoreState(state => state.sockets.consoleReady),
            setConsoleReady: InstanceStore.useStoreActions(state => state.sockets.setConsoleReady)
        }
    }
    useEffect(() => {
        if (props.instance.image != null) {
            if (props.instance.image.console == "xterm") {
                console.log("THIS IS GOING")
                if (!instance.sockets.console) {
                    instance.sockets.setConsole(new WebSocket(`${props.instance.node.ssl ? "wss" : "ws"}://${props.instance.node.hostname}:${props.instance.node.port}/api/v1/instances/${props.instance.id}/console`));
                } else if (!instance.sockets.control) {
                    instance.sockets.setControl(new WebSocket(`${props.instance.node.ssl ? "wss" : "ws"}://${props.instance.node.hostname}:${props.instance.node.port}/api/v1/instances/${props.instance.id}/control`))
                } else {
                    console.log("THIS IS GOING 2")
                    if (!instance.sockets.consoleReady) {
                        instance.sockets.console.onmessage = (e) => {
                            function isJSON(leJson) {
                                console.log(leJson)
                                try {
                                    JSON.parse(leJson)
                                } catch (error) {
                                    return false
                                }
                                return true
                            }
                            console.log(isJSON(e.data.toString()))
                            if (isJSON(e.data.toString())) {
                                var data = JSON.parse(e.data.toString())
                                console.log(data)
                                if (data.event == "ready") {
                                    axios.get("/api/v1/client/instances/" + props.instanceId + "/console/ws").then((res) => {
                                        res = res.data;
                                        instance.sockets.console.send(`{"event":"authenticate", "data": "${res}"}`)
                                        instance.sockets.console.onmessage = null
                                        instance.sockets.setConsoleReady(true)
                                    })
                                }
                            }
                        }
                    } else {
                        instance.sockets.control.onopen = () => {
                            axios.get("/api/v1/client/instances/" + props.instanceId + "/console/ws").then((res) => {
                                res = res.data;
                                instance.sockets.control.send(`{"event":"authenticate", "data": "${res}"}`)
                                window.onresize = () => {
                                    var dimensions = fitAddon.proposeDimensions();
                                    instance.sockets.control.send(JSON.stringify({ event: "resize", data: { cols: dimensions.cols, rows: dimensions.rows } }))
                                }
                            })
                        }
                        term = new Terminal({
                            fontSize: 12,
                            theme: {
                                background: "#141c26"
                            }
                        });
                        console.log("GOING STILL")
                        term.loadAddon(fitAddon);
                        term.open(document.getElementById("terminal"))
                        fitAddon.fit()
                        const attachAddon = new AttachAddon(instance.sockets.console);
                        term.loadAddon(attachAddon);
                        instance.sockets.console.onclose = () => {
                            instance.sockets.setConsole(null);
                            instance.sockets.setConsoleReady(false);
                        }
                    }
                }
            }
        } else {
            console.log("no xterm a")
        }
        return () => {
            if (term) {
                console.log("closing terminal")
                term.dispose()
            }
            window.onresize = null
        }
    }, [props.instance, instance.sockets.console, instance.sockets.control, instance.sockets.consoleReady])
    return (
        <>
            <link rel="stylesheet" type="text/css" href="/xterm.css" />
            {/*props.instance.image != null ?
                props.instance.image.console == "vga" ?
                    <Spice instance={props.instance} />
                    :
                    <>
                        <Fade in={instance.sockets.console} style={{ height: "100%", minHeight: props.external ? "100vh" : "500px", width: "100%" }}>
                            <Paper sx={{ p: 1, background: "#141c26", minHeight: props.external ? "100vh" : "" }}>
                                <ResizeObserver onResize={rect => {
                                    if (props.instance.image.console == "xterm") {
                                        var yes = document.getElementsByClassName("xterm-viewport");
                                        yes = yes[0];
                                        console.log(rect.width)
                                        if (yes) {
                                            yes.style.width = `${rect.width}px`;
                                            yes.style.height = `${rect.height}px`;
                                            yes.style.minHeight = props.external ? "90vh" : "500px";
                                        }
                                        fitAddon.fit()
                                    }

                                }} />
                                <Grid container direction="row" sx={{ borderBottom: "1px solid rgb(30, 34, 48)" }}>
                                    <Typography fontWeight="bold">{props.external ? props.instance.name + " Console" : "Console"}</Typography>
                                    {props.external ?
                                        <StateIndicator />
                                        : ""}
                                </Grid>
                                <div style={{ width: "100%", minHeight: props.external ? "90vh" : "500px" }}>
                                    <div id="terminal" className="thisIsLeTerminal" style={{ height: "100%", minHeight: props.external ? "90vh" : "500px", borderRadius: "5px", borderColor: "rgb(30, 40, 50)", overflowY: "hidden", background: "#141c26" }}></div>
                                </div>
                            </Paper>
                        </Fade>
                    </>
                :
                ""
                                    */}
        </>
    )
}
function areEqual(prevProps, nextProps) {
    console.log("are equal?", JSON.stringify(prevProps) === JSON.stringify(nextProps))
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}
export default memo(TermComponent, areEqual)