import { NodeLxdInstance } from "@/types/instance";
import { useEffect, useRef, useState } from "react";
import { connectOIDC } from "js-lxd";

import { getCookie } from "cookies-next";
import { Button, Center, Loader, LoadingOverlay } from "@mantine/core";
import { getWsErrorMsg } from "@/lib/util";
import Xterm from "@/lib/Term";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit"
export default function InstanceTextConsole({ instance }: { instance: NodeLxdInstance }) {
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    const xtermRef = useRef<Xterm>(null)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [datWS, setdatWS] = useState<WebSocket>()
    const textEncoder = new TextEncoder();
    var [done, setDone] = useState(false)
    var fitAddon = new FitAddon()
    useEffect(() => {
        
        if (xtermRef.current && done == false) {
            fitAddon.fit()
            window.addEventListener('resize', (e) => {
                fitAddon.fit()
            });
            console.log()
            setDone(true)
            
            client.post(`/instances/${instance.name}/console`, {
                "type": "console",
                "wait-for-websocket": true,
              }).then(({ data }) => {
                const operationUrl = data.operation.split("?")[0];
                const dataUrl = `wss://${instance.node.url.replace("https://", "")}${operationUrl}/websocket?secret=${data.metadata.metadata.fds["0"]}`;
                const controlUrl = `wss://${instance.node.url.replace("https://", "")}${operationUrl}/websocket?secret=${data.metadata.metadata.fds.control}`;
                const dataWS = new WebSocket(dataUrl);
                setdatWS(dataWS)
                const controlWS = new WebSocket(controlUrl);
                dataWS.onmessage = async (ev) => {
                    console.log(ev)
                    console.log(await ev.data.text())
                    xtermRef.current?.terminal.write(await ev.data.text())
                }
               // xtermRef.current?.terminal.onBinary(console.log)
                xtermRef.current?.terminal.onData((d) => {
                    console.log(d)
                    dataWS.send(textEncoder.encode(d))
                })
            })
        }
    }, [])
    return (
        <>

            <Xterm ref={xtermRef} onData={console.log} onBinary={console.log} onKey={console.log} addons={[fitAddon]}/>

        </>
    )
}