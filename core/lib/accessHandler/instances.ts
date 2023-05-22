import { NextRequest, NextResponse } from "next/server";
import { errorResponse, standardResponse } from "../responses";
import prisma from "../prisma";
import {decode} from "jsonwebtoken";
import { allowed, notAllowed, rewrite, sendData } from "./responses";
import lxd, { lxdUnix } from "../lxd";
import Instance from "./instance";
import AccessHandler from ".";
export default class Instances {
    private authorization: string;
    private payload: object;
    private accessClient: AccessHandler;
    constructor(accessClient: AccessHandler, authorization: string | null | undefined) {
        this.accessClient = accessClient;
        if (authorization) {
            this.authorization = authorization;
            this.payload = decode(this.authorization);
        }

    }

    instance(id: string) {
        return new Instance(id, this.accessClient, this.authorization, this.payload)
    }

    async currentRequestAccess(request: NextRequest) {
        console.log(request.nextUrl.pathname.split("/"))
        if (request.nextUrl.pathname.split("/").length >= 4) {
            return new Instance(request.nextUrl.pathname.split("/")[3], this.accessClient, this.authorization, this.payload).currentRequestAccess(request);
        }
        let sub = this.payload["sub"];
        if (request.nextUrl.pathname == "/1.0/instances") {
            if (request.method == "POST") {
                //add permission checking for this later
                return allowed();
            } 
        }
        if (request.nextUrl.search.includes("recursion=2")) {
            let instances = await lxdUnix().getInstances(2);
            let filteredInstances = instances.filter((instance) => {
                if (instance.config[`user.users.${sub}`]) return true;
            })
            let censoredInstances = filteredInstances.map((instance) => {
                let permissions = JSON.parse(instance.config[`user.users.${sub}`]);
                if (!permissions.includes("get-state_instance")) delete instance.state;
                if (!JSON.stringify(permissions).includes("snapshot")) delete instance.snapshots;
                if (!JSON.stringify(permissions).includes("backup")) delete instance.backups;

            })
            return sendData(censoredInstances);
            //return rewrite(`/1.0/instances?recursion=1`, request.headers.get("Origin"))
        }
        if (request.nextUrl.search.includes("recursion=1")) {
            let instances = await lxdUnix().getInstances();
            let filteredInstances = instances.filter((instance) => {
                if (instance.config[`user.users.${sub}`]) return true;
            })
            return sendData(filteredInstances);
        }
        return notAllowed();
    }

}