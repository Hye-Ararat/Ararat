import { Issuer, generators, Client } from 'openid-client';
import { provider } from "./oidc";



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
    provider()
    if (!issuer) {
        issuer = await Issuer.discover('https://us-dal-1.hye.gg/api/authentication');
    }
    if (!oidClient) {
        oidClient = new issuer.Client({
            client_id: "test",
            client_secret: "test",
            redirect_uris: ["https://us-dal-1.hye.gg/api/authentication/callback"],
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