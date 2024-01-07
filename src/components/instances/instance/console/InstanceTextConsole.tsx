import { NodeLxdInstance } from "@/types/instance";
import { useEffect, useRef, useState } from "react";
import { connectOIDC } from "incus";

import { getCookie } from "cookies-next";
import { Button, Center, Loader, LoadingOverlay, useMantineTheme } from "@mantine/core";
import { getWsErrorMsg } from "@/lib/util";
import Xterm from "@/lib/Term";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit"
import { useRouter } from "next/router";
export default function InstanceTextConsole({ instance }: { instance: NodeLxdInstance }) {
    const theme = useMantineTheme()
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    const xtermRef = useRef<Xterm>(null)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [datWS, setdatWS] = useState<WebSocket>()
    const textEncoder = new TextEncoder();
    var [done, setDone] = useState(false)
    var fitAddon = new FitAddon()
    const router = useRouter();
    const [rerun, setReRun] = useState(0);
    const [state, setState] = useState(instance.status)
    useEffect(() => {
        if (instance.status != state) {
            if (state == "Running") {
                router.reload();
            }
        }
    }, [state])
    useEffect(() => {
        const interval = setInterval(async () => {
            let status = (await client.get(`/instances/${instance.name}?recursion=1`)).data.metadata.status;
            console.log(status)
            setState(status)
        }, 5000)
    }, [])
    useEffect(() => {

        if (xtermRef.current && done == false) {
            fitAddon.fit()
            window.addEventListener('resize', (e) => {
                fitAddon.fit()
            });
            console.log()
            setDone(true)

            /*client.post(`/instances/${instance.name}/console`, {
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
                    xtermRef.current?.terminal.write(await ev.data.text())
                }
                // xtermRef.current?.terminal.onBinary(console.log)
                xtermRef.current?.terminal.onData((d) => {

                    dataWS.send(textEncoder.encode(d))
                })
                router.events.on("routeChangeStart", () => {
                    datWS?.close();
                })
            })
            */
            if (!instance.expanded_config["user.stateless-startup"]) {
                const operations = client.get("/operations?recursion=1").then(({ data }) => {
                    let operations = data.metadata["running"];
                    console.log(operations)
                    let operation;

                    try {
                        let ops = operations.filter((o: any) => o.resources.instances ? o.resources.instances.includes(`/1.0/instances/${instance.name}`) : false)
                        console.log(ops)
                        if (instance.expanded_config["user.stateless-startup"]) {
                            operation = ops.find((o: any) => o.description == "Executing command")
                        } else {
                            operation = ops.find((o: any) => o.description == "Showing console")
                        }
                        console.log(operation)
                    } catch (error) {
                        operation = undefined
                    }

                    if (operation) {
                        if ((operation.description == "Executing command") || (operation.description == "Showing console")) {
                            if (operation.description == "Showing console") {
                                if (instance.type == "container") {
                                    let logs = client.get(`/instances/${instance.name}/console`).then(({ data }) => {
                                        xtermRef.current?.terminal.write(data)
                                        setLoading(false)
                                    })
                                }
                            }
                            let dataWS = new WebSocket(`wss://${instance.node.url.replace("https://", "").replace("8443", "3001")}/operations/${operation.id}/websocket?secret=${operation.metadata.fds["0"]}`)
                            let controlWs = new WebSocket(`wss://${instance.node.url.replace("https://", "").replace("8443", "3001")}/operations/${operation.id}/websocket?secret=${operation.metadata.fds["control"]}`)
                            setdatWS(dataWS)
                            dataWS.onmessage = async (ev) => {
                                xtermRef.current?.terminal.write(await ev.data.text())
                            }
                            // xtermRef.current?.terminal.onBinary(console.log)
                            xtermRef.current?.terminal.onData((d) => {

                                dataWS.send(textEncoder.encode(d))
                            })
                            router.events.on("routeChangeStart", () => {
                                datWS?.close();
                            })
                        }
                    } else {
                        let console = client.post(`/instances/${instance.name}/console`, {
                            "type": "console",
                            "wait-for-websocket": true,
                        }).catch((e) => {
                            setError(getWsErrorMsg(e))
                        }).then(() => {
                            const operations = client.get("/operations?recursion=1").then(({ data }) => {
                                let operations = data.metadata["running"];

                                if (operations == undefined) {
                                    return
                                }
                                let ops = operations.filter((o: any) => o.resources.instances ? o.resources.instances.includes(`/1.0/instances/${instance.name}`) : false)
                                let operation;
                                if (instance.expanded_config["user.stateless-startup"]) {
                                    operation = ops.find((o: any) => o.description == "Executing command")
                                } else {
                                    operation = ops.find((o: any) => o.description == "Showing console")
                                }
                                if (operation) {
                                    if ((operation.description == "Executing command") || (operation.description == "Showing console")) {
                                        if (operation.description == "Showing console") {
                                            if (instance.type == "container") {
                                                let logs = client.get(`/instances/${instance.name}/console`).then(({ data }) => {
                                                    xtermRef.current?.terminal.write(data)
                                                    setLoading(false)
                                                })
                                            }
                                        }
                                        let dataWS = new WebSocket(`wss://${instance.node.url.replace("https://", "").replace("8443", "3001")}/operations/${operation.id}/websocket?secret=${operation.metadata.fds["0"]}`)
                                        let controlWs = new WebSocket(`wss://${instance.node.url.replace("https://", "").replace("8443", "3001")}/operations/${operation.id}/websocket?secret=${operation.metadata.fds["control"]}`)
                                        setdatWS(dataWS)
                                        dataWS.onmessage = async (ev) => {
                                            xtermRef.current?.terminal.write(await ev.data.text())
                                        }
                                        // xtermRef.current?.terminal.onBinary(console.log)
                                        xtermRef.current?.terminal.onData((d) => {

                                            dataWS.send(textEncoder.encode(d))
                                        })
                                        router.events.on("routeChangeStart", () => {
                                            datWS?.close();
                                        })
                                    }
                                }
                            })
                        })
                    }
                })
            } else {
                let dataWS = new WebSocket(`wss://${instance.node.url.replace("https://", "").replace("8443", "3001")}/instance/${instance.name}/console?access_token=${access_token}`)
                setdatWS(dataWS)
                dataWS.onmessage = async (ev) => {
                    xtermRef.current?.terminal.write(await ev.data.text())
                }
                // xtermRef.current?.terminal.onBinary(console.log)
                xtermRef.current?.terminal.onData((d) => {

                    dataWS.send(textEncoder.encode(d))
                })
                router.events.on("routeChangeStart", () => {
                    datWS?.close();
                })
            }

            return () => {
                datWS?.close()
            }
        }
    }, [rerun])
    return (
        <>
            <div style={{ borderRadius: "10px", padding: "13px", backgroundColor: theme.colors.dark[7], marginTop: "10px" }}>
                <Xterm ref={xtermRef} onData={console.log} onBinary={console.log} onKey={console.log} addons={[fitAddon]} options={{
                    theme: {
                        "background": theme.colors.dark[7]
                    }
                }} />
            </div>

        </>
    )
}