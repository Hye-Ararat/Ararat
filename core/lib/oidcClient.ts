import { Issuer, generators, Client } from 'openid-client';
import caddyConfig from "../../caddyConfig.json";

let url = caddyConfig.apps.http.servers.ararat.routes[0].match[0].host;


let issuer : Issuer;
let oidClient : Client;
let codeVerifier : string;
let codeChallenge : string;

function authorizationUrl(scope) {
    return oidClient.authorizationUrl({
        scope: scope,
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
    })
}

let cachedClient;
async function getClient() {
    if (!issuer) {
        issuer = await Issuer.discover(`https://${url}`);
    }
    if (!oidClient) {
        oidClient = new issuer.Client({
            client_id: "lxd",
            redirect_uris: [`https://${url}/api/authentication/callback`],
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

export async function client() {
    if (process.env.NODE_ENV === 'production') {
        if (!cachedClient) {
            cachedClient = await getClient();
        }
    } else {
        if (!global.oidcClient) {
            global.oidcClient = await getClient();
        }
        cachedClient = global.oidcClient;
    }
    return cachedClient;
}