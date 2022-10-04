import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SelectNode({ setPage, setNode, setCreatingInstance }) {
    const [nodes, setNodes] = useState(null);
    useEffect(() => {
        axios.get("/api/v1/nodes?purpose=create_instance").then(res => {
            let tempNodes = [];
            res.data.metadata.forEach(node => {
                tempNodes.push({
                    label: node.name,
                    id: node.id,
                    value: node.id
                })
            })
            console.log(tempNodes)
            setNodes(tempNodes)
        })
    }, [])
    return (
        <Dialog open={true}>
            <DialogTitle>
                <Typography variant="h6" fontFamily={"Poppins"}>Where do you want to create this instance?</Typography>
            </DialogTitle>
            <DialogContent>
                {nodes ?
                    <Grid container>
                        <Autocomplete onChange={(e, value) => {
                            console.log(value.id)
                            setNode(value.id)
                            setPage("selectImage")
                        }} sx={{ mr: "auto", ml: "auto" }} options={nodes} renderInput={(params) => <TextField placeholder="Select Node" {...params} sx={{ minWidth: "300px" }} />} />
                    </Grid>
                    : ""}
            </DialogContent>
            <DialogActions>
                <Grid container sx={{ mr: "auto", ml: "auto", maxWidth: "200px" }}>
                    <Button variant="contained" color="error" sx={{ mr: "auto", ml: "auto" }} onClick={() => {
                        setCreatingInstance(false)
                    }}>Cancel</Button>
                    <Button variant="contained" color="info" sx={{ mr: "auto", ml: "auto" }}>Continue</Button>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}