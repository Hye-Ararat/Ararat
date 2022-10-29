import { useState } from "react";
import SelectHost from "./create/host";
import Install from "./create/install";
import NodeInfo from "./create/nodeInfo";

export default function CreateNode() {
    const [page, setPage] = useState("host");
    const [nodeName, setNodeName] = useState(null);
    const [nodeAddress, setNodeAddress] = useState(null);
    const [nodePort, setNodePort] = useState(3000);
    const [lxdPort, setLxdPort] = useState(8443);
    const [sftpPort, setSftpPort] = useState(2222);

    return (
        <>
            {page == "host" ?
                <SelectHost setPage={setPage} />
                : ""}
            {page == "nodeInfo" ?
                <NodeInfo setPage={setPage} nodeName={nodeName} setNodeName={setNodeName} nodeAddress={nodeAddress} setNodeAddress={setNodeAddress} nodePort={nodePort} setNodePort={setNodePort} lxdPort={lxdPort} setLxdPort={setLxdPort} sftpPort={sftpPort} setSftpPort={setSftpPort} />
                : ""}
            {page == "install" ?
                <Install sftpPort={sftpPort} nodeAddress={nodeAddress} lxdPort={lxdPort} nodePort={nodePort} setPage={setPage} nodeName={nodeName} />
                : ""}
        </>
    )

}
