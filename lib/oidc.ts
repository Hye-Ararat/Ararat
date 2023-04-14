import Provider, {Configuration} from 'oidc-provider';
import { generateKeyPair, exportJWK } from 'jose';
import fs from 'fs';
import caddyConfig from "../caddyConfig.json";

async function run() {
    console.log("CHECKING")
    if (fs.existsSync("./key")) return;
    console.log("no exists")
const keypair = await generateKeyPair('RS256');
//convert to jwk key
const jwk = await exportJWK(keypair.privateKey);
console.log(jwk)
fs.writeFileSync("./key", JSON.stringify(jwk))

}
run()

let url = caddyConfig.apps.http.servers.ararat.routes[0].match[0].host
const configuration : Configuration = {
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    clients: [
        {
            client_id: 'foo',
            client_secret: 'bar',
            redirect_uris: ["http://localhost:4000/callback"],
            client_name: "Company Name",
            logo_uri: "https://img.logoipsum.com/220.svg",
            scope: "openid profile email offline_access"
        },
        {
            client_id: 'lxd',
            client_secret: 'test',
            redirect_uris: ["http://localhost:5556/auth/lxd/callback", `https://${url}/api/authentication/callback`],
            client_name: "LXD",
            logo_uri: "https://linuxcontainers.org/lxd/docs/latest/_images/containers.png",
            scope: "openid profile email offline_access",
            token_endpoint_auth_method: "none",
            grant_types: ["authorization_code", "urn:ietf:params:oauth:grant-type:device_code", "refresh_token", "client_credentials"]
        }
    ],
    routes: {
        authorization: '/api/authentication/auth',
        backchannel_authentication: '/api/authentication/backchannel',
        code_verification: '/api/authentication/device',
        device_authorization: '/api/authentication/device/auth',
        end_session: '/api/authentication/session/end',
        introspection: '/api/authentication/token/introspection',
        jwks: '/api/authentication/jwks',
        pushed_authorization_request: '/api/authentication/request',
        registration: '/api/authentication/reg',
        revocation: '/api/authentication/token/revocation',
        token: '/api/authentication/token',
        userinfo: '/api/authentication/me'
        },
        cookies: {
            keys: [process.env.ENC_KEY]
        },
        jwks: {
            keys: [JSON.parse(fs.readFileSync("./key", "utf8")) as any]
        },
    features: {
        devInteractions: {
            enabled: false
        },
        deviceFlow: {
            enabled: true,
        },
        clientCredentials: {
            enabled: true,
        },
        introspection: {
            enabled: true,
        },
        resourceIndicators: {
            enabled: true,
            defaultResource() {
                return `https://${url}`;
            },
            getResourceServerInfo(ctx, resourceIndicator, client) {
                return ({
                  scope: 'openid profile email offline_access',
                  audience: 'lxd',
                  accessTokenTTL: 1 * 60 * 60, // 2 hours
                  accessTokenFormat: 'jwt'
                });
              },
              useGrantedResource(ctx, model) {
                return true;
              }
        },
    },
    interactions: {
        url(ctx, interaction) {
            console.log(interaction)
            if (interaction.prompt.name == "login") {
            return `https://${url}/authentication/login?interaction=${interaction.uid}`;
            }
            if (interaction.prompt.name == "consent") {
            return `https://${url}/authentication/authorize?interaction=${interaction.uid}`;
            }
        }
    },
    findAccount(ctx, sub, token) {
        console.log(sub, "THIS IS THE SUB")
        return {
            accountId: sub,
            async claims(use, scope, claims, rejected) {
                console.log(use, scope, claims, rejected, "THIS IS THE CLAIMS")
                return {
                    sub: sub,
                }
            }
        }
    }
};
let oidc : Provider;
let listenInProg = false;



export function provider() {
    if (process.env.NODE_ENV === 'production' && !listenInProg && !oidc) {
        oidc = new Provider(`https://${url}`, configuration);
        listenInProg = true;
        oidc.listen(3002, () => {
            listenInProg = false;
            console.log("OIDC Service listening on 3002")
        })
    } else {
        if (!global.oidc && !listenInProg && !oidc) {
            global.oidc = new Provider(`https://${url}`, configuration);
            listenInProg = true;
            global.oidc.listen(3002, () => {
                listenInProg = false;
                console.log("OIDC Service listening on 3002")
            })
        }
        oidc = global.oidc;
    }
    oidc.proxy = true;
    return oidc;
}