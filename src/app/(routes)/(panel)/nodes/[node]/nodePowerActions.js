"use client";

import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function NodePowerActions({ node }) {
  const [powerStatus, setPowerStatus] = useState(null);
  const router = useRouter();
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
    <>
      <Button
        color="green"
        disabled={
          powerStatus ? (powerStatus == "Running" ? true : false) : true
        }
        mr="xs"
        onClick={async () => {
          await fetch(`/api/nodes/${node.id}/power`, {
            method: "POST",
            body: JSON.stringify({ action: "on" }),
          });
        }}
      >
        Start
      </Button>
      <Button
        color="red"
        mr="xs"
        disabled={
          powerStatus ? (powerStatus == "Stopped" ? true : false) : true
        }
        onClick={async () => {
          await fetch(`/api/nodes/${node.id}/power`, {
            method: "POST",
            body: JSON.stringify({ action: "soft" }),
          });
        }}
      >
        Stop
      </Button>
      <Button color="yellow" mr="xs" disabled={!powerStatus}>
        Restart
      </Button>
    </>
  );
}
