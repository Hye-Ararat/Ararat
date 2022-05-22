import { useState } from "react";
import Deploy from "./create/Deploy";
import Devices from "./create/Devices";
import Identity from "./create/Identity";
import SelectImage from "./create/SelectImage";
import SelectNode from "./create/SelectNode";
import SelectType from "./create/SelectType";
import SetResources from "./create/SetResources";
import Users from "./create/Users";


export default function CreateInstance({ setCreatingInstance }) {
    const [page, setPage] = useState("selectNode");
    const [node, setNode] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [type, setType] = useState(null);
    const [cpu, setCpu] = useState(null);
    const [memory, setMemory] = useState(null);
    const [users, setUsers] = useState([]);

    const [devices, setDevices] = useState({
        "root": {
            "type": "disk",
            "path": "/",
            "pool": "default"
        }
    });
    const [name, setName] = useState(null);

    return (
        <>
            {page == "selectNode" ?
                <SelectNode setCreatingInstance={setCreatingInstance} setPage={setPage} setNode={setNode} />
                : ""}
            {page == "selectImage" ?
                <SelectImage setPage={setPage} setImageData={setImageData} />
                : ""}
            {page == "imageType" ?
                <SelectType setType={setType} setPage={setPage} imageData={imageData} />
                : ""}
            {page == "resources" ?
                <SetResources setPage={setPage} setCpu={setCpu} setMemory={setMemory} />
                : ""}
            {page == "devices" ?
                <Devices setPage={setPage} devices={devices} setDevices={setDevices} node={node} />
                : ""}
            {page == "identity" ?
                <Identity setPage={setPage} setName={setName} />
                : ""}
            {page == "users" ?
                <Users setPage={setPage} setUsers={setUsers} users={users} />
                : ""}
            {page == "deploy" ?
                <Deploy name={name} image={imageData} users={users} node={node} cpu={cpu} memory={memory} type={type} devices={devices} /> : ""}
        </>
    )
}