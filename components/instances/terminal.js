import { useEffect, useLayoutEffect, useState } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import {FitAddon} from "xterm-addon-fit"
import Spice from "./spice";
import ResizeObserver from "react-resize-observer";
const fitAddon = new FitAddon();
export default function TermComponent(props) {
    useEffect(() => {
        if (props.instance.relationships.magma_cube != null) {
            if (props.instance.relationships.magma_cube.console == "xterm") {
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
                const socket = new WebSocket(`wss://${props.instance.relationships.node.address.hostname}:${props.instance.relationships.node.address.port}/api/v1/instances/${props.instance.id}/console?type=xterm`)
                socket.onopen = () => {
                    socket.send('{"event":"authenticate"}')
                    clearInterval(interval)
                }
                socket.onerror = (error) => {

                }
                const attachAddon = new AttachAddon(socket);
                term.loadAddon(attachAddon);

            }
        }
    }, [props.instance])
    return (
        <>
            {props.instance.relationships.magma_cube != null ?
                props.instance.relationships.magma_cube.console == "vga" ?
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