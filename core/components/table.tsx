"use client";
import { Paper, Divider, Menu, MenuItem, Button, Grid, TextField, Input, InputAdornment, Typography, Checkbox } from "./base";
import { useEffect, useState } from "react";
import {  KeyboardArrowDown, Search, Brightness1, Circle, PsychologyAlt } from "@mui/icons-material";
import {useRouter} from "next/navigation";

import Link from "next/link";

interface TableColumn {
    title: string,
    fontWeight?: string | number,
    sizes: {
        xs?: number,
        md?: number
    }
}

export default function Table({columns, rows, actions, top, rowLinks} : {columns: TableColumn[], rows: any[], actions?: any[], top?: any, rowLinks?: any}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeRows, setActiveRows] = useState(rows);
    const [activeRowLinks, setActiveRowLinks] = useState([]);
    const [checkedRows, setCheckedRows] = useState([]);
    const router = useRouter();
    useEffect(() => {
        let tempRowLinks = [];
        setActiveRows(rows.filter((row) => {
            let found = false;
            row.forEach((cell) => {
                if (cell.props.children) {
                if (cell.props.children.toString().toLowerCase().includes(searchQuery.toLowerCase())) {
                    found = true;
                }
            }
            })
            if (rowLinks) {
            if (found) tempRowLinks.push(rowLinks[rows.indexOf(row)]);
            }
            return found;
        }))
        setActiveRowLinks(tempRowLinks);
        setCheckedRows([]);
    }, [searchQuery])
    console.log(activeRows)
    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={actionsOpen}
                onClose={() => setActionsOpen(false)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {actions?.map((action, index) => {
                    return (
                        <MenuItem key={index} disabled={checkedRows.length == 0} onClick={() => {
                            action.action(checkedRows);
                            setActionsOpen(false);
                        }}>{action.name}</MenuItem>
                    )
                })}
            </Menu>


            <Paper sx={{ mt: 2, paddingBottom: 1, paddingTop: 2 }}>
                <Grid container direction="row" sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button sx={{ mt: "auto", mb: "auto" }}
                        aria-controls={actionsOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={actionsOpen ? 'true' : undefined}
                        variant="outlined"
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget)
                            setActionsOpen(true)
                        }}
                    >Actions <KeyboardArrowDown /> </Button>
                    {top}
                    <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }} sx={{ mt: "auto", mb: "auto", ml: "auto" }} placeholder="Search" />
                </Grid>
                <Paper elevation={8} sx={{ boxShadow: "none", mt: 2, padding: 2, borderRadius: 0, borderTop: "0.5px solid gray", borderBottom: "0.5px solid gray" }}>
                    <Grid container direction="row">
                        <Grid container xs={1}>
                            <Checkbox onClick={() => {
                                if (checkedRows.length == activeRows.length) {
                                    setCheckedRows([]);
                                } else {
                                    setCheckedRows(activeRows.map((row, index) => index));
                                }
                            }} sx={{p: 0}} indeterminate={checkedRows.length > 0 && checkedRows.length != activeRows.length} checked={checkedRows.length == activeRows.length && activeRows.length != 0}  />
                        </Grid>
                        {columns.map((column, index) => {
                            return (
                                <Grid key={index} container {...{xs: column.sizes.xs ? column.sizes.xs : undefined}}>
                                <Typography {...column.fontWeight ? {fontWeight: column.fontWeight} : {}} sx={{m: "auto"}}>{column.title}</Typography>
                            </Grid>
                            )
                        })}
                    
                    </Grid>
                </Paper>
                    {activeRows.map((row, index) => {
                        return (
                                        <Paper key={index} sx={{ boxShadow: "none", padding: 2, borderRadius: 0, borderTop: "0.5px solid gray", borderBottom: "0.5px solid gray" }}>
                                            {activeRowLinks[index] ?
                                            <Link href={activeRowLinks[index] ? activeRowLinks[index].link : ""} style={{textDecoration: "none", color: "inherit"}} prefetch={false}>
                                                                <Grid container direction="row">
                                                                
                                                                <Grid container xs={1}>
                                <Checkbox onChange={(e) => {
                                    if (e.target.checked) {
                                        setCheckedRows([...checkedRows, index])
                                    } else {
                                        setCheckedRows(checkedRows.filter((row) => row !== index))
                                    }
                                }} checked={checkedRows.includes(index)} sx={{p: 0}}/>
                            </Grid>
                        {row.map((row, index) => {
                            return (
                                <Grid key={index} container xs={columns[index].sizes.xs}>
                                {row}
                            </Grid>
                            )

                        })}
                                            </Grid>
                                            </Link>
                                            : 
                                                                                    <Grid container direction="row">
                                                                
                                                                <Grid container xs={1}>
                                <Checkbox onChange={(e) => {
                                    if (e.target.checked) {
                                        setCheckedRows([...checkedRows, index])
                                    } else {
                                        setCheckedRows(checkedRows.filter((row) => row !== index))
                                    }
                                }} checked={checkedRows.includes(index)} sx={{p: 0}}/>
                            </Grid>
                        {row.map((row, index) => {
                            return (
                                <Grid key={index} container xs={columns[index].sizes.xs}>
                                {row}
                            </Grid>
                            )

                        })}
                                            </Grid>}
                                        </Paper>
                        )

                    })}
                    {activeRows.length === 0 ?
                    <>
                    <Typography align="center">
                    <PsychologyAlt sx={{fontSize: 100}} />
                    </Typography>
                    <Typography align="center">Looks like there is nothing here.</Typography> 
                    </>
                    : ""}
            </Paper>
        </>
    )
}