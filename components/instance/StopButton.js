import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";

export default function StopButton(props) {
  const [stopping, setStopping] = useState(false);
  const [killing, setKilling] = useState(false);
  const [showKill, setShowKill] = useState(false);

  const stop = () => {
    setStopping(true);
    setShowKill(true);
    axios
      .post(`/api/v1/client/instances/${props.instance}/state`, {
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
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      onClick={stop}
    >
      Stop
    </LoadingButton>
  ) : (
    <LoadingButton
      loading={killing}
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      onClick={kill}
    >
      Kill
    </LoadingButton>
  );
}
