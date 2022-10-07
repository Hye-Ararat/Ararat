import { Check } from "@mui/icons-material"
import { Avatar, CircularProgress, Dialog, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Deploy({ image, users, node, cpu, memory, type, name, devices, instanceConfig }) {
    const [created, setCreated] = useState(false)
    const [opId, setOpId] = useState(null)
    const [currentOpStatus, setCurrentOpStatus] = useState(null)
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
                    "limits.memory": memory,
                    ...instanceConfig
                },
                users: users

            }
            axios.post("/api/v1/instances", config).then(res => {
                setOpId(res.data.operation);
                setCreated(true);
            })
        })
    }, [])
    useEffect(() => {
        if (opId) {
            const interval = setInterval(() => {
                axios.get(opId).then(res => {
                    if (!res.data.metadata.metadata) clearInterval(interval)
                    setCurrentOpStatus(res.data.metadata.metadata[Object.keys(res.data.metadata.metadata)[0]]);
                }).catch(err => {
                    setCurrentOpStatus("Done");
                    clearInterval(interval);
                    console.log(err)
                })
            }, 500);
        }
    }, [opId])
    useEffect(() => {
        if (currentOpStatus == "Done") {
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        }
    }, [currentOpStatus])

    return (
        created ?
            currentOpStatus ?
                <Dialog open={() => {
                    return true;
                }}>
                    <Grid container direction="column">
                        <Typography variant="h6" sx={{ p: 2 }}>
                            {currentOpStatus.replace(`"`, "") == "Done" ? "Instance Created!" : "Creating Instance..."}
                        </Typography>
                        {currentOpStatus.replace(`"`, "") == "Done" ? <Avatar variant="rounded" sx={{ mr: "auto", ml: "auto", width: 50, height: 50, backgroundColor: "#163a3a", mb: 1 }}>
                            <Check sx={{ color: "#1ee0ac", fontSize: 40 }} />
                        </Avatar> : <CircularProgress sx={{ mr: "auto", ml: "auto" }} />}
                        <Typography sx={{ mb: 2 }} align="center">{currentOpStatus == "Done" ? "Complete!" : currentOpStatus}</Typography>
                    </Grid>
                </Dialog> : "" : <p>Please wait...</p>
    )
}