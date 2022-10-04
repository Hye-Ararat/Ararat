import { Alert, Avatar, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import forge from "node-forge";
import copy from "copy-to-clipboard"
import axios from "axios";
import { Check, Error } from "@mui/icons-material";

export default function Install({ nodePort, setPage, sslCertPath, sslKeyPath, lxdPort, nodeName, sftpPort, nodeAddress }) {
    const [copied, setCopied] = useState(false);
    const [command, setCommand] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState("Connecting...");
    const [connectError, setConnectError] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [key, setKey] = useState(null);

    useEffect(() => {
        //generate x509 keypair
        const keypair = forge.pki.rsa.generateKeyPair(2048);
        //subject is lxd.local
        const certif = forge.pki.createCertificate();
        certif.setSubject([{ value: "lxd.local", type: "CN" }]);
        //convert to string --BEGIN CERTIFICATE--
        certif.publicKey = keypair.publicKey;
        certif.serialNumber = "01";

        //valid forever
        certif.validity.notBefore = new Date();
        certif.validity.notAfter = new Date();
        certif.validity.notBefore.setDate(certif.validity.notBefore.getDate() - 1);
        certif.validity.notAfter.setFullYear(certif.validity.notBefore.getFullYear() + 6969);
        certif.setIssuer(certif.subject.attributes);
        certif.sign(keypair.privateKey);
        const cert = forge.pki.certificateToPem(certif)
        const leKey = forge.pki.privateKeyToPem(keypair.privateKey)
        //{Buffer.from(cert).toString("base64")
        setCertificate(Buffer.from(cert).toString("base64"));
        setKey(Buffer.from(leKey).toString("base64"));

        setCommand(`source <(curl -s \"${location.origin}/api/v1/nodes/install?port=${nodePort}&ssl=${location.protocol == "https:" ? `true&ssl_cert_path=${sslCertPath}&ssl_key_path=${sslKeyPath}` : "false"}\")`)
    }, [])

    return (
        <>
            <Dialog open={true}>
                <DialogTitle sx={{ m: 0 }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 700, mt: "auto", mb: "auto", mr: status == "Success" ? 5 : 0, ml: status == "Success" ? 5 : 0 }} align="center">
                        {!connectError ?
                            status != "Success" ?
                                !connected ?
                                    <>
                                        {!connecting ? "Please make sure port 3000 is available and open on your node" : "We're connecting to your node"}
                                    </>
                                    : "We're setting up your node"
                                : "You're ready to go!"
                            : "Oops, something went wrong"}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {connecting ?

                        <Grid container direction="column">
                            {!connectError ?
                                <>
                                    {status != "Success" ?
                                        <CircularProgress sx={{ mr: "auto", ml: "auto", mb: 1, mt: 2 }} />
                                        :
                                        <Avatar variant="rounded" sx={{ mr: "auto", ml: "auto", width: 50, height: 50, backgroundColor: "#163a3a", mb: 1 }}>
                                            <Check sx={{ color: "#1ee0ac", fontSize: 40 }} />
                                        </Avatar>
                                    }
                                    <Typography align="center" sx={{ fontWeight: "bold" }}>{status}</Typography>
                                    {!connected ? <Typography align="center">{"This will only take a moment"}</Typography> : ""}
                                    {status == "Success" ? <Button variant="contained" color="info" sx={{ mt: 1, mr: "auto", ml: "auto" }} onClick={() => {
                                        axios.post(`/api/v1/nodes`, {
                                            name: nodeName,
                                            port: nodePort,
                                            lxdPort: lxdPort,
                                            sftpPort: sftpPort,
                                            certificate: certificate,
                                            key: key,
                                            address: nodeAddress,
                                            ssl: location.protocol == "https:" ? true : false,
                                        })
                                        setPage("");
                                    }}>Continue</Button> : ""}
                                </>
                                : <>
                                    <Grid container direction="column">
                                        <Error sx={{ mr: "auto", ml: "auto", fontSize: "70px", color: "#e85347", mb: 2 }} />
                                        <Typography fontWeight="bold" fontSize={20} align="center">An error occured while connecting to the node</Typography>
                                        <Typography>Please double check your connection information on the next screen.</Typography>
                                    </Grid>

                                </>
                            }

                        </Grid>
                        : ""}

                    {!connecting ?
                        <>
                            <Typography sx={{ mt: 2, fontFamily: "Poppins", fontWeight: 700 }} align="center">Please run the following command on your node</Typography>

                            <Grid container direction="row">
                                <Grid container sx={{ position: "relative", WebkitBackdropFilter: "blur(1px)", mt: 2, width: "inherit", top: "30" }}>
                                    <Typography noWrap={true} sx={{ maxHeight: "80px", backgroundColor: "black", borderRadius: 2, p: 1, whiteSpace: "normal", wordBreak: "break-all", position: "absolute" }}>{command}</Typography>
                                    <Grid container sx={{ WebkitBackdropFilter: "blur(1px)", pb: 2 }}>
                                        <Button sx={{ ml: "auto", mr: "auto", mt: 3 }} variant="contained" color="info" onClick={() => {
                                            copy(command);
                                            setCopied(true);
                                        }} >Copy To Clipboard</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid direction="row" container sx={{ mt: 2 }}>
                                <Typography sx={{ mt: "auto", mb: "auto", mr: 2 }}> After running the command, just press continue</Typography>
                                <Button variant="contained" color="primary" sx={{ mt: "auto", mb: "auto", ml: "auto" }} onClick={() => {
                                    setConnecting(true);
                                    const ws = new WebSocket(`${location.protocol == "https:" ? "wss" : "ws"}://${nodeAddress}:${nodePort}`);
                                    ws.onopen = () => {
                                        setConnected(true);
                                        setTimeout(() => {
                                            ws.send(JSON.stringify({
                                                cert: certificate,
                                                panel_url: location.origin,
                                                key: key,
                                                lxd_port: lxdPort
                                            }));
                                        }, 1000);
                                    }
                                    ws.onmessage = (e) => {
                                        setStatus(e.data)
                                        console.log(e.data)
                                    }
                                    ws.onerror = () => {
                                        setConnectError(true);
                                        setTimeout(() => {
                                            setPage("nodeInfo");
                                        }, 5000)
                                    }
                                }}>Continue</Button>
                            </Grid>
                        </>
                        : ""}
                </DialogContent>
            </Dialog>
            <Snackbar open={copied} autoHideDuration={1500} onClose={() => setCopied(false)}>
                <Alert severity="info">
                    <Typography align="center">Copied to clipboard</Typography>
                </Alert>
            </Snackbar>
        </>
    )
}