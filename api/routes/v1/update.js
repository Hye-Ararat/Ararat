import { exec, execSync, spawn } from "child_process";
import net from "net";
export default async function update(req, res) {
    res.status(202).send("Updating...");
    const client = net.createConnection("./intra.sock");
    client.on("connect", () => {
        client.write("update");
        client.end();
    });
}