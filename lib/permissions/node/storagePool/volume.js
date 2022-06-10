import getLXDUserPermissions from "../../../getLXDUserPermissions";
import { getUserPermissions } from "../../../getUserPermissions";
import Client from "hyexd";
import getNodeEnc from "../../../getNodeEnc";

export default class Volume {
    constructor(storagePool, node, user, volumeId) {
        this.storagePool = storagePool;
        this.node = node;
        this.user = user;
        this.volumeId = volumeId;
    }

    get data() {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.node.data;
            const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
                certificate: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
            })
            let volumes;
            try {
                volumes = await lxd.storagePool(this.storagePool.storagePoolId).volumes
            } catch {
                return resolve(null)
            }
            let volume = volumes.metadata.find(volume => volume.name === this.volumeId);
            if (volume) {
                return resolve(volume);
            } else {
                return resolve(null);
            }
        })
    }

    get attach() {
        return new Promise(async (resolve, reject) => {
            const permissions = await this.user.permissions;
            if (permissions.includes("attach-volume")) {
                return resolve(true);
            }
            const nodePermissions = await this.node.permissions;
            if (nodePermissions.includes("attach-volume")) {
                return resolve(true);
            }
            let storagePool = await this.storagePool.data;
            if (storagePool) {
                if (storagePool.metadata.config["user.permissions"]) {
                    if (getLXDUserPermissions(this.user.user, JSON.parse(storagePool.metadata.config["user.permissions"]).includes("attach-volume"))) {
                        return resolve(true);
                    }
                }
            }
            let volume = await this.data;
            if (volume) {
                if (volume.config["user.permissions"]) {
                    if (getLXDUserPermissions(this.user.user, JSON.parse(volume.config["user.permissions"]).includes("attach"))) {
                        return resolve(true);
                    }
                }
            
            }
            return resolve(false);
        })
    }
}