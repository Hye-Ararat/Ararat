"use server";

import { usePrisma } from "./prisma";
import { validateSession } from "./session";

export async function getPermissions(scope, resourceId) {
  let session = await validateSession();
  const prisma = usePrisma();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      permissions: true,
      roles: {
        select: {
          id: true,
          resourceId: true,
          rolePermissions: {
            select: {
              permission: true,
              id: true,
            },
          },
        },
      },
    },
  });
  let permissions = [];
  let locationId = null;
  let organizationId = null;
  let rackId = null;
  let physicalServerId = null;
  let netSwitchId = null;
  let pduId = null;
  switch (scope) {
    case "user":
      let user = await prisma.user.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          organization: true,
        },
      });
      organizationId = user.organization.id;
      resourceId = organizationId;
    case "location":
      locationId = resourceId;
      break;
    case "organization":
      organizationId = resourceId;
      break;
    case "rack":
      let rack = await prisma.rack.findUnique({
        where: {
          id: resourceId,
        },
      });
      locationId = rack.locationId;
      rackId = resourceId;
      break;
    case "physicalServer":
      let physicalServer = await prisma.physicalServer.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          units: {
            select: {
              rackId: true,
              rack: {
                select: {
                  locationId: true,
                },
              },
            },
          },
        },
      });
      physicalServerId = resourceId;
      rackId = physicalServer.units[0].rackId;
      locationId = physicalServer.units[0].rack.locationId;
      break;
    case "switch":
      let netSwitch = await prisma.switch.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          units: {
            select: {
              rackId: true,
              rack: {
                select: {
                  locationId: true,
                },
              },
            },
          },
        },
      });
      netSwitchId = resourceId;
      rackId = netSwitch.units[0].rackId;
      locationId = netSwitch.units[0].rack.locationId;
      break;

    case "pdu":
      let pdu = await prisma.pdu.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          units: {
            select: {
              rackId: true,
              rack: {
                select: {
                  locationId: true,
                },
              },
            },
          },
        },
      });
      pduId = resourceId;
      rackId = pdu.units[0].rackId;
      locationId = pdu.units[0].rack.locationId;
      break;
    default:
      break;
  }
  for (let role of user.roles) {
    if (role.scope == "global") {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "location" && locationId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "organization" && organizationId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "rack" && rackId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "physicalServer" && physicalServerId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "switch" && netSwitchId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
    if (role.scope == "pdu" && pduId == role.resourceId) {
      for (let permission of role.rolePermissions) {
        permissions.push(permission.permission);
      }
    }
  }
  for (let permission of user.permissions) {
    if (permission.scope == "global") {
      permissions.push(permission.permission);
    }
    if (permission.scope == "location" && locationId == permission.resourceId) {
      permissions.push(permission.permission);
    }
    if (
      permission.scope == "organization" &&
      organizationId == permission.resourceId
    ) {
      permissions.push(permission.permission);
    }
    if (permission.scope == "rack" && rackId == permission.resourceId) {
      permissions.push(permission.permission);
    }
    if (
      permission.scope == "physicalServer" &&
      physicalServerId == permission.resourceId
    ) {
      permissions.push(permission.permission);
    }
    if (permission.scope == "switch" && netSwitchId == permission.resourceId) {
      permissions.push(permission.permission);
    }
    if (permission.scope == "pdu" && pduId == permission.resourceId) {
      permissions.push(permission.permission);
    }
  }
  return [...new Set(permissions)];
}
