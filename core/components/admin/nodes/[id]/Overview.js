import {Typography} from "@mui/material"

export default function Overview(props) {
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>{props.node.name}</Typography>
        </>
    )
}