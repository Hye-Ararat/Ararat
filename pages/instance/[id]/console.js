import { InstanceStore } from "../../../states/instance";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios"
import useSWR from "swr";
import { useEffect } from "react";
import StateIndicator from "../../../components/instance/StateIndicator";
const Terminal = dynamic(() => import("../../../components/instances/terminal"), {
    ssr: false
});

export default function Console({ data }) {
    const router = useRouter();
    const { id } = router.query;
    const instance = {
        data: InstanceStore.useStoreState((state) => state.data),
        setData: InstanceStore.useStoreActions((state) => state.setData),
        containerState: InstanceStore.useStoreState((state) => state.containerState),
        setContainerState: InstanceStore.useStoreActions((state) => state.setContainerState),
        monitor: InstanceStore.useStoreState((state) => state.monitor),
        setMonitor: InstanceStore.useStoreActions((state) => state.setMonitor),
        sockets: {
            monitor: InstanceStore.useStoreState((state) => state.sockets.monitor),
            setMonitor: InstanceStore.useStoreActions((state) => state.sockets.setMonitor)
        },
    }
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const { data: instanceData } = useSWR(`/api/v1/client/instances/${id}?include=["magma_cube", "node", "network"]`, fetcher);
    useEffect(() => {
        if (instance.data) {
            console.log("yes");
            console.log("yes2");
            if (instance.sockets.monitor) {
                instance.sockets.monitor.onopen = () => {
                    axios.get("/api/v1/client/instances/" + instance.data._id + "/monitor/ws").then((res) => {
                        instance.sockets.monitor.send(res.data.data.access_token);
                    });
                };
            } else {
                instance.sockets.setMonitor(
                    new WebSocket(
                        `${instance.data.relationships.node.address.ssl ? "wss" : "ws"}://${instance.data.relationships.node.address.hostname
                        }:${instance.data.relationships.node.address.port}/api/v1/instances/${instance.data._id}/monitor`
                    )
                );
            }
        } else {
            console.log("no");
        }
    }, [instance.data, instance.sockets.monitor]);
    useEffect(() => {
        if (instance.data) {

        } else {
            instance.setData(instanceData);
        }
    }, [instance.data, instanceData])
    useEffect(() => {
        if (instance.sockets.monitor) {
            instance.sockets.monitor.onmessage = (data) => {
                console.log(JSON.parse(JSON.stringify(data.data)));
                var e = JSON.parse(data.data);
                instance.setMonitor(e);
                instance.setContainerState(e.containerState);
            };
        }
    }, [instance.sockets.monitor]);
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css"
                integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w=="
                crossOrigin="anonymous"
                referrerpolicy="no-referrer"
            />
            <div style={{ height: "100%" }}>
                {instance.data ? instance.containerState ?
                    <Terminal instance={instance.data} state={instance.containerState} instanceId={id} external={true} />
                    : "" : ""}
            </div>
        </>
    )
}
Console.getLayout = function getLayout(page) {
    return (
        <InstanceStore.Provider>
            {page}
        </InstanceStore.Provider>
    )
}