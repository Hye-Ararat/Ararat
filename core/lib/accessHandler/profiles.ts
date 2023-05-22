import { NextRequest } from "next/server";
import AccessHandler from ".";
import {decode} from "jsonwebtoken";
import { lxdUnix } from "../lxd";
import { sendData } from "./responses";

export default class Profiles {
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

    async currentAccessRequest(request: NextRequest) {
        let sub = this.payload["sub"];
        if (request.nextUrl.pathname == "/1.0/profiles") {
            let profiles = await lxdUnix().getProfiles();
            let filteredProfiles = profiles.filter((profile) => {
                console.log(profile)
                if (profile.config[`user.users.${sub}`]) return true;
            });
            return sendData(filteredProfiles);
        }
    }
}