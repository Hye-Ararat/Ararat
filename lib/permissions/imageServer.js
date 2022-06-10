import prisma from "../prisma";
import convertPermissionsToArray from "../convertPermissionsToArray";

export default class ImageServer {
  constructor(user, imageServer) {
    this.user = user;
    this.imageServer = imageServer;
  }
  get id() {
    return new Promise(async (resolve, reject) => {
      if (this.imageServer.includes("http")) {
        let imageServ = await prisma.imageServer.findUnique({
          where: {
            url: this.imageServer
          }
        });
        if (imageServ) {
          return resolve(imageServ.id);
        } else {
          return resolve(null);
        }
      } else {
        return resolve(imageServer);
      }
    });
  }

  get data() {
    return new Promise(async (resolve, reject) => {
      let id = await this.id;
      if (id) {
        return resolve(
          await prisma.imageServer.findUnique({
            where: {
              id: id
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
          })
        );
      } else {
        return resolve(null);
      }
    });
  }

  get permissions() {
    return new Promise(async (resolve, reject) => {
      let data = await this.data;
      if (data) {
        let perms;
        if (data.users[0]) {
          perms = convertPermissionsToArray(data.users[0].permissions);
          return resolve(perms);
        } else {
          return resolve([]);
        }
      } else {
        return resolve([]);
      }
    });
  }

  get useImages() {
    return new Promise(async (resolve, reject) => {
      return resolve((await this.permissions).includes("use-images"));
    });
  }
}
