"use client";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography, Input} from "../../../../../components/base";
import { useState } from "react";
import { createInstanceFile } from "../../../../../scripts/api/v1/instances/[id]/files";
import {useRouter} from "next/navigation"

export default function UploadFile({id, path}) {
    const [uploading, setUploading] = useState(false)
    const router = useRouter();
    return (
        <>
                <label htmlFor="file-upload" style={{ marginLeft: "auto" }}>
                                        <Input onChange={(e) => {
                                            setUploading(true);
                                            console.log(e.target.files[0])
                                            let reader = new FileReader();
                                            reader.readAsText(e.target.files[0]);
                                            reader.onloadend = async () => {
                                                //console.log(reader.result)
                                                let dat = await createInstanceFile(id, path + "/" + e.target.files[0].name, reader.result)
                                                console.log(dat)
                                                console.log("DONE")
                                                setUploading(false);
                                                router.refresh();
                                            }
                                            setUploading(false)
                                        }} sx={{ display: "none" }} accept="*" type="file" id="file-upload" />
                                    <Button sx={{height: "100%"}} variant="contained" color="success" component="span">{uploading ? "Loading" : "Upload"}</Button>
                    </label>
                                            <Dialog open={uploading} onClose={() => setUploading(false)}>
        <DialogTitle>
                    <Typography variant="h6" align="center" fontFamily="Poppins" fontWeight="bold">Create New File/Folder</Typography>
    
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Typography fontWeight="bold" fontSize={18} align="center" sx={{mb: 2}}>Please input the name of the new file/folder</Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
            <Button variant="contained" color="error" onClick={() => setUploading(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={async () => {
                await createInstanceFile(id, path + "/")
                setUploading(false)
                router.refresh();
            }}>Create</Button>
        </DialogActions>
        </Dialog>
        </>
    )
}