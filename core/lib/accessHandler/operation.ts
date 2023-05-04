import { NextRequest } from "next/server";
import AccessHandler from ".";
import { lxdUnix } from "../lxd";
import { allowed, notAllowed } from "./responses";

export default class Operation {
    private id: string;
    private accessClient: AccessHandler;
    private payload: object;
    private authorization: string;

    constructor(id: string, accessClient: AccessHandler, authorization: string | null | undefined, payload: object | null | undefined) {
        this.id = id;
        this.accessClient = accessClient;
        if (authorization) this.authorization = authorization;
        if (payload) this.payload = payload;
    }

    async currentRequestAccess(request: NextRequest) {
        let path = request.nextUrl.pathname;
        let search = request.nextUrl.search;
        let sub = this.payload["sub"];

        if (path == `/1.0/operations/${this.id}/websocket`) {
            let operation = await (lxdUnix().operations.operation(this.id)).getState();
            return allowed();
        }
        if (path == `/1.0/operations/${this.id}`) {
            let operation = await (lxdUnix().operations.operation(this.id)).getState();
            if (operation.resources["instances"]) {
                let allowedInstances: string[] = [];
                let checkPermission = new Promise<void>((resolve, reject) => {
                    operation.resources["instances"].forEach(async (resource: string, index: number, array: string[]) => {
                        let instanceId = resource.split("/")[3];

                        if (operation.description == "Showing console") {
                            if (await this.accessClient.instances.instance(instanceId).hasPermission("connect-console_instance")) allowedInstances.push(instanceId);
                        }

                        if (index == array.length - 1) resolve();
                    })
                })
                await checkPermission;
                if (allowedInstances.length == operation.resources["instances"].length) return allowed();
            }
            return notAllowed();
        }
        return notAllowed();
    }
}