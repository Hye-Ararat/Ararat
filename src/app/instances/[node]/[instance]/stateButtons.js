"use client";

import { Button, Flex } from "@mantine/core-app";
import { connectOIDC } from "incus";
import { useEffect, useState } from "react";


export default function StateButtons({ instance, node, accessToken }) {
    const [instanceStatus, setInstanceStatus] = useState(instance.status);
    const [allowKill, setAllowKill] = useState(false);
    useEffect(() => {
        const interval = setInterval(async () => {
            const client = connectOIDC(node.url, accessToken);
            const { data } = await client.get(`/instances/${instance.name}`);
            setInstanceStatus(data.metadata.status);
        }
            , 1000);
        return () => clearInterval(interval);
    }, [])
    return (
        <Flex ml="auto" my="auto">
            <Button onClick={async () => {
                const client = connectOIDC(node.url, accessToken);
                await client.put(`/instances/${instance.name}/state`, { action: "start", force: false });
            }} disabled={instanceStatus == "Running"} mr="xs" color="green">Start</Button>
            <Button onClick={async () => {
                setAllowKill(true);
                const client = connectOIDC(node.url, accessToken);
                await client.put(`/instances/${instance.name}/state`, { action: "stop", force: allowKill });
                setAllowKill(false);
            }} disabled={instanceStatus == "Stopped"} mr="xs" color="red"> {allowKill ? "Kill" : "Stop"}</Button>
            <Button onClick={async () => {
                const client = connectOIDC(node.url, accessToken);
                await client.put(`/instances/${instance.name}/state`, { action: "restart", force: false });
            }} disabled={instanceStatus == "Stopped"} color="yellow">Restart</Button>

        </Flex>
    )
}