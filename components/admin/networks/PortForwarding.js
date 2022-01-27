import { TableBody, Paper, TableContainer, Table, TableHead, TableCell, TableRow, Button, Modal, Box, Typography } from "@mui/material";
import { useState } from "react";
import ForwardPort from "../ports/ForwardPort";

export default function PortForwarding({ network }) {
    const [display, setDisplay] = useState("ports");
    const [forwardPortOpen, setForwardPortOpen] = useState(false);
    return (
        <>
            {display == "ports" ?
                <Paper sx={{ borderRadius: 1.5 }}>
                    <TableContainer sx={{ borderRadius: 1.5 }}>
                        <Table>
                            <TableHead>
                                <TableCell>External Address</TableCell>
                            </TableHead>
                            <TableBody>
                                <TableRow onClick={() => setDisplay("port")}>
                                    <TableCell>116.202.185.10</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                :
                <>
                    <Modal open={forwardPortOpen} onClose={() => setForwardPortOpen(false)}>
                        <Box sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "50%",
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography variant="h6">Forward Ports</Typography>
                            <ForwardPort />
                        </Box>
                    </Modal>

                    <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => setForwardPortOpen(true)}>Forward Port</Button>
                    <Paper sx={{ borderRadius: 1.5 }}>
                        <TableContainer sx={{ borderRadius: 1.5 }}>
                            <Table>
                                <TableHead>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Target Address</TableCell>
                                    <TableCell align="left">Target Port</TableCell>
                                    <TableCell align="left">Protocol</TableCell>

                                </TableHead>
                                <TableBody>
                                    <TableRow onClick={() => setDisplay("port")}>
                                        <TableCell>Web Server</TableCell>
                                        <TableCell>10.153.164.81</TableCell>
                                        <TableCell>80,81,8080-8090</TableCell>
                                        <TableCell>TCP</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper></>}
        </>
    )
}