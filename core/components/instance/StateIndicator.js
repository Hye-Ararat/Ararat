import { InstanceStore } from "../../states/instance";
import { useEffect } from "react";
import { Chip, Grid } from "@mui/material";
import { Circle } from "@mui/icons-material";
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
        console.log(JSON.parse(data.data));
        var e = JSON.parse(data.data);
        instance.setMonitor(e);
        //instance.setContainerState(e.containerState);
      };
    }
  }, [instance.sockets.monitor]);
  return instance.monitor ? (
    <>
      <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: instance.monitor.status == "Running" ? "#1ee0ac" : "red" }} />
      <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: instance.monitor.status == "Running" ? "#1ee0ac" : "red", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
    </>
  ) : (
    ""
  );
}
