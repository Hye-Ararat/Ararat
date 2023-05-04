import { Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

export default function SingleFieldDialog({ open, title, description, stateManager, placeholder, action }) {
    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography align="center" fontFamily="Poppins" variant="h6">{title}</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography align="center">{description}</Typography>
                <TextField placeholder={placeholder} fullWidth margin="normal" variant="outlined" onChange={(e) => stateManager(e.target.value)} />
            </DialogContent>
            {action}

        </Dialog>
    )
}