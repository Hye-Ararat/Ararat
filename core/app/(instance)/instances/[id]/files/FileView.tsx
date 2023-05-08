"use client";

import FileEditor from "./FileEditor"
import { Tabs, Tab, Grid, Divider, IconButton, Tooltip, Paper, Typography, Accordion, AccordionActions, AccordionSummary, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "../../../../../components/base";
import Console from "../Console";
import { useEffect, useState } from "react";
import { Close, ExpandMore } from "@mui/icons-material";
import lxd from "../../../../../lib/lxd";

export default function FileView({ file, path, instance, accessToken, instanceData }) {
    const [openFiles, setOpenFiles] = useState([path])
    const [activeFile, setActiveFile] = useState(0);
    const [files, setFiles] = useState<{ name: string, active: boolean, contentState: string, saved: boolean }>([]); // can u add the type that useState returns
    const [showSavedPopup, setShowSavedPopup] = useState(false);
    //there are no types because my vscode is f***
    //it needs to be a state u didnt do usestate oh im dumb loluh :skull:
    const client = lxd(accessToken);
    useEffect(() => {
        async function run() {
            let inst = client.instances.instance(instance);
            let parentDirectory = path.split("/").slice(0, -1).join("/");
            let fileList = await inst.getFile(parentDirectory);
            let fileMetadata = [];
            fileList.data.forEach(async (file, index) => {
                let fileName = file;
                                    file = await inst.getFile(parentDirectory + "/" + file);
                console.log(file)
                if (file.metadata.type == "file") {
                    file = await inst.getFile(parentDirectory + "/" + fileName)
                    fileMetadata.push({name: fileName, active: (index == 0 ? true : false), contentState: file.data, saved: true });
                    console.log(fileMetadata)
                }
                if (index == fileList.data.length - 1){
             setFiles(fileMetadata)
            }
            })


        }
        run();
    }, []);
    return (
        <>
        <Dialog open={showSavedPopup} onClose={() => setShowSavedPopup(false)}>
            <DialogTitle>
                                <Typography variant="h6" align="center" fontFamily="Poppins">
                You haven't saved your changes
                </Typography></DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                <Typography sx={{mx: "auto"}} variant="body1">There are unsaved changes on {files[activeFile]?.name}.</Typography>
                <Typography fontSize={18} fontWeight={500} sx={{mx: "auto"}}>What would you like to do?</Typography>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
                                <Button color="info" variant="contained" onClick={() => setShowSavedPopup(false)}>Cancel</Button>
                <Button color="error" variant="contained" onClick={() => setShowSavedPopup(false)}>Close without saving</Button>
                                <Button color="success" variant="contained" onClick={() => setShowSavedPopup(false)}>Save and close</Button>
            </DialogActions>
        </Dialog>
            <Grid container direction="row" sx={{ mt: 2 }}>
                <Grid container xs={1.8}>
                    <Paper sx={{ width: "100%", p: 2 }}>
                        <Typography variant="h6">/root</Typography>
                        <Accordion elevation={-1.5}>
                            <AccordionSummary expandIcon={<ExpandMore />}>server</AccordionSummary>
                            <Paper sx={{ p: 1, borderRadius: "4px", m: 1 }}>eula.txt</Paper>
                        </Accordion>
                        {files.map((file, index) => {
                            return (
                                 <Paper onClick={() => {
                                    setActiveFile(index)
                                    let newFiles = files;
                                    newFiles[index].active = true;
                                    setFiles(newFiles);
                        }} elevation={activeFile == index ? 19 : -1.5} sx={{ p: 1, borderRadius: "4px", mb: 1 }}>{file.name}</Paper>
                            )
                        })}

                    </Paper>
                </Grid>
                <Grid container xs={10} sx={{ ml: "auto" }}>
                    <Paper sx={{ width: "100%" }}>
                        <Tabs value={activeFile} sx={{ maxWidth: '80vw', m: 0.7 }} variant="scrollable" scrollButtons="auto">
                            {files.filter((file) => file.active == true).map((file, index) => {
                                return (
                                    <Tab value={files.findIndex((item) => item.name == file.name)} onClick={() => {
                                        setActiveFile(files.findIndex((item) => item.name == file.name))
                                    }} label={
                                        <span>
                                            <Tooltip title="Close File" onClick={() => {
                                                let currentFile = files[activeFile];
                                                if (!currentFile.saved) {
                                                    setShowSavedPopup(true);
                                                }
                                            }}>
                                                <IconButton sx={{ color: "#e85347" }} size="small">
                                                    <Close />
                                                </IconButton>
                                            </Tooltip>
                                            {file.name}
                                        </span>
                                    } />
                                )
                            })}



                        </Tabs>
                    </Paper>
                    {files[activeFile] ?
                    <FileEditor files={files} setFiles={setFiles} fileData={files[activeFile]} file={files[activeFile].contentState} path={path} instance={instance} activeFile={activeFile} />
                    : <CircularProgress />}
                </Grid>
                <Grid xs={12} sx={{ maxHeight: "20vh", width: "100%" }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography sx={{ mb: 1 }}>Console</Typography>
                    <Console instance={instanceData} />
                </Grid>
            </Grid>
        </>
    )
}