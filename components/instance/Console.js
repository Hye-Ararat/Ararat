import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import { FitAddon } from "xterm-addon-fit"
import { InstanceStore } from "../../states/instance"
import ResizeObserver from "react-resize-observer"
import { Fade } from "@mui/material"

export default function Console() {
    let terminal = useRef(null);
    let fitAddon = useRef(new FitAddon());
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
        sockets: {
            console: InstanceStore.useStoreState((state) => state.sockets.console),
            setConsole: InstanceStore.useStoreActions((state) => state.sockets.setConsole)
        }
    }
    useEffect(() => {
        if (!instance.sockets.console) {
            instance.sockets.setConsole(new WebSocket(`${instance.data.node.ssl ? "wss" : "ws"}://${instance.data.node.address}:${instance.data.node.port}/v1/instances/${instance.data.id}/console`))
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
            terminal.current = new Terminal({
                fontSize: 12,
                theme: {
                    background: "#141c26",
                },
            });
            terminal.current.loadAddon(fitAddon.current);
            terminal.current.open(document.getElementById("xterm"));
            terminal.current.onResize((size) => {
                fitAddon.current.fit()
            })
            if (window["sessionStorage"]) {
                if (sessionStorage.getItem(`console-${instance.data.id}`)) {
                    setTimeout(() => {
                        if (!has) {
                            terminal.current.write(sessionStorage.getItem(`console-${instance.data.id}`).replace("null", ""));
                        }
                    }, 30)
                }
            }
            const attachAddon = new AttachAddon(instance.sockets.console);
            terminal.current.loadAddon(attachAddon);
            fitAddon.current.fit();
        }
    }, [instance.sockets.console])
    return (
        <>
            <Fade in={true}>
                <div id="cont" style={{ width: "100%", height: "100%", padding: 10, borderRadius: 5, backgroundColor: "#141c26" }}>

                    <div id="xterm" style={{ width: "100%", height: "100%" }} />

                    <ResizeObserver onResize={(rec) => {
                        fitAddon.current.fit()
                    }} />
                </div>
            </Fade>

        </>
    )
}