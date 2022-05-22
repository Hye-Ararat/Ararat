import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { InstanceStore } from "../../states/instance";

export default function StartButton(props) {
  const instance = {
    monitor: InstanceStore.useStoreState((state) => state.monitor),
  }
  const [starting, setStarting] = useState(false);
  const start = () => {
    setStarting(true);
    axios
      .put(`/api/v1/instances/${props.instance}/state`, {
        state: "start"
      })
      .then((res) => {
        setStarting(false);
      }).catch(() => {
        setStarting(false);
      })
  };

  return (
    <LoadingButton
      disabled={instance.monitor.status == "Running"}
      loading={starting}
      color="success"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: props.center ? "auto" : "" }}
      onClick={start}
    >
      Start
    </LoadingButton>
  );
}
