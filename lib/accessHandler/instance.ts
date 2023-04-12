import { InstanceFull } from "lxdjs/dist/lib/lxd/instance";
import { NextRequest } from "next/server";
import { lxdUnix } from "../lxd";
import prisma from "../prisma";
import { notAllowed, sendData } from "./responses";
import AccessHandler from ".";

export default class Instance {
    private authorization: string;
    private payload: object;
    private id: string;
    private accessClient: AccessHandler;

    constructor(id: string, accessClient: AccessHandler, authorization: string | null | undefined, payload: object | null | undefined) {
        this.id = id;
        this.accessClient = accessClient;
        if (authorization) {
            this.authorization = authorization;
        }
        if (payload) {
            this.payload = payload;
        }
    }

    async hasPermission(permission: string) {
        if (await this.hasPermission(permission)) return true;
        //get instance and check here instead
        let instance = await lxdUnix().instances.instance(this.id).metadata();
        let sub = this.payload["sub"];
        if (instance.config[`user.users.${sub}`]) {
            let permissions = JSON.parse(instance.config[`user.users.${sub}`]);
            if (permissions.includes(permission)) return true;
        }
        return false;
    }

    async currentRequestAccess(request: NextRequest) {
        console.log(" IT IS WORKING")
        let sub = this.payload["sub"];
        let path = request.nextUrl.pathname;
        let search = request.nextUrl.search;
        if (path == `/1.0/instances/${this.id}`) {
            let instance;
            if (search.includes("recursion=1")) {
                instance = await lxdUnix().instances.instance(this.id).metadata(true);
            } else {
                instance = await lxdUnix().instances.instance(this.id).metadata();
            }
            if (instance.config[`user.users.${sub}`]) {
                if (search.includes("recursion=1")) {
                    let permissions = JSON.parse(instance.config[`user.users.${sub}`]);
                    if (!this.hasPermission("get-state_instance")) delete instance.state;
                    if (!JSON.stringify(permissions).includes("snapshot")) delete instance.snapshots;
                    if (!JSON.stringify(permissions).includes("backup")) delete instance.backups;
                }
                return sendData(instance);
            }
        }
        return notAllowed();
    }
}