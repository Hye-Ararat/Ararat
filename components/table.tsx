"use client";
import { Paper, Divider, Menu, MenuItem, Button, Grid, TextField, Input, InputAdornment, Typography } from "./base";
import { useState } from "react";
import { CheckBox, KeyboardArrowDown, Search, Brightness1, Circle } from "@mui/icons-material";


interface TableColumn {
    title: string,
    sizes: {
        xs?: number,
        md?: number
    }
}

export default function Table({columns, rows}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [actionsOpen, setActionsOpen] = useState(false);
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
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
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
                    <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }} sx={{ mt: "auto", mb: "auto", ml: "auto" }} placeholder="Search Nodes" />
                </Grid>
                <Paper elevation={8} sx={{ boxShadow: "none", mt: 2, padding: 2, borderRadius: 0, borderTop: "0.5px solid gray", borderBottom: "0.5px solid gray" }}>
                    <Grid container direction="row">
                        <Grid container xs={1}>
                            <CheckBox />
                        </Grid>
                        <Grid container xs={4}>
                            <Typography fontWeight={500} sx={{m: "auto"}}>Name</Typography>
                        </Grid>
                        <Grid container xs={4}>
                            <Typography sx={{m: "auto"}}>URL</Typography>
                        </Grid>
                        <Grid container xs={3}>
                            <Typography sx={{m: "auto"}}>Status</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper sx={{ boxShadow: "none", padding: 2, borderRadius: 0, borderTop: "0.5px solid gray", borderBottom: "0.5px solid gray" }}>

                    <Grid container direction="row">
                        <Grid container xs={1}>
                            <CheckBox/>
                        </Grid>
                        <Grid container xs={4}>
                            <Typography sx={{m: "auto"}} fontWeight="bold">Hyelab-01</Typography>
                        </Grid>
                        <Grid container xs={4}>
                            <Typography sx={{m: "auto"}}>https://development.hye.gg:443</Typography>
                        </Grid>
                        <Grid container xs={3} direction="row">
                            <Grid sx={{maxWidth: "15px", ml: "auto", mt: "auto", mb: "auto" }} container>
                                <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac" }} />
                                <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
                            </Grid>
                            <Typography sx={{mt: "auto", mb: "auto", ml: 1, mr: "auto"}}>Online</Typography>
                            </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </>
    )
}