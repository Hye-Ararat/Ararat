import AccessHandler from ".";
import { lxdUnix } from "../lxd";

export default class Profile {
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
        if (await this.accessClient.hasPermission(permission)) return true;
        let profile = await lxdUnix().profiles.profile(this.id).metadata();
        let sub = this.payload["sub"];
        if (profile.config[`user.users.${sub}`]) {
            let permissions = JSON.parse(profile.config[`user.users.${sub}`]);
            if (permissions.includes(permission)) return true;
        }
        return false;
    }
}