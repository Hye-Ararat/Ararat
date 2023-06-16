"use client";

import {Alert, Snackbar} from "../components/base";
import { useEffect, useState } from "react";
import nookies from 'nookies';
import lxd from "../lib/lxd";

export default function Events() {
    const [operations, setOperations] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [shownOperations, setShownOperatoins] = useState([]);
    const [operationStatus, setOperationStatus] = useState("info");
    useEffect(() => {
        const interval = setInterval(async () => {
            let operations = await lxd(nookies.get().access_token).getOperations();
            setOperations(operations.running)
            
        }, 1000);
        return () => clearInterval(interval);
    }, [])
    useEffect(() => {
        if (operations) {
        if (operations.length > 0) {
            let operation = operations[operations.length -1]
            if (!shownOperations.includes(operation.id)) {
            const audio = new Audio("/audio/notification.wav");
                audio.play();
                setOpen(true);
                setMessage(operation.description);
                let newLastShown = shownOperations;
                newLastShown.push(operation.id);
                if (operation.status == "Running") {
                    setOperationStatus("info")
                }
                if (operation.status == "Success") {
                    setOperationStatus("success")
                }
                if (operation.status == "Failure") {
                    setOperationStatus("error")
                }
            }
        }
    }
    }, [operations, shownOperations])
    return (
<Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
  <Alert onClose={() => setOpen(false)} severity={operationStatus} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>    )
}