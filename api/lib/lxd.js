import { readFileSync } from "fs";
import http from "http";
import hyexd from "hyexd";






/**
 * 
 * @param {*} name Instance Name
 * @returns Instance State
 */
export function getState(name) {
    return new Promise((resolve, reject) => {
        const options = {
            socketPath: './lava.sock',
            path: `/state?instance=${name}`,
        }
        const clientRequest = http.request(options, response => {
            response.setEncoding("utf8");
            response.on("data", data => {
                try {
                    resolve(JSON.parse(data));
                } catch {

                }
            })
            response.on("error", data => {
                reject(data);
            });
        });
        clientRequest.end();
    })

}
/**
 * 
 * @type {hyexd}
 */
export let LXDclient = process.env.LXD ? new hyexd.default(process.env.LXD, {
    certificate: readFileSync(new URL("../client.crt", import.meta.url)).toString("ascii"),
    key: readFileSync(new URL("../client.key", import.meta.url)).toString("ascii"),
}) : new hyexd.default("unix:///var/snap/lxd/common/lxd/unix.socket");

