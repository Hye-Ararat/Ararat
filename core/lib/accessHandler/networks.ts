import { decode } from "jsonwebtoken";
import AccessHandler from ".";
import { NextRequest } from "next/server";
import { notAllowed, sendData } from "./responses";
import { lxdUnix } from "../lxd";

export default class Networks {
    private authorization: string;
    private payload: object;
    private accessClient;

    constructor(accessClient: AccessHandler, authorization: string | null | undefined) {
        this.accessClient = accessClient;
        if (authorization) {
            this.authorization = authorization;
            this.payload = decode(authorization);
        }
    }

    async currentAccessRequest(request: NextRequest) {
        let sub = this.payload["sub"];
        if (request.nextUrl.pathname == "/1.0/networks") {
            let networks = await lxdUnix().getNetworks();
            let filteredNetworks = networks.filter((network) => {
                if (network.config[`user.users.${sub}`]) return true;
            })
            return sendData(filteredNetworks);
        }
        return notAllowed();
    }
}