import { Issuer, generators, Client, BaseClient } from 'openid-client';
import jwt from "jsonwebtoken"
import jwsClient from "jwks-rsa"
import axios from "axios"
let url = process.env.URL


let issuer: Issuer;
let oidClient: Client;
let codeVerifier: string;
let codeChallenge: string;

function authorizationUrl(scope: string) {
    return oidClient.authorizationUrl({
        scope: scope,
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
    })
}

let cachedClient: {
    authorizationUrl: (scope: any) => string;
    codeVerifier: string;
    codeChallenge: string;
    oidClient: BaseClient;
};
async function getClient() {
    if (!issuer) {
        issuer = await Issuer.discover(`http://${url}`);
    }
    if (!oidClient) {
        oidClient = new issuer.Client({
            client_id: "lxd",
            redirect_uris: [`http://${url}/api/authentication/callback`],
            response_types: ["code"]
        })
    }
    if (!codeVerifier) {
        codeVerifier = generators.codeVerifier();
    }
    if (!codeChallenge) {
        codeChallenge = generators.codeChallenge(codeVerifier);
    }
    return {
        authorizationUrl: authorizationUrl,
        codeVerifier: codeVerifier,
        codeChallenge: codeChallenge,
        oidClient: oidClient
    }
}

interface ClientInt {
    authorizationUrl: (scope: string) => string,
    codeVerifier: string,
    codeChallenge: string,
    oidClient: Client
}



export async function validateSession(access_token: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.post(`http://127.0.0.1:3002/isValid`, {
                access_token: access_token
            })
        } catch (error) {
            return resolve(false)
        }
        return resolve(true)
     
    })
}

export async function client(): Promise<ClientInt> {
    if (process.env.NODE_ENV === 'production') {
        if (!global.oidcClient) {
            global.oidcClient = await getClient();
        }
        cachedClient = global.oidcClient
    } else {
        //@ts-expect-error
        if (!global.oidcClient) {
            //@ts-expect-error
            global.oidcClient = await getClient();
        }
        //@ts-expect-error
        cachedClient = global.oidcClient;
    }
    return cachedClient;
}