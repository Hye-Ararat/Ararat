import axios from "axios"
import { useEffect, useState } from "react"

export default function Deploy({ image, users, node, cpu, memory, type, name, devices }) {
    const [created, setCreated] = useState(false)
    useEffect(() => {
        console.log(image, users, node, cpu, memory, type, image)
        axios.get("/api/v1/images/servers/" + image.serverId).then(res => {
            let config = {
                name: name,
                devices: devices,
                node: node,
                type: type == "Virtual Machine" ? "virtual-machine" : "container",
                source: {
                    alias: image.imageDat.aliases.includes(",") ? image.imageDat.aliases.split(",")[0] : image.imageDat.aliases,
                    mode: "pull",
                    protocol: res.data.metadata.protocol,
                    server: res.data.metadata.url,
                    type: "image"
                },
                config: {
                    "limits.cpu": cpu,
                    "limits.memory": memory
                },
                users: users

            }
            axios.post("/api/v1/instances", config).then(res => {
                setCreated(true);
            })
        })
    }, [])

    return (
        created ? <p>yes</p> : <p>no</p>
    )
}