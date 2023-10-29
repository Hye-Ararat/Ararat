import Server from "@/app/_lib/hardwareManagement/index.js";
import  prisma  from "@/app/_lib/prisma";
import { getRoles } from "@/app/_lib/permissions";
import { validateSession } from "@/app/_lib/session";
import { NextResponse } from "next/server";
/**
 *
 * @param {Request} req
 * @returns
 */
export async function GET(req, { params }) {
  let session = await validateSession();
  let roles = await getRoles(session.user.id, params.id);
  if (
    !(
      roles.includes("node-auditor") ||
      roles.includes("node-user") ||
      roles.includes("node-operator")
    )
  )
    return NextResponse.error("You do not have permission to view this node");
  let node = await prisma.node.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  const hardwareClient = new Server(
    node.brand,
    node.software,
    node.ipmiIp,
    node.ipmiUsername,
    node.ipmiPassword
  );
  let powerStatus = await hardwareClient.getPowerStatus();
  await hardwareClient.logout();
  return NextResponse.json({
    powerStatus: powerStatus,
  });
}
