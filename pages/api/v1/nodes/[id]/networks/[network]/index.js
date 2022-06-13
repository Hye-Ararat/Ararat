import getNodeEnc from "../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../lib/prisma";
import { errorResponse, standardResponse } from "../../../../../../../lib/responses";
import Client from "hyexd";
import Permissions from "../../../../../../../lib/permissions/index";
import decodeToken from "../../../../../../../lib/decodeToken";

export default async function handler(req, res) {
  const {
    method,
    query: { id, network }
  } = req;
  const node = await prisma.node.findUnique({
    where: {
      id: id
    }
  });
  if (!node) return res.status(404).send(errorResponse("Node does not exist", 404));
  const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
  switch (method) {
    case "PATCH":
      let patchedNetwork;
      const lxd = new Client("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString(
          "ascii"
        ),
        key: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii")
      });
      let currentNetwork = await lxd.network(network).data;
      let perms = new Permissions(tokenData.id).node(id).network(network);
      if (req.body.config) {
        if (req.body.config["user.permissions"]) {
          if (!currentNetwork.metadata.config["user.permissions"]) {
            if (!(await perms.addUsers)) {
              return res
                .status(403)
                .send(errorResponse("You do not have permission to add users to this network", 403));
            }
          } else {
            let newPerms = JSON.parse(req.body.config["user.permissions"]);
            let users = Object.keys(newPerms);
            console.log(users);
            let currentPerms = JSON.parse(currentNetwork.metadata.config["user.permissions"]);
            let canAdd = await perms.addUsers;
            let canEdit = await perms.editUsers;
            if (!canAdd && !canEdit) {
              return res
                .status(403)
                .send(errorResponse("You do not have permission to add/edit users on this network", 403));
            }
            let error = null;
            for (let i = 0; i < users.length; i++) {
              if (!currentPerms[users[i]] && !canAdd) {
                error = "You do not have permission to add users to this network";
                break;
              }
              if (currentPerms[users[i]] && !canEdit) {
                error = "You do not have permission to edit users on this network";
                break;
              }
            }
            if (error) {
              return res.status(403).send(errorResponse(error, 403));
            }
          }
        }
      }
      let response = await lxd.network(network).partialUpdate(req.body);
      return res.status(200).send(standardResponse(200, response, 200));
  }
}
