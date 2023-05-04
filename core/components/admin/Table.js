import {Paper, TableContainer, Table as MuiTable, TableHead, TableCell, TableBody, TableRow} from "@mui/material";
import { useRouter } from "next/router";

export default function Table({cells, rows, ...props}) {
    const router = useRouter();
    return (
        <Paper sx={{borderRadius: 1.5}}>
        <TableContainer sx={{borderRadius: 1.5}}>
            <MuiTable>
                <TableHead>
                    {cells.map((cell, index) => (
                        <TableCell key={index}>{cell}</TableCell>
                    ))}
                </TableHead>
                <TableBody >
                    {rows.map((row, index) => (
                        <TableRow key={index} onClick={() => {
                            if (row.link) {
                                router.push(row.link);
                            }
                        }} style={{cursor: row.link ? "pointer": ""}}>
                            {row.cells.map((cell, index) => (
                                <TableCell key={index}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
        </Paper>
    )
}