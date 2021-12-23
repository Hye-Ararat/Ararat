import { useEffect, useLayoutEffect, useState } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import {FitAddon} from "xterm-addon-fit"
import Spice from "./spice";
import ResizeObserver from "react-resize-observer";
const fitAddon = new FitAddon();
export default function TermComponent(props) {
    console.log(props)
    useEffect(() => {
        if (props.server.relationships.magma_cube != null) {
            if (props.server.relationships.magma_cube.console == "xterm") {
                const term = new Terminal({
                    renderType: "dom",

                })
                term.loadAddon(fitAddon);
                term.open(document.getElementById("terminal"))
                term.write(".")
                var interval = setInterval(() => {
                    term.write(".")
                }, 4)
                    fitAddon.fit()
                const socket = new WebSocket(`wss://${props.server.relationships.node.address.hostname}:${props.server.relationships.node.address.port}/api/v1/servers/${props.server.id}/console?type=xterm`)
                socket.onopen = () => {
                    socket.send('{"event":"authenticate"}')
                    console.log("CONNECTED")
                    clearInterval(interval)
                }
                socket.onerror = (error) => {

                }
                const attachAddon = new AttachAddon(socket);
                term.loadAddon(attachAddon);

            }
        }
    }, [props.server])
    return (
        <>
            {props.server.relationships.magma_cube != null ?
                props.server.relationships.magma_cube.console == "vga" ?
                    <Spice />
                    :
                    <>
                    <ResizeObserver onResize={rect => {
                            fitAddon.fit()
                   }} />
                    <div id="terminal" style={{width: "100%"}}></div>
                    </>
                :
                ""}
        </>
    )
}