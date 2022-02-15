import { Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Button, Modal, Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import CreateNetwork from "../../networks/CreateNetwork";
import ForwardPort from "../../ports/ForwardPort";

export default function Network({ user, node }) {
    const [page, setPage] = useState("networks");
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [networkForwards, setSetNetworkForwards] = useState([]);
    const [instances, setInstances] = useState([]);
    const [forwardPortOpen, setForwardPortOpen] = useState(false);
    const [createNetworkOpen, setCreateNetworkOpen] = useState(false);
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const { data: remoteNetworks } = useSWR(`/api/v1/admin/networks`, fetcher);
    useEffect(() => {
        console.log(remoteNetworks)
    }, [remoteNetworks])
    return (

        user.permissions.includes("list-networks") ?
            page == "networks" ?
                <>
                    {user.permissions.includes("create-network") ?
                        <>
                            <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => setCreateNetworkOpen(true)}>Create Network</Button>
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
                                    {remoteNetworks ?
                                        <CreateNetwork node={node} remoteNetworks={remoteNetworks.filter(net => net.remote.remote == true && net.remote.primary == true && net.node != node)} />
                                        : ""}
                                </Box>
                            </Modal>
                        </>
                        : ""}
                    <Paper sx={{ borderRadius: 1.5 }}>
                        <TableContainer sx={{ borderRadius: 1.5 }}>
                            <Table>
                                <TableHead>
                                    <TableCell>Name</TableCell>
                                    <TableCell>IPv4</TableCell>
                                    <TableCell align="left">IPv6</TableCell>
                                    <TableCell align="left">IP Alias</TableCell>
                                </TableHead>
                                <TableBody sx={{ borderRadius: 1.5 }}>
                                    {node.networks.map((network, index) => {
                                        console.log(network)
                                        return (
                                            <TableRow key={index} sx={{ cursor: "pointer" }} onClick={async () => {
                                                setSelectedNetwork(network.id)
                                                var items = await axios.get(`/api/v1/admin/networks/${network.id}?include=["ports", "instances"]`)
                                                console.log(items.data)
                                                setSetNetworkForwards(items.data.ports)
                                                setInstances(items.data.instances)
                                                setPage("ports")
                                            }}>
                                                <TableCell>{network.name}</TableCell>
                                                <TableCell>{network.ipv4}</TableCell>
                                                <TableCell>{network.ipv6}</TableCell>
                                                <TableCell>{network.ipAlias}</TableCell>
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
                        {user.permissions.includes("forward-port") ?
                            <>
                                <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => setForwardPortOpen(true)}>Forward Port</Button>
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
                                        <ForwardPort id={selectedNetwork} instances={instances} />
                                    </Box>
                                </Modal>
                            </>
                            : ""}
                        <Paper sx={{ borderRadius: 1.5 }}>
                            <TableContainer sx={{ borderRadius: 1.5 }}>
                                <Table>
                                    <TableHead>
                                        <TableCell align="left">Description</TableCell>
                                        <TableCell align="left">Address</TableCell>
                                        <TableCell align="left">Instance</TableCell>
                                        <TableCell align="left">Protocol</TableCell>
                                        <TableCell align="left">Listen Port(s)</TableCell>
                                        <TableCell align="left">Target Port(s)</TableCell>
                                    </TableHead>
                                    <TableBody sx={{ borderRadius: 1.5 }}>
                                        {networkForwards.map((port, index) => {
                                            if (port.meta && port.meta.target_type && port.meta.target) {
                                                console.log(instances.find(el => el._id == port.meta.target))
                                            }
                                            return (
                                                <TableRow key={index} onClick={async () => {

                                                }}>
                                                    <TableCell>{port.description}</TableCell>
                                                    <TableCell>{port.target_address}</TableCell>
                                                    <TableCell>{port.meta && port.meta.target && port.meta.target_type == "instance" ? instances.find(el => el._id == port.meta.target).name : ""}</TableCell>
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