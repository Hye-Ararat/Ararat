import decodeToken from "../../../../../../lib/decodeToken";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
  switch (method) {
    case "GET":
      if (!permissions.includes("view-magmaCube")) return res.status(403).send("Not allowed to access this resource");
      const magmaCube = await prisma.magmaCube.findUnique({
        where: {
          id: id
        },
        include: {
          images: {
            select: {
              amd64: permissions.includes("view-image"),
              arm64: permissions.includes("view-image"),
              console: permissions.includes("view-image"),
              entrypoint: permissions.includes("view-image"),
              id: true,
              name: permissions.includes("list-images"),
              stateless: permissions.includes("view-image"),
              type: permissions.includes("view-image"),
            }
          }
        }
      })
      if (!magmaCube) return res.status(404).send("Magma Cube does not exist");
      return res.status(200).send(magmaCube);
      break;
    default:
      return res.status(400).send("Method not allowed");
  }
}
