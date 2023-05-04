import AccessHandler from ".";
import {decode} from "jsonwebtoken";
import { NextRequest } from "next/server";
import Operation from "./operation";

export default class Operations {
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
    
    async currentRequestAccess(request: NextRequest) {
        if (request.nextUrl.pathname.split("/").length >= 4) {
            return await new Operation(request.nextUrl.pathname.split("/")[3], this.accessClient, this.authorization, this.payload).currentRequestAccess(request);
        }
    }

}