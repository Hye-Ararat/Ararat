"use client";
import "xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { FitAddon } from "xterm-addon-fit";
import nookies from "nookies";
import { AttachAddon } from "xterm-addon-attach";
import { CircularProgress } from "../../../components/base";
import { Terminal } from "xterm";
import correctWs from "isomorphic-ws"


export default function OperationSocket({operation}) {
    let terminal = useRef(null);
    let termRef = useRef(null);
    let fitAddon = useRef(new FitAddon());
    useEffect(() => {
        let accessToken = nookies.get()["access_token"];
        const controlSocket = new correctWs(`wss://us-dal-1.hye.gg/1.0/operations/${operation.id}/correctWs?secret=${operation.metadata.fds["control"]}`);
        let consoleSocket = new correctWs(`wss://us-dal-1.hye.gg/1.0/operations/${operation.id}/websocket?secret=${operation.metadata.fds["0"]}`);
        terminal.current = new Terminal({
            fontSize: 12,
            theme: {
                background: "#141c26",
            },
        });
        terminal.current.loadAddon(fitAddon.current);
        terminal.current.open(termRef.current);
        fitAddon.current.fit();
        const attachAddon = new AttachAddon(consoleSocket);
        terminal.current.loadAddon(attachAddon);
    })
    return (
        <>
        {termRef == null ? <CircularProgress sx={{m: "auto"}} /> : ""}
        <div id="cont" style={{ width: "100%", height: "100%", padding: 10, borderRadius: 5, backgroundColor: "#141c26" }}>
        <div ref={termRef} style={{ height: "100%" }} />
            </div>
        </>
    )
}