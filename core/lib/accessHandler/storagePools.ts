import AccessHandler from ".";
import {decode} from "jsonwebtoken";
import {NextRequest} from "next/server";
import { lxdUnix } from "../lxd";
import { sendData } from "./responses";

export default class StoragePools {
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
        console.log("STORAGE POOL CURRENT REQUEST ACCESS CHECK")
        let sub = this.payload["sub"];
        console.log(request.nextUrl.pathname, "asdlkfja;sldkfjalkj")
        if (request.nextUrl.pathname == "/1.0/storage-pools") {
            let storagePools = await lxdUnix().getStoragePools();
            let filteredPools = storagePools.filter((pool) => {
                if (pool.config[`user.users.${sub}`]) return true;
            });
            return sendData(filteredPools)
        }
    }
}