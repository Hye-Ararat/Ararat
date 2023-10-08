import { usePrisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param {NextRequest} req
 * @param {Object} params
 */
export async function GET(req, params) {
  const prisma = usePrisma();
  let userId = params.params.user;
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
      type: role.type,
    });
  });
  return NextResponse.json({
    global: globalRoles,
    node: nodeRoles,
    object: objectRoles,
  });
}
