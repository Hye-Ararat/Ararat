const fs = require("fs");
const generateKeyPair = require("jose").generateKeyPair;
const exportJWK = require("jose").exportJWK;

async function setupKey() {
    console.log("Checking for key...");
    if (fs.existsSync("./key")) {
        console.log("Key found!");
        return;
    };
    console.log("No key found, generating...");
    const keypair = await generateKeyPair("RS256");
    const jwk = await exportJWK(keypair.privateKey);
    fs.writeFileSync("./key", JSON.stringify(jwk));
    console.log("Key generated!");
    return;
}
setupKey();


let url = process.env.URL

/**
 * @type {import("@types/oidc-provider").Configuration}
 */
const configuration = {
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    clients: [
        {
            client_id: 'lxd',
            client_secret: 'test',
            redirect_uris: ["http://localhost:5556/auth/lxd/callback", `http://${url}/api/authentication/callback`],
            client_name: "Hye Ararat",
            logo_uri: "https://linuxcontainers.org/lxd/docs/latest/_images/containers.png",
            scope: "openid profile email offline_access",
            token_endpoint_auth_method: "none",
            grant_types: ["authorization_code", "urn:ietf:params:oauth:grant-type:device_code", "refresh_token", "client_credentials"]
        }
    ],
    routes: {
        authorization: '/oidc/auth',
        backchannel_oidc: '/oidc/backchannel',
        code_verification: '/oidc/device',
        device_authorization: '/oidc/device/auth',
        end_session: '/oidc/session/end',
        introspection: '/oidc/token/introspection',
        jwks: '/oidc/jwks',
        pushed_authorization_request: '/oidc/request',
        registration: '/oidc/reg',
        revocation: '/oidc/token/revocation',
        token: '/oidc/token',
        userinfo: '/oidc/me'
    },
    cookies: {
        keys: [process.env.ENC_KEY],
    },
    jwks: {
        keys: [JSON.parse(fs.readFileSync("./key", "utf8"))]
    },
    // renderError: (ctx, out, error) => {

    //     console.log("ERR", out, error)
    // },
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
                return `http://${url}`;
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
            try {
                let interactionId = interaction.returnTo.split("/").pop();
                if (interaction.prompt.name == "login") {
                    return `http://${url}/authentication/login?interaction=${interactionId}`;
                }
                if (interaction.prompt.name == "consent") {
                    return `http://${url}/authentication/authorize?interaction=${interactionId}`;
                }
            } catch (err) {
                console.log("ERROR", err)
            }
        }
    },
    ttl: {
        Grant: 1 * 60 * 60, // 1 hour
    },
    findAccount(ctx, sub, token) {
        return {
            accountId: sub,
            async claims(use, scope, claims, rejected) {
                return {
                    sub: sub,
                }
            }
        }
    }
};

module.exports = configuration;