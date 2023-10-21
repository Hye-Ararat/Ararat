"use client";

import { Badge } from "@mantine/core";
import { useEffect, useState } from "react";

export default function NodePowerStatus({ node }) {
  const [powerStatus, setPowerStatus] = useState("loading...");
  function powerStatusColor() {
    if (powerStatus == "Running") return "green";
    if (powerStatus == "Stopped") return "red";
    return "yellow";
  }
  useEffect(() => {
    async function getPowerStatus() {
      let status = await fetch(`/api/nodes/${node.id}/powerStatus`, {
        cache: "no-cache",
      });
      status = await status.json();
      if (status.powerStatus == "on") return setPowerStatus("Running");
      if (status.powerStatus == "off") return setPowerStatus("Stopped");
      return setPowerStatus("Unknown");
    }
    getPowerStatus();
    const interval = setInterval(() => {
      getPowerStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Badge size="sm" variant="light" color={powerStatusColor()}>
      {powerStatus}
    </Badge>
  );
}
