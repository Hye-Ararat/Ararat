import { NextRequest, NextResponse } from "next/server";
import { errorResponse, standardResponse } from "../responses";
import Instances from "./instances";
import { allowed, notAllowed } from "./responses";
import {decode} from "jsonwebtoken";
import prisma from "../prisma";
import caddyConfig from "../../caddyConfig.json";

export default class AccessHandler {
    private authorization: string;

    constructor(authorization: string | null | undefined) {
        if (authorization) {
            this.authorization = authorization;
        }
    }

    get instances() {
        return new Instances(this, this.authorization)
    }
    async hasPermission(permission: string) {
        if (this.authorization) {
            let payload = decode(this.authorization)
            let userId = payload["sub"];
            let userPermissions = await prisma.permission.findFirst({
                where: {
                    userId: userId,
                    permission: permission
                }
            });
            if (userPermissions) return true;

            let nodeInfo = await prisma.node.findMany();
            let node = nodeInfo.find((node) => {
                if (node.url.includes(caddyConfig.apps.http.servers.ararat.routes[0].match[0].host[0])) return true;
            })
            if (!node) return false;

            let nodePermissions = await prisma.nodePermission.findFirst({
                where: {
                    userId: userId,
                    permission: permission,
                    nodeId: node.id         
                }
            });
            if (nodePermissions) return true;
        }
        return false;
    }
    async currentRequestAccess(request: NextRequest) {
        const pathname = request.nextUrl.pathname;
        if (pathname == "/1.0") return allowed();
        if (this.authorization) {
          if (pathname.startsWith("/1.0/instances")) return await (this.instances).currentRequestAccess(request);
        }
        return notAllowed();
    }
}