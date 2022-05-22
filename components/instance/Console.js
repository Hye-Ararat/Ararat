import { useEffect, useState } from "react"
import { Terminal } from "xterm"
import "xterm/css/xterm.css"
import { AttachAddon } from "xterm-addon-attach"
import { FitAddon } from "xterm-addon-fit"
import { InstanceStore } from "../../states/instance"
import ResizeObserver from "react-resize-observer"
import { Fade, Paper } from "@mui/material"

export default function Console() {
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
        sockets: {
            console: InstanceStore.useStoreState((state) => state.sockets.console),
            setConsole: InstanceStore.useStoreActions((state) => state.sockets.setConsole)
        }
    }
    const [fitAddon, setFitAddon] = useState(new FitAddon())
    useEffect(() => {
        if (!instance.sockets.console) {
            instance.sockets.setConsole(new WebSocket(`ws://${instance.data.node.address}:${instance.data.node.port}/v1/instances/${instance.data.id}/console`))
        } else {
            let has = false;
            instance.sockets.console.addEventListener("open", () => {
                instance.sockets.console.addEventListener("message", (dat) => {
                    has = true;
                    if (window["sessionStorage"]) {
                        sessionStorage.setItem(`console-${instance.data.id}`, sessionStorage.getItem(`console-${instance.data.id}`) ? sessionStorage.getItem(`console-${instance.data.id}`) + Buffer.from(dat.data, "binary").toString() : Buffer.from(dat.data, "binary").toString());
                    }
                })
            })
            let terminal = new Terminal({
                fontSize: 12,
                theme: {
                    background: "#141c26"
                }
            });
            terminal.open(document.getElementById("terminal"));
            if (window["sessionStorage"]) {
                if (sessionStorage.getItem(`console-${instance.data.id}`)) {
                    setTimeout(() => {
                        if (!has) {
                            terminal.write(sessionStorage.getItem(`console-${instance.data.id}`).replace("null", ""));
                        }
                    }, 30)
                }
            }
            terminal.loadAddon(fitAddon);
            fitAddon.fit();
            const attachAddon = new AttachAddon(instance.sockets.console);
            terminal.loadAddon(attachAddon);
            //get dom rect
            let lastRect = null;
            const inter = setInterval(() => {
                let el = document.getElementById("cont")
                let xtermel = document.getElementsByClassName("xterm-viewport")[0];
                if (lastRect) {
                    if (lastRect.width == el.getBoundingClientRect().width) {
                        clearInterval(inter);
                    }
                }
                lastRect = el.getBoundingClientRect();
                if (xtermel) {
                    xtermel.style.width = el.getBoundingClientRect().width - 5 + 'px';
                    xtermel.style.height = el.getBoundingClientRect().height + 'px';
                }
                fitAddon.fit();
            }, 0.00000000000000000001)
        }
    }, [instance.sockets.console])
    return (
        <>
            <Fade in={true} appear={true}>

                <Paper id="cont" sx={{ width: "100%", background: "#141c26", minHeight: "45vh" }}>
                    <div id="terminal" style={{ width: "100%", height: "100%", borderRadius: "5px", overflow: "hidden", padding: 5 }} />

                    <ResizeObserver onResize={(rec) => {
                        let lastRect = null;
                        const inter = setInterval(() => {
                            let el = document.getElementById("cont")
                            let xtermel = document.getElementsByClassName("xterm-viewport")[0];
                            if (lastRect) {
                                if (lastRect.width == el.getBoundingClientRect().width) {
                                    clearInterval(inter);
                                }
                            }
                            lastRect = el.getBoundingClientRect();
                            xtermel.style.width = el.getBoundingClientRect().width - 5 + 'px';
                            xtermel.style.height = el.getBoundingClientRect().height + 'px';
                            fitAddon.fit();
                            console.log("e")
                        }, 0.00000000000000000001)
                    }} />
                </Paper>
            </Fade>

        </>
    )
}