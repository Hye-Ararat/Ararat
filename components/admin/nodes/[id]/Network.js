import { Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Button, Modal, Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateNetwork from "../../networks/CreateNetwork";
import ForwardPort from "../../network_forwards/ForwardPort";

export default function Network({user, node}) {
    const [page, setPage] = useState("networks");
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [networkForwards, setSetNetworkForwards] = useState([]);
    const [forwardPortOpen, setForwardPortOpen] = useState(false);
    const [createNetworkOpen, setCreateNetworkOpen] = useState(false);
    return(
        
        user.admin && user.admin.networks && user.admin.networks.read ? 
        page == "networks" ?
        <>
        {user.admin && user.admin.networks && user.admin.networks.write ?
        <>
         <Button variant="contained" color="primary" sx={{mb: 1}} onClick={() => setCreateNetworkOpen(true)}>Create Network</Button>
         <Modal open={createNetworkOpen} onClose={() => setCreateNetworkOpen(false)}>
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
                    }}
                    >
                        <Typography variant="h6">Create Network</Typography>
                        <CreateNetwork />
                    </Box>
                    </Modal>
         </>
         : ""}
        <Paper sx={{borderRadius: 1.5}}>
            <TableContainer sx={{borderRadius: 1.5}}>
                <Table>
                    <TableHead>
                    <TableCell>Name</TableCell>
                        <TableCell>IPv4</TableCell>
                        <TableCell align="left">IPv6</TableCell>
                        <TableCell align="left">IP Alias</TableCell>
                    </TableHead>
                    <TableBody sx={{borderRadius: 1.5}}>
                        {node.relationships.networks.map((network, index) => {
                            return (
                                <TableRow key={index} onClick={async () => {
                                    setSelectedNetwork(network._id)
                                    var items = await axios.get(`/api/v1/admin/networks/${network._id}?include=["ports"]`)
                                    setSetNetworkForwards(items.data.relationships.ports)
                                    setPage("ports")
                                }}>
                                <TableCell>{network.name}</TableCell>
                                <TableCell>{network.address.ipv4}</TableCell>
                                <TableCell>{network.address.ipv6}</TableCell>
                                <TableCell>{network.address.ip_alias}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        </>
        : page == "ports" ?
        <>
        {user.admin && user.admin.networks && user.admin.networks.write ?
        <>
         <Button variant="contained" color="primary" sx={{mb: 1}} onClick={() => setForwardPortOpen(true)}>Forward Port</Button>
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
                    }}
                    >
                        <Typography variant="h6">Forward Port</Typography>
                        <ForwardPort id={selectedNetwork}/>
                    </Box>
                    </Modal>
                    </>
         : ""}
        <Paper sx={{borderRadius: 1.5}}>
        <TableContainer sx={{borderRadius: 1.5}}>
            <Table>
                <TableHead>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Address</TableCell>
                    <TableCell align="left">Protocol</TableCell>
                    <TableCell align="left">Listen Port(s)</TableCell>
                    <TableCell align="left">Target Port(s)</TableCell>
                </TableHead>
                <TableBody sx={{borderRadius: 1.5}}>
                    {networkForwards.map((port, index) => {
                        return (
                            <TableRow key={index} onClick={async () => {

                            }}>
                            <TableCell>{port.description}</TableCell>
                            <TableCell>{port.target_address}</TableCell>
                            <TableCell>{port.protocol}</TableCell>
                            <TableCell>{port.listen_port}</TableCell>
                            <TableCell>{port.target_port}</TableCell>

                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
    </> : ""
        : 
        <p>No access</p>
    )
}