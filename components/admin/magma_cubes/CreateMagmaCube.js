import {Grid, FormControl, TextField, Typography, Box, Select, MenuItem, Button } from "@mui/material"
import axios from "axios";
import { useState } from "react";

export default function CreateMagmaCube(props) {
    console.log(props)
    const [magmaCube, setMagmaCube] = useState(null)
    return(
        <>
        <Grid sx={{p: 2}} container md={12} xs={12} lg={12} direction="column">
            <FormControl sx={{m: 2}} variant="outlined">
                <Grid container direction="row">
                    <Box sx={{mr: 3, mb: 2}}>
                        <Typography fontWeight="bold">Description</Typography>
                        <TextField value={magmaCube} onChange={(e) => {
                            e.preventDefault();
                            setMagmaCube(e.target.value);
                        }} placeholder="JSON" variant="outlined" />
                    </Box>
                </Grid>
            </FormControl>
            <Button variant="contained" color="success" sx={{ml: 2, width: "10%"}} onClick={async () => {
                var data = await axios.post(`/api/v1/admin/magma_cubes`, JSON.parse(magmaCube))
                console.log(data)
            }}>Create</Button>
        </Grid>
        </>
    )
}