"use client";

import { DialogContent, DialogTitle, Typography } from "@mui/material";

export default function Dialog({ title, open, children }) {
    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography variant="h6" align="center" fontFamily="Poppins">{title}</Typography>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}