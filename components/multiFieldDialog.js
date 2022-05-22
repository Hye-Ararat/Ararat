import { Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";

export default function MultiFieldDialog({ open, title, fields, action }) {
    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography align="center" fontFamily="Poppins" variant="h6">{title}</Typography>
            </DialogTitle>
            <DialogContent>
                {fields.map((field, index) => {
                    return (
                        <Grid container key={index} sx={{ mt: index == 0 ? 0 : 1 }}>
                            <Typography fontSize="20px" sx={{ mr: 5, fontWeight: 600, mt: "auto", mb: "auto" }}>{field.name}</Typography>
                            {field.input}
                        </Grid>
                    )
                })}
            </DialogContent>
            {action}
        </Dialog>
    )
}