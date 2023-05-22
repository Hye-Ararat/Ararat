import { NextRequest, NextResponse } from "next/server";
import { errorResponse, standardResponse } from "../responses";
import Instances from "./instances";
import { allowed, notAllowed } from "./responses";
import {decode} from "jsonwebtoken";
import prisma from "../prisma";
import caddyConfig from "../../../caddyConfig.json";
import Operations from "./operations";
import Profiles from "./profiles";
import StoragePools from "./storagePools";
import Networks from "./networks";

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
    get operations() {
        return new Operations(this, this.authorization)
    }
    get profiles() {
        return new Profiles(this, this.authorization);
    }
    get storagePools() {
        return new StoragePools(this, this.authorization);
    }

    get networks() {
        return new Networks(this, this.authorization);
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
        console.log(pathname, "This is the pathname :)")
        if (pathname == "/1.0") return allowed();
        if (this.authorization) {
          if (pathname.startsWith("/1.0/instances")) return await (this.instances).currentRequestAccess(request);
          if (pathname.startsWith("/1.0/operations")) return await (this.operations).currentRequestAccess(request);
          if (pathname.startsWith("/1.0/profiles")) return await (this.profiles).currentAccessRequest(request);
          if (pathname.startsWith("/1.0/storage-pools")) return await (this.storagePools).currentAccessRequest(request);
          if (pathname.startsWith("/1.0/networks")) return await (this.networks).currentAccessRequest(request);
        }
        return notAllowed();
    }
}