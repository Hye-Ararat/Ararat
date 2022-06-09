import Client from "hyexd";
import Volume from "./storagePool/volume";
import getNodeEnc from "../../getNodeEnc";

export default class StoragePool {
    constructor(node, user, storagePoolId) {
        this.node = node;
        this.user = user;
        this.storagePoolId = storagePoolId;
    }
    volume(volumeId) {
        return new Volume(this, this.node, this.user, volumeId);
    }
    get data() {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.node.data;
            const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
                certificate: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
            })
            const storagePool = await lxd.storagePool(this.storagePoolId).data;
            return resolve(storagePool);
        })
    }
}