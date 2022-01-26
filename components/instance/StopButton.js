import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";

export default function StopButton(props) {
  const [stopping, setStopping] = useState(false);
  const [killing, setKilling] = useState(false);
  const [showKill, setShowKill] = useState(false);
  return showKill == false ? (
    <LoadingButton
      loading={stopping}
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      onClick={async () => {
        setStopping(true);
        await axios.post(`/api/v1/client/instances/${props.instance}/state`, {
          state: "stop"
        });
        setShowKill(true);
      }}
    >
      Stop
    </LoadingButton>
  ) : (
    <LoadingButton
      loading={killing}
      color="error"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      onClick={async () => {
        setKilling(true);
        setStopping(false);
        await axios.post(`/api/v1/client/instances/${props.instance}/state`, {
          state: "stop",
          force: "true"
        });
        setKilling(false);
        setShowKill(false);
      }}
    >
      Kill
    </LoadingButton>
  );
}
