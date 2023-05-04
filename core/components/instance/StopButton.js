import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { InstanceStore } from "../../states/instance";

export default function StopButton(props) {
  const instance = {
    monitor: InstanceStore.useStoreState((state) => state.monitor),
  }
  const [stopping, setStopping] = useState(false);
  const [killing, setKilling] = useState(false);
  const [showKill, setShowKill] = useState(false);

  const stop = () => {
    setStopping(true);
    setShowKill(true);
    axios
      .put(`/api/v1/instances/${props.instance}/state`, {
        state: "stop"
      })
      .then((res) => {
        setStopping(false);
        setShowKill(false);
      });
  };

  const kill = () => {
    setKilling(true);
    setStopping(false);
    axios
      .post(`/api/v1/client/instances/${props.instance}/state`, {
        state: "kill"
      })
      .then((res) => {
        setShowKill(false);
        setKilling(false);
      });
  };

  return showKill == false ? (
    <LoadingButton
      loading={stopping}
      disabled={instance.monitor.status != "Running"}
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: props.center ? "auto" : "" }}
      onClick={stop}
    >
      Stop
    </LoadingButton>
  ) : (
    <LoadingButton
      loading={killing}
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: props.center ? "auto" : "" }}
      onClick={kill}
    >
      Kill
    </LoadingButton>
  );
}
