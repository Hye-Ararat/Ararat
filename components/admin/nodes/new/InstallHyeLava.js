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
            <Typography variant="h6" fontWeight={600}>NodeJS</Typography>
            <Command command={"curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -"} sx={{ mb: 2 }} />
            <Command command={`sudo apt-get install -y nodejs`} sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>LXD</Typography>
            <Command command={`snap install lxd`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>Installing Hye Lava</Typography>
            <Command command={`mkdir /srv/lava && cd /srv/lava`} sx={{ mb: 2 }} />
            <Command command={`git clone https://github.com/Hye-Ararat/Lava.git .`} sx={{ mb: 2 }} />
            <Command command={`npm i`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>Configuring LXD</Typography>
            <Typography variant="p">Add the following lines to **/etc/security/limits.conf**</Typography>
            <Command command={"* soft nofile 1048576\n* hard nofile 1048576\nroot soft nofile 1048576\nroot hard nofile 1048576\n* soft memlock unlimited\n* hard memlock unlimited\nroot soft memlock unlimited\nroot hard memlock unlimited\n"} />
            <Typography variant="p">Add the following lines to **/etc/sysctl.conf**</Typography>
            <Command command={"fs.aio-max-nr = 524288\nfs.inotify.max_queued_events = 1048576\nfs.inotify.max_user_instances = 1048576\nfs.inotify.max_user_watches = 1048576\nkernel.dmesg_restrict = 1\nkernel.keys.maxbytes = 2000000\nkernel.keys.maxkeys = 2000\nnet.core.bpf_jit_limit = 3000000000\nnet.ipv4.neigh.default.gc_thresh3 = 8192\nnet.ipv6.neigh.default.gc_thresh3 = 8192\nvm.max_map_count = 262144\n"} />
            <Typography variant="p">Reboot your node</Typography>
            <Command command="lxd init" sx={{ mb: 2 }} />
            <Typography variant="p">Here we've compiled a list of options applicable to most users, but feel free to use your own.</Typography>
            <Table sx={{mt: 1}}>
                <TableHead>
                    <TableCell>Option</TableCell>
                    <TableCell align="left">Value</TableCell>
                </TableHead>
                <TableBody sx={{ borderRadius: 1.5 }}>
                    <TableRow>
                        <TableCell>Enable Clustering</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Configure new storage pool</TableCell>
                        <TableCell>Yes</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Storage Pool Name</TableCell>
                        <TableCell>default</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Storage Backend</TableCell>
                        <TableCell>zfs</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Connect to MAAS</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Create new local network bridge</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Use existing bridge or host interface</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>LXD server availability over the network</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Auto-update stale cached images</TableCell>
                        <TableCell>Yes</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>YAML of lxd init</TableCell>
                        <TableCell>No</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Typography sx={{mt: 2}} variant="p" fontWeight="bold">Congratulations! Hye Lava is now installed on your system. You're ready to continue to the next step. </Typography>
        </>
    )
}