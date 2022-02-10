import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";

export default function StartButton(props) {
  const [starting, setStarting] = useState(false);

  const start = () => {
    setStarting(true);
    axios
      .post(`/api/v1/client/instances/${props.instance}/state`, {
        state: "start"
      })
      .then((res) => {
        setStarting(false);
      });
  };

  return (
    <LoadingButton
      loading={starting}
      color="success"
      variant="contained"
      sx={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto" }}
      onClick={start}
    >
      Start
    </LoadingButton>
  );
}
