import { NodeLxdInstance } from "@/types/instance";
import * as SpiceHtml5 from "@/lib/spice/src/main";
import { useEffect, useRef, useState } from "react";
import { connectOIDC } from "incus";
import { getCookie } from "cookies-next";
import { ActionIcon, Button, Center, Group, Progress, TextInput } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { SpiceFileXferTask } from "@/lib/spice/src/filexfer";
import { SpiceMsgcKeyDown } from "@/lib/spice/src/spicemsg";
import { IconMaximize } from "@tabler/icons-react";
declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        spice_connection?: SpiceHtml5.SpiceMainConn;
    }
}

export default function InstanceVGAConsole({ instance }: { instance: NodeLxdInstance }) {
    const [spiceconn, setSpiceconn] = useState<SpiceHtml5.SpiceMainConn>()
    const spiceRef = useRef<HTMLDivElement>(null);
    var access_token = (getCookie("access_token") as string)
    const client = connectOIDC(instance.node.url, access_token)
    const [clipboardData, setClipboardData] = useState("")
    const [controlWS, setControlWS] = useState<WebSocket>()
    function handleResize() {
        SpiceHtml5.handle_resize()
    }
    useEffect(() => {
        if (!window.spice_connection) {

            window.addEventListener("resize", handleResize)
            client.post(`/instances/${instance.name}/console`, {
                type: "vga",
                width: 0,
                height: 0,
            }).then(({ data }) => {
                const operationUrl = data.operation.split("?")[0];
                const dataUrl = `wss://${instance.node.url.replace("https://", "")}${operationUrl}/websocket?secret=${data.metadata.metadata.fds["0"]}`;
                const controlUrl = `wss://${instance.node.url.replace("https://", "")}${operationUrl}/websocket?secret=${data.metadata.metadata.fds.control}`;

                const control = new WebSocket(controlUrl);
                setControlWS(control)
                var spice_connection = new SpiceHtml5.SpiceMainConn({
                    uri: dataUrl,
                    screen_id: "spice-screen",
                    onerror: (e: any) => console.log(e),
                    onsuccess: () => {
                        console.log("EYEYQWEYEQWEQWE")
                        SpiceHtml5.handle_resize()
                    },
                    onagent: console.log,
                    onclipboardRequest: () => {
                        console.log("REQUEST")
                        //@ts-expect-error
                        return (document.getElementById("clipboard")).value
                    },
                    onclipboardWrite: (data: string) => {
                        setClipboardData(data)
                    }
                });
                window.spice_connection = spice_connection
                var spice_xfer_area = document.createElement("div");
                spice_xfer_area.setAttribute('id', 'spice-xfer-area');
                (document.getElementById('spice-area') as HTMLElement).appendChild(spice_xfer_area);
                (document.getElementById('spice-area') as HTMLElement).addEventListener('dragover', SpiceHtml5.handle_file_dragover, false);
                (document.getElementById('spice-area') as HTMLElement).addEventListener('drop', (e) => {
                    SpiceHtml5.handle_file_drop(e);
                    const audio = new Audio("/audio/transfer.mp3");
                    audio.play();
                }, false);

                setSpiceconn(spice_connection)
            })
            return () => {
                console.log("close")
                controlWS?.close()
                window.removeEventListener("resize", handleResize)
            }
        }

    }, [])

    const handleFullScreen = () => {
        const container = spiceRef.current;
        if (!container) {
            return;
        }
        container
            .requestFullscreen()
            .then(() => SpiceHtml5.handle_resize())
            .catch((e) => {
                console.log("Failed to enter full-screen mode", e);
            });
    };

    return (
        <>

            <div style={{ borderRadius: "10px", padding: "13px", backgroundColor: "#1a1b1e", marginTop: "10px" }}>
                <Group mb="10px">
                    <ActionIcon onClick={handleFullScreen} variant="light" color="blue"><IconMaximize /></ActionIcon>
                    <Button size="xs" variant="light" color="teal" onClick={() => SpiceHtml5.sendCtrlAltDel(window.spice_connection)}>CTRL + ALT + DEL</Button>
                    <TextInput placeholder="Clipboard" size="xs" id="clipboard" value={clipboardData} style={{ marginLeft: "auto", width: "20vw" }} onChange={(e) => {
                        console.log(e.currentTarget.value)
                        setClipboardData(e.currentTarget.value)
                    }} />
                    <Button size="xs" variant="light" onClick={SpiceHtml5.handle_paste} mr={0} style={{ alignSelf: "flex-end" }}>Write</Button>
                </Group>

                <div id="spice-area" ref={spiceRef}>
                    <div id="spice-screen" className="spice-screen"></div>
                </div>
            </div>
            <Group style={{ width: "100%", marginLeft: "auto" }} mt={"lg"}>


            </Group>
        </>


    )
}