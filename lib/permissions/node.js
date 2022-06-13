import convertPermissionsToArray from "../convertPermissionsToArray";
import prisma from "../prisma";
import Network from "./node/network";
import StoragePool from "./node/storagePool";

export default class Node {
  constructor(user, nodeId) {
    this.user = user;
    this.nodeId = nodeId;
  }
  storagePool(storagePoolId) {
    return new StoragePool(this, this.user, storagePoolId);
  }
  network(networkId) {
    return new Network(this, this.user, networkId);
  }
  get createInstance() {
    return new Promise(async (resolve, reject) => {
      if ((await this.user.permissions).includes("create-instance")) {
        return resolve(true);
      }
      let nodeData = await prisma.node.findUnique({
        where: {
          id: this.nodeId
        },
        include: {
          users: {
            where: {
              userId: this.user.user
            },
            include: {
              permissions: true
            }
          }
        }
      });
      if (convertPermissionsToArray(nodeData.users[0].permissions).includes("create-instance")) {
        return resolve(true);
      }
      return resolve(false);
    });
  }
  get permissions() {
    return new Promise(async (resolve, reject) => {
      let node = await prisma.node.findUnique({
        where: {
          id: this.nodeId
        },
        include: {
          users: {
            where: {
              userId: this.user.user
            },
            include: {
              permissions: true
            }
          }
        }
      });
      if (!node.users[0]) {
        return resolve([]);
      }
      let perms = convertPermissionsToArray(node.users[0].permissions);
      return resolve(perms);
    });
  }
  get data() {
    return new Promise(async (resolve, reject) => {
      const nodeData = await prisma.node.findUnique({
        where: {
          id: this.nodeId
        },
        include: {
          users: {
            where: {
              userId: this.user.user
            },
            include: {
              permissions: true
            }
          }
        }
      });
      return resolve(nodeData);
    });
  }
}
