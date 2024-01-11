"use client";

import { Badge } from "@mantine/core-app";
import { getBadgeColor } from '@/lib/util';
import { useEffect, useState } from "react";
import { connectOIDC } from "incus";

export default function StateIndicator({ node, instance, accessToken }) {
    const [instanceStatus, setInstanceStatus] = useState(instance.status);
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
        <Badge mt={5} variant="dot" color={getBadgeColor(instanceStatus)}>{instanceStatus}</Badge>
    )
}