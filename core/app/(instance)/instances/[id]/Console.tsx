"use client";
import "xterm/css/xterm.css";
import { useEffect, useRef, useState } from "react";
import {CircularProgress} from "../../../../components/base"
import lxd from "../../../../lib/lxd";
import nookies from "nookies";
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from "xterm-addon-attach"
import { Terminal } from "xterm";
import correctWs from "isomorphic-ws"

export default function Console({instance}) {
    let terminal = useRef(null)
    let termRef = useRef(null)
    const fitAddon = useRef(new FitAddon())
    useEffect(() => {
        let accessToken = nookies.get()["access_token"];
        const client = lxd(accessToken);
        async function getConsole() {
        let socket = await client.instances.instance(instance.name).connectConsole("console");
        const controlSocket = new correctWs(`wss://us-dal-1.hye.gg/1.0/operations/${socket.id}/websocket?secret=${socket.metadata.fds["control"]}`);
       const consoleSocket = new correctWs(`wss://us-dal-1.hye.gg/1.0/operations/${socket.id}/websocket?secret=${socket.metadata.fds["0"]}`);
     /*  consoleSocket.onmessage = async (mess) => {
        console.log(mess.data)
        //make blob buffer
        const arrayBuffer = await mess.data.arrayBuffer();
        terminal.current.write(Buffer.from(arrayBuffer))
       }*/
       //@ts-ignore
       terminal.current = new Terminal({
        fontSize: 12,
        theme: {
            background: "#141c26",
        },
    });
    //@ts-ignore
    terminal.current.loadAddon(fitAddon.current);
    //@ts-ignore
    terminal.current.open(termRef.current);
    fitAddon.current.fit()
    /*terminal.current.onData(data => {
        console.log(data)
        consoleSocket.send(Buffer.from(data), {binary: true})
    })*/
    //@ts-ignore
    const attachAddon = new AttachAddon(consoleSocket);
    //@ts-ignore
    terminal.current.loadAddon(attachAddon);
    

        }
        getConsole();
    }, [])
    return (
        <>
        {termRef == null ?
        <CircularProgress sx={{m: "auto"}} />
        : ""}
        <div id="cont" style={{ width: "100%", height: "100%", padding: 10, borderRadius: 5, backgroundColor: "#141c26" }}>
        <div ref={termRef} style={{ height: "100%" }} />
            </div>
        </>
    )
}