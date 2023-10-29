import prisma from "@/app/_lib/prisma";
import { getRoles } from "@/app/_lib/permissions";
import { validateSession } from "@/app/_lib/session";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param {NextRequest} req
 * @returns
 */
export async function POST(req) {
  let session = await validateSession();
  let roles = await getRoles(session.user.id);
  if (!roles.global.includes("node-operator")) {
    return NextResponse.error("You do not have permission to add nodes");
  }
  let body = await req.json();
  let node = await prisma.node.create({
    data: {
      name: body.name,
      description: body.description ?? undefined,
      locationGroupId: body.locationGroup,
      lavaUrl: body.lavaUrl ?? undefined,
      ipmiIp: body.ipmiIp ?? undefined,
      ipmiUsername: body.ipmiUsername ?? undefined,
      ipmiPassword: body.ipmiPassword ?? undefined,
      ipmiVersion: body.ipmiVersion ?? undefined,
      brand: body.brand ?? undefined,
      software: body.software ?? undefined,
      snmpCommunity: body.snmpCommunity ?? undefined,
      snmpPort: body.snmpPort ?? undefined,
    },
  });

  return NextResponse.json(node);
}
