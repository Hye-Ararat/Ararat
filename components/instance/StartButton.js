import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";

export default function StartButton(props) {
    const [starting, setStarting] = useState(false)
    return(
        <LoadingButton loading={starting} color="success" variant="contained" sx={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}} onClick={async () => {
            setStarting(true)
            await axios.post(`/api/v1/client/instances/${props.instance}/state`, {
                state: "start"
            })
            setStarting(false)

        }}>Start</LoadingButton>    )
}