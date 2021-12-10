import { useEffect } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import Spice from "./spice";

export default function TermComponent(props) {
    console.log(props)
    useEffect(() => {
        if (props.server.relationships.magma_cube != null) {
        if (props.server.relationships.magma_cube.console == "xterm") {
            const term = new Terminal({})
            term.open(document.getElementById("terminal"))
            const socket = new WebSocket(`wss://${props.server.relationships.node.address.hostname}:${props.server.relationships.node.address.port}/api/v1/servers/${props.server.id}/console?type=xterm`)
            socket.onopen = () => {
                socket.send('{"event":"authenticate"}')
                console.log("CONNECTED")
            }
            const attachAddon = new AttachAddon(socket);
            term.loadAddon(attachAddon);
        }
    }
    }, [])
    return (
        <>
            {props.server.relationships.magma_cube ? props.server.relationships.magma_cube.console == "vga" ? <Spice /> : <div id="terminal" style={{width: "100%"}}></div> : ""}
        </>
    )
}