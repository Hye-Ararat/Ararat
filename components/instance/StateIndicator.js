import { InstanceStore } from "../../states/instance";
import { useEffect } from "react";
import { Chip } from "@mui/material";
export default function StateIndicator() {
  const instance = {
    monitor: InstanceStore.useStoreState((state) => state.monitor),
    setMonitor: InstanceStore.useStoreActions((state) => state.setMonitor),
    setContainerState: InstanceStore.useStoreActions((state) => state.setContainerState),
    sockets: {
      monitor: InstanceStore.useStoreState((state) => state.sockets.monitor)
    }
  };
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
  return instance.monitor ? (
    <Chip
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      size="small"
      label={instance.monitor.state}
      color={
        instance.monitor.state == "Online"
          ? "success"
          : instance.monitor.state == "Starting"
          ? "warning"
          : instance.monitor.state == "Stopping"
          ? "warning"
          : "error"
      }
    />
  ) : (
    ""
  );
}
