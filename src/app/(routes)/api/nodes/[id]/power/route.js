import Server from "@/app/_lib/hardwareManagement";
import { usePrisma } from "@/app/_lib/prisma";
import { getRoles } from "@/app/_lib/roles";
import { validateSession } from "@/app/_lib/session";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  let session = await validateSession();
  let roles = await getRoles(session.user.id, params.id);
  if (!(roles.includes("node-user") || roles.includes("node-operator")))
    return NextResponse.error(
      "You do not have permission to adjust the power state of this node."
    );
  let prisma = usePrisma();
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
  let body = await req.json();
  if (body.action == "soft") await hardwareClient.setPower("soft");
  if (body.action == "off") await hardwareClient.setPower("off");
  if (body.action == "on") await hardwareClient.setPower("on");
  try {
    await hardwareClient.logout();
  } catch (error) {}
  return NextResponse.json({
    success: true,
  });
}
