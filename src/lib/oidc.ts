import { Issuer, generators, Client } from 'openid-client';

let url = process.env.URL


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


export async function client(): Promise<ClientInt> {
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