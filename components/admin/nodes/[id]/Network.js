import { Paper, TableContainer, Table, TableHead, TableCell, TableBody } from "@mui/material";

export default function Network({user, node}) {
    return(
        <>
        {
        user.admin && user.admin.networks && user.admin.networks.read ? 
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
                        {node.relationships.networks.map(network => {
                            return (
                                <>
                                <TableCell>{network.name}</TableCell>
                                <TableCell>{network.address.ipv4}</TableCell>
                                <TableCell>{network.address.ipv6}</TableCell>
                                <TableCell>{network.address.ip_alias}</TableCell>
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        : 
        <p>No access</p>}
        </>
    )
}