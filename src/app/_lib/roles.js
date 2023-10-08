import { usePrisma } from "./prisma";

export async function getRoles(userId, nodeId, objectId) {
  const prisma = usePrisma();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      nodeRoles: true,
      globalRoles: true,
      objectRoles: true,
    },
  });
  let globalRoles = [];
  user.globalRoles.forEach((role) => {
    globalRoles.push(role.role);
  });
  let nodeRoles = [];
  user.nodeRoles.forEach((role) => {
    nodeRoles.push({
      name: role.role,
      nodeId: role.nodeId,
    });
  });
  let objectRoles = [];
  user.objectRoles.forEach((role) => {
    objectRoles.push({
      name: role.role,
      resource: role.resource,
      nodeId: role.nodeId,
    });
  });
  let allRoles = {
    global: globalRoles,
    node: nodeRoles,
    object: objectRoles,
  };
  let easyRoles = [];
  if (nodeId) {
    allRoles.global.forEach((role) => {
      easyRoles.push(role);
    });
    allRoles.node.forEach((role) => {
      if (role.nodeId == nodeId) {
        if (!easyRoles.includes(role.name)) {
          easyRoles.push(role.name);
        }
      }
    });
    allRoles.object.forEach((role) => {
      if (role.nodeId == nodeId) {
        if (role.resource == objectId) {
          if (!easyRoles.includes(role.name)) {
            easyRoles.push(role.name);
          }
        }
      }
    });
  }
  if (nodeId) {
    return easyRoles;
  }
  return allRoles;
}
