import { useEffect } from "react"
import {Terminal} from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import Spice from "./spice";

export default function TermComponent(props) {
    useEffect(() => {
        const term = new Terminal({})
        term.open(document.getElementById("terminal"))
        const socket = new WebSocket(`wss://nl-brd-1.hye.gg:2221/api/v1/servers/${props.server}/console?type=xterm`)
        socket.onopen = () => {
            socket.send('{"event":"authenticate"}')
            console.log("CONNECTED")
        }
        const attachAddon = new AttachAddon(socket);
        term.loadAddon(attachAddon);
    }, [])
    
    return (
        <>
        <Spice />
        <div id="terminal"></div>
        </>
    )
}