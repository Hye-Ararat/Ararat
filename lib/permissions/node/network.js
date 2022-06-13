import Client from "hyexd";
import getLXDUserPermissions from "../../getLXDUserPermissions";
import getNodeEnc from "../../getNodeEnc";

export default class Network {
  constructor(node, user, networkId) {
    this.node = node;
    this.user = user;
    this.networkId = networkId;
  }

  get data() {
    return new Promise(async (resolve, reject) => {
      let nodeData = await this.node.data;
      const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
        certificate: Buffer.from(
          Buffer.from(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(),
          "base64"
        ).toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
      });
      let network;
      try {
        network = await lxd.network(this.networkId).data;
      } catch (error) {
        return resolve(null);
      }
      return resolve(network);
    });
  }

  get attach() {
    return new Promise(async (resolve, reject) => {
      const permissions = await this.user.permissions;
      if (permissions.includes("attach-network")) {
        return resolve(true);
      }
      const nodePermissions = await this.node.permissions;
      if (nodePermissions.includes("attach-network")) {
        return resolve(true);
      }
      let network = await this.data;
      if (network) {
        if (network.metadata.config["user.permissions"]) {
          if (
            getLXDUserPermissions(
              this.user.user,
              JSON.parse(network.metadata.config["user.permissions"])[this.user.user]
            ).includes("attach-network")
          ) {
            return resolve(true);
          }
        }
      }
      return resolve(false);
    });
  }

  get editUsers() {
    return new Promise(async (resolve, reject) => {
      const permissions = await this.user.permissions;
      if (permissions.includes("edit-users_network")) {
        return resolve(true);
      }
      const nodePermissions = await this.node.permissions;
      if (nodePermissions.includes("edit-users_network")) {
        return resolve(true);
      }
      let network = await this.data;
      if (network) {
        if (network.metadata.config["user.permissions"]) {
          if (JSON.parse(network.metadata.config["user.permissions"])[this.user.user].includes("edit-users_network")) {
            return resolve(true);
          }
        }
      }
      return resolve(false);
    });
  }
  get addUsers() {
    return new Promise(async (resolve, reject) => {
      const permissions = await this.user.permissions;
      if (permissions.includes("add-users_network")) {
        return resolve(true);
      }
      const nodePermissions = await this.node.permissions;
      if (nodePermissions.includes("add-users_network")) {
        return resolve(true);
      }
      let network = await this.data;
      if (network) {
        if (network.metadata.config["user.permissions"]) {
          if (JSON.parse(network.metadata.config["user.permissions"])[this.user.user].includes("add-users_network")) {
            return resolve(true);
          }
        }
      }
      return resolve(false);
    });
  }
}
