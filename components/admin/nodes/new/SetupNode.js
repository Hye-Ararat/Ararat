import { Typography, Divider, Box, Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import ReactMarkdown from 'react-markdown'
export default function SetupNode(props) {
    function Command(props) {
        return (
            <Box sx={{ backgroundColor: "black", p: 1, borderRadius: 1, ...props.sx }}>
                <ReactMarkdown style={{ backgroundColor: "black" }}>{"```" + props.command + "```"}</ReactMarkdown>
            </Box>
        )
    }
    return (
        <>
            <Typography variant="h5" sx={{ mb: 1 }}>Setup Hye Lava</Typography>
            <Typography variant="p" sx={{ mb: 2 }}>We provide an easy 1-off command to configure Hye Lava easily. Just paste this command in your Hye Lava root directory (normally /srv/lava) and it&apos;s off to the races.</Typography>
            <Command command={`node index.js setup --api-key ${props.nodeKey} --node ${props.nodeID} --panel-url ${props.panelURL}/`} sx={{ mb: 2 }} />
        </>
    )
}