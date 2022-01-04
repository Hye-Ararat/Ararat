import { useEffect, memo } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import {FitAddon} from "xterm-addon-fit"
import Spice from "./spice";
import ResizeObserver from "react-resize-observer";
const fitAddon = new FitAddon();
var term = null;
function TermComponent(props) {
    useEffect(() => {
        if (props.instance.relationships.magma_cube != null) {
            if (props.instance.relationships.magma_cube.console == "xterm") {
                term = new Terminal()
                term.loadAddon(fitAddon);
                term.open(document.getElementById("terminal"))
                    fitAddon.fit()
                const socket = new WebSocket(`ws://81.205.168.8:3535/api/v1/instances/${props.instance.id}/console`)
                socket.onopen = () => {
                    socket.send('{"event":"authenticate"}')
                }
                socket.onerror = (error) => {
                    console.log(error)
                }
                const attachAddon = new AttachAddon(socket);
                term.loadAddon(attachAddon);
                var controlws = new WebSocket(`ws://81.205.168.8:3535/api/v1/instances/${props.instance.id}/control`)
                controlws.onopen = () => {
                    window.onresize = () => {
                        var dimensions = fitAddon.proposeDimensions();
                        if (controlws) {
                            controlws.send(JSON.stringify({event: "resize", rows: dimensions.rows, cols: dimensions.cols}))
                        } 
                    }
                }
                return () => {
                    socket.close()
                    term.dispose()
                    controlws.close()
                    window.onresize = null
                }
            }
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
                    <Spice />
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
                            fitAddon.fit()
                        }
                
                   }} />
                    <div id="terminal" style={{width: "100%"}}></div>
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