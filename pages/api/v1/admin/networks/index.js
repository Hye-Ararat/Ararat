import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";
import { post, del } from "../../../../../lib/requestNode";

export default async function handler(req, res) {
  const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
  const { method } = req;
  switch (method) {
    case "POST":
      if (!permissions.includes("create-network")) return res.status(403).send("Not allowed to access this resource");

      let network;
      try {
        network = await prisma.network.create({
          data: {
            name: req.body.name,
            node: {
              connect: {
                id: req.body.node
              }
            },
            ipv4: req.body.ipv4,
            ipv6: req.body.ipv6,
            ipAlias: req.body.ipAlias,
            remote: req.body.remote,
            isPrimaryRemoteNetwork: req.body.isPrimaryRemoteNetwork,
            primaryRemoteNetworkId: req.body.primaryRemoteNetworkId,
            remoteNetworkProtocol: req.body.remoteNetworkProtocol
          },
          include: {
            node: true
          }
        });
      } catch {
        return res.status(500).send("Internal Server Error");
      }

      const config = {
        id: network.id,
        address: {
          ipv4: network.ipv4,
          ipv6: network.ipv6
        },
        remote: {
          remote: network.remote,
          primary: network.isPrimaryRemoteNetwork,
          primaryNetwork: network.primaryRemoteNetworkId
        }
      };

      try {
        await post(network.node, "/api/v1/network", config);
      } catch (error) {
        await prisma.network.delete({
          where: {
            id: network.id
          }
        });
        return res.status(500).send(error);
      }

      if (network.remote && network.isPrimaryRemoteNetwork) {
        const remoteNetwork = await prisma.network.findUnique({
          where: {
            id: network.primaryRemoteNetworkId
          },
          include: {
            node: true
          }
        });
        try {
          await post(remoteNetwork.node, `/api/v1/network/${network.primaryRemoteNetworkId}/remotes`, {
            remoteID: network.id,
            localID: remoteNetwork.id,
            protocol: "gre",
            local: remoteNetwork.ipv4,
            remote: network.ipv4
          });
        } catch {
          await del(network.node, `/api/v1/network/${network.id}`).catch(() => { });
          await prisma.network.delete({
            where: {
              id: network.id
            }
          });
          return res.status(500).send("Internal Server Error");
        }
      }
      return res.status(200).send(network);
      break;
    case "GET":
      if (!permissions.includes("list-networks")) return res.status(403).send("Not allowed to access this resource");

      const networks = await prisma.network.findMany({
        include: {
          node: permissions.includes("view-node"),
          ports: permissions.includes("list-ports")
        }
      });
      return res.status(200).send(networks);
      break;
    default:
      return res.status(400).send("Method not allowed");
  }
}
