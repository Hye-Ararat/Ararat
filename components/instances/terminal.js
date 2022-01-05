import { useEffect, useState, memo } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import {FitAddon} from "xterm-addon-fit"
import Spice from "./spice";
import ResizeObserver from "react-resize-observer";
import axios from "axios"
const fitAddon = new FitAddon();
function TermComponent(props) {
    let term;
    let socket;
    let controlws;
    useEffect(() => {
        if (props.instance.relationships.magma_cube != null) {
            if (props.instance.relationships.magma_cube.console == "xterm") {
                axios.get("/api/v1/client/instances/" + props.instanceId + "/console/ws").then((res) => {
                    res = res.data;
                    term = new Terminal()
                    term.loadAddon(fitAddon);
                    term.open(document.getElementById("terminal"))
                        fitAddon.fit()
                    socket = new WebSocket(`${props.instance.relationships.node.address.ssl ? "wss" : "ws"}://${props.instance.relationships.node.address.hostname}:${props.instance.relationships.node.address.port}/api/v1/instances/${props.instance._id}/console`)
                    socket.onopen = () => {
                        socket.send(`{"event":"authenticate", "data": ${res}}`)
                    }
                    socket.onerror = (error) => {
                        console.log(error)
                    }
                    const attachAddon = new AttachAddon(socket);
                    term.loadAddon(attachAddon);
                    controlws = new WebSocket(`${props.instance.relationships.node.address.ssl ? "wss" : "ws"}://${props.instance.relationships.node.address.hostname}:${props.instance.relationships.node.address.port}/api/v1/instances/${props.instance._id}/control`)
                    controlws.onopen = () => {
                        window.onresize = () => {
                            var dimensions = fitAddon.proposeDimensions();
                            if (controlws) {
                                controlws.send(JSON.stringify({event: "resize", rows: dimensions.rows, cols: dimensions.cols}))
                            } 
                            fitAddon.fit()
                        }
                    }
                    var terms = document.getElementsByClassName("xterm-viewport");
                    console.log(terms.length)
                    setTimeout(() => {
                        if (terms.length > 1) {
                            window.location.reload()
                        }
                    }, 500)
                })

        }
    } else {
        console.log("no xterm a")
    }
    return () => {
        console.log("closing EVERYTHING")
        if (socket) {
            console.log("closing socket")
        socket.close()
        }
        if (term) {
            console.log("closing terminal")
            term.dispose()
        }   
        if (controlws) {
            console.log("closing controlws")

            controlws.close()
        }
        console.log("removing window.onresize")
        window.onresize = null
        console.log("removing terminal")
    }
    }, [props.instance])
    useEffect(() => {
        if (term && props.status != null) {
        term.write("Server " + props.status)
        }
    }, [props.status])
    return (
        <>
        <link rel="stylesheet" type="text/css" href="/xterm.css" />
            {props.instance.relationships.magma_cube != null ?
                props.instance.relationships.magma_cube.console == "vga" ?
                    <Spice instance={props.instance}/>
                    :
                    <>
                    <ResizeObserver onResize={rect => {
                        if (props.instance.relationships.magma_cube.console == "xterm") {
                            var yes = document.getElementsByClassName("xterm-viewport");
                            yes = yes[0];
                            if (yes) {
                            yes.style.width = `${rect.width}px`;
                            yes.style.height = `${rect.height}px`;
                            }
                        }
                
                   }} />
                    <div id="terminal" className="thisIsLeTerminal" style={{width: "100%"}}></div>
                    </>
                :
                ""}
        </>
    )
}
function areEqual(prevProps, nextProps) {
    console.log("are equal?", JSON.stringify(prevProps) === JSON.stringify(nextProps))
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}
export default memo(TermComponent, areEqual)