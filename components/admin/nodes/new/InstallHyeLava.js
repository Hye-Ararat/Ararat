import { Typography, Divider, Box, Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import ReactMarkdown from 'react-markdown'
function Command(props) {
    return (
        <Box sx={{ backgroundColor: "black", p: 1, borderRadius: 1, ...props.sx }}>
            <ReactMarkdown style={{ backgroundColor: "black" }}>{"```" + props.command + "```"}</ReactMarkdown>
        </Box>
    )
}
export default function InstallHyeLava(props) {
    return (
        <>
            <Typography variant="h5">Requirements</Typography>
            <ul>
                <li>{"Ubuntu >= 18.04 (must be LTS release)"}</li>
            </ul>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>Installing The Dependencies</Typography>
            <Typography variant="h6" fontWeight={600}>curl</Typography>
            <Command command={"apt update"} sx={{ mb: 2 }} />
            <Command command={`apt -y install curl`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>Installing Hye Lava</Typography>
            <Typography variant="p" sx={{mb: 2}}>We provide an easy 1-off command to install Hye Lava easily. Just paste this command into your system and it's off to the races.</Typography>
            <Command command={`bash <(curl -s https://gist.githubusercontent.com/Hye-Dev/9db8116e51620a14792041454e609eaa/raw/d61995e5445e3d560e6909e7cd4e0ccf74a85a21/installLavaAlpha.sh)`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>Configuring LXD</Typography>
            <Typography variant="p">Add the following lines to /etc/security/limits.conf</Typography>
            <Command command={"* soft nofile 1048576\n* hard nofile 1048576\nroot soft nofile 1048576\nroot hard nofile 1048576\n* soft memlock unlimited\n* hard memlock unlimited\nroot soft memlock unlimited\nroot hard memlock unlimited\n"} />
            <Typography variant="p">Add the following lines to /etc/sysctl.conf</Typography>
            <Command command={"fs.aio-max-nr = 524288\nfs.inotify.max_queued_events = 1048576\nfs.inotify.max_user_instances = 1048576\nfs.inotify.max_user_watches = 1048576\nkernel.dmesg_restrict = 1\nkernel.keys.maxbytes = 2000000\nkernel.keys.maxkeys = 2000\nnet.core.bpf_jit_limit = 3000000000\nnet.ipv4.neigh.default.gc_thresh3 = 8192\nnet.ipv6.neigh.default.gc_thresh3 = 8192\nvm.max_map_count = 262144\n"} />
            <Typography variant="p">Reboot your node, and you're ready to continue to the next step</Typography>
        </>
    )
}