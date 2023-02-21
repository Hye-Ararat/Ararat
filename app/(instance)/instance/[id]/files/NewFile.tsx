"use client";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography} from "../../../../../components/base";
import { useState } from "react";
import { createInstanceFile } from "../../../../../scripts/api/v1/instances/[id]/files";
import {useRouter} from "next/navigation"

export default function NewFile({id, path}) {
    const [creatingNew, setCreatingNew] = useState(false)
    const [newName, setNewName] = useState("");
    const router = useRouter();
    return (
        <>
        <Button variant="contained" color="primary" sx={{ml: 2}} onClick={() =>setCreatingNew(true)}>Create New</Button>
        <Dialog open={creatingNew} onClose={() => setCreatingNew(false)}>
        <DialogTitle>
                    <Typography variant="h6" align="center" fontFamily="Poppins" fontWeight="bold">Create New File/Folder</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Typography fontWeight="bold" fontSize={18} align="center" sx={{mb: 2}}>Please input the name of the new file/folder</Typography>
            <TextField value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New File/Folder Name" variant="standard" fullWidth={true} />
        </DialogContent>
        <Divider />
        <DialogActions>
            <Button variant="contained" color="error" onClick={() => setCreatingNew(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={async () => {
                await createInstanceFile(id, path + "/" + newName)
                setCreatingNew(false)
                router.refresh();
            }}>Create</Button>
        </DialogActions>
        </Dialog>
        </>
    )
}