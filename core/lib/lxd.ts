import {connectOIDC, connectUnix} from "lxdjs";
import caddyConfig from "../../caddyConfig.json";

export default function lxd(access_token) {
    return connectOIDC(`https://${caddyConfig.apps.http.servers.ararat.routes[0].match[0].host}`, access_token);
}

export function lxdUnix() {
    return connectUnix("/var/snap/lxd/common/lxd/unix.socket")
}