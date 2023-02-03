import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from "xterm-addon-attach"
import { FitAddon } from "xterm-addon-fit"
import { InstanceStore } from "../../states/instance"
import ResizeObserver from "react-resize-observer"
import { Fade, Grid, Button, Paper, TextField, Popover, CircularProgress, IconButton } from "@mui/material"
import useEventListener from "../../lib/useEventListener"
import { debounce } from "debounce"
import nookies from "nookies";
import { VncScreen } from "react-vnc"
import { Menu } from "@mui/icons-material"

export default function Console({ minHeight }) {
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
    }
    useEffect(() => {
        console.log(instance.data)
    }, [instance.data])
    return (
        <>
            {instance.data ?
                <>
                    {instance.data.type == "kvm" ? <>
                        {instance.data.config["user.console"] != "vnc" ? <TextConsole /> : <VgaConsole minHeight={minHeight} />}
                    </> : <TextConsole />}
                </>
                : ""}
        </>
    )
}

export function VgaConsole({ minHeight }) {
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
    }
    var theRef = useRef(null)
    const [pasteData, setPasteData] = useState("")
    const [pasting, setPasting] = useState(false)
    const [overlayOpen, setOverlayOpen] = useState(false)
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (instance.data && url.length < 1) {
            let cookies = nookies.get();
            let token = cookies["access_token"];
            setUrl(`wss://${instance.data.node.url.split("//")[1]}/api/v1/instances/${instance.data.id}/console?authorization=${token}`)
        }
    }, [instance.data])
    useEffect(() => {
        console.log(theRef.current)
    }, [theRef.current])
    console.log(theRef.current)
    return (
        <>

            {/* <VNC actionBar={(props) => {
          return (
            <p>e</p>
          )
        }} connectionName="127.0.0.1:6080" isSecure={false} onDisconnected={() => console.log("e")} password={"fA8o8tTY"} /> */}
            <IconButton sx={{ position: "absolute", zIndex: 1 }} id="overlay" onClick={() => setOverlayOpen(true)}><Menu /></IconButton>
            <Popover onClose={() => {
                setOverlayOpen(false)
                setPasting(false)
            }} open={overlayOpen} anchorEl={() => document.getElementById("overlay")} sx={{ zIndex: 1, width: "100%" }} >
                <Grid container sx={{ minWidth: "100%" }}>
                    <Button variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={() => setPasting(true)}>Paste</Button>
                    <Button variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={() => {
                        if (theRef.current) {
                            if (theRef.current.connected) {
                                theRef.current.sendCtrlAltDel()
                            }
                        }
                    }}>Control+Alt+Delete</Button>
                    <Button variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={(e) => {
                        if (theRef.current) {
                            if (theRef.current.connected) {
                                //send windows key
                                theRef.current.sendKey(91, "Windows")
                            }
                        }
                    }}>Windows Key</Button>
                    <Button variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={() => {
                        if (theRef.current) {
                            if (theRef.current.connected) {
                                //send tab key
                                theRef.current.sendKey(9, "Tab")
                            }
                        }
                    }}>Tab</Button>
                    <Button variant="contained" sx={{ mr: "auto", ml: "auto" }} onClick={() => {
                        if (theRef.current) {
                            if (theRef.current.connected) {
                                //send escape key
                                theRef.current.sendKey(27, "Escape")
                            }
                        }
                    }}>Escape</Button>
                </Grid>
                {pasting ?
                    <Paper elevation={3} sx={{ padding: "10px" }}>
                        <Grid container>
                            <TextField
                                variant="standard"
                                placeholder="Paste Data"
                                value={pasteData}
                                onChange={(e) => setPasteData(e.target.value)}
                                sx={{ width: "100%" }}
                            />
                            <Button variant="contained" color="success" sx={{ mt: 1 }} onClick={() => {
                                console.log(theRef.current)
                                for (var i = 0; i < pasteData.length; i++) {
                                    theRef.current.sendKey(pasteData.charCodeAt(i))
                                }
                                setPasting(false)
                                setTimeout(() => {
                                    setPasteData("")
                                }, 100)

                            }}>Paste</Button>                        </Grid>
                    </Paper> : ""}
            </Popover>
            <Grid container xs={12} sx={{ height: "100%", width: "100%" }}>

                {url.length > 0 ?
                    <div id="cont" style={{ width: "100%", height: "100%", padding: 10, borderRadius: 5, backgroundColor: "#141c26", minHeight: minHeight ? minHeight : "100%", maxHeight: "100%", maxWidth: "100%" }}>
                        <ResizeObserver
                            onResize={(e) => {
                                console.log(e)
                                if (theRef.current) {
                                    //if (theRef.current.rfb) {
                                    theRef.current.disconnect()
                                    theRef.current.connect()
                                    //}

                                }
                            }}
                        />
                        <VncScreen
                            onConnect={() => {
                                setTimeout(() => {
                                    console.log(theRef.current)
                                    theRef.current.rfb._canvas.style.maxWidth = "100%"
                                    theRef.current.rfb._canvas.style.height = "100%"
                                }, 300)
                            }}
                            loadingUI={(
                                <>
                                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                        <CircularProgress />
                                    </div>
                                </>
                            )}
                            url={url}
                            qualityLevel={9}
                            scaleViewport
                            background="transparent"
                            debug
                            rfbOptions={
                                {
                                    credentials: {
                                        password: "fA8o8tTY"
                                    },
                                }
                            }
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            ref={theRef}

                        />

                    </div> : ""}
            </Grid>
        </>
    )
}

export function TextConsole() {
    const termRef = useRef(null);
    let terminal = useRef(null);
    let fitAddon = useRef(new FitAddon());
    const [created, setCreated] = useState(false);
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
        sockets: {
            console: InstanceStore.useStoreState((state) => state.sockets.console),
            setConsole: InstanceStore.useStoreActions((state) => state.sockets.setConsole)
        },
        monitor: InstanceStore.useStoreState((state) => state.monitor)
    }
    useEffect(() => {
        if (instance.data) {
            if (!instance.sockets.console) {
                let cookies = nookies.get();
                instance.sockets.setConsole(new WebSocket(`wss://${instance.data.node.url.split("//")[1]}/api/v1/instances/${instance.data.id}/console?authorization=${cookies.authorization}`));
            } else {
                if (!created) {
                    setCreated(true)
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
                terminal.current.open(termRef.current);
                // terminal.current.onResize((size) => {
                //fitAddon.current.fit()
                // })
                if (window["sessionStorage"]) {
                    if (sessionStorage.getItem(`console-${instance.data.id}`)) {
                        setTimeout(() => {
                            if (!has) {
                                console.log(instance.monitor.state)
                                if (!instance.monitor.state !== "running") {
                                    terminal.current.write(sessionStorage.getItem(`console-${instance.data.id}`).replace("null", ""));
                                }
                            }
                        }, 30)
                    }
                }
                const attachAddon = new AttachAddon(instance.sockets.console);
                terminal.current.loadAddon(attachAddon);
                fitAddon.current.fit();
            }
            }
        }
    }, [instance.sockets.console, instance.data, created])
    window.addEventListener("resize", debounce(() => {
        try {
            fitAddon.current.fit();

        } catch {

        }
    }, 0))
    return (
        <>
            <Fade in={true}>
                <div id="cont" style={{ width: "100%", height: "100%", padding: 10, borderRadius: 5, backgroundColor: "#141c26" }}>

                    <div ref={termRef} style={{ height: "100%" }} />

                    <ResizeObserver onResize={(rec) => {
                        fitAddon.current.fit()
                    }} />
                </div>
            </Fade>

        </>
    )
}