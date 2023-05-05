import Provider from "oidc-provider";
import { generateKeyPair, exportJWK } from "jose";
import fs from "fs";
import { PrismaAdapter } from "./prismaAdapter.js";
import express from "express";
import { PrismaClient } from "../core/node_modules/.prisma/client/index.js";
import { compare } from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const caddyConfig = JSON.parse(fs.readFileSync("../caddyConfig.json", "utf8"));
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config({path: "../core/.env.local"});
dotenv.config({path: "../core/.env"});

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
await setupKey();

let url = caddyConfig.apps.http.servers.ararat.routes[0].match[0].host[0]
console.log(url)

const configuration = {
    //adapter: PrismaAdapter,
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
        authorization: '/authentication/auth',
        backchannel_authentication: '/authentication/backchannel',
        code_verification: '/authentication/device',
        device_authorization: '/authentication/device/auth',
        end_session: '/authentication/session/end',
        introspection: '/authentication/token/introspection',
        jwks: '/authentication/jwks',
        pushed_authorization_request: '/authentication/request',
        registration: '/authentication/reg',
        revocation: '/authentication/token/revocation',
        token: '/authentication/token',
        userinfo: '/authentication/me'
    },
    cookies: {
        keys: [process.env.ENC_KEY],
    },
    jwks: {
        keys: [JSON.parse(fs.readFileSync("./key", "utf8"))]
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
            try {
            console.log(interaction, "INTERACTION")
            let interactionId = interaction.returnTo.split("/").pop();
            console.log(interactionId, "INTERACTION ID")
            console.log(interaction.prompt.name, "INTERACTION PROMPT NAME")
            if (interaction.prompt.name == "login") {
                return `https://${url}/authentication/login?interaction=${interactionId}`;
            }
            if (interaction.prompt.name == "consent") {
                return `https://${url}/authentication/authorize?interaction=${interactionId}`;
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

let oidc = new Provider(`https://${url}`, configuration);

oidc.listen(3002, () => {
    console.log("OIDC service listening on port 3002")
})
oidc.proxy = true
oidc.on("server_error", (ctx, err) => {
    console.log(err)
})

const app = express();
app.use(bodyParser.json())
app.use(cookieParser())

function errorResponse(error, status, metadata) {
    let response = {
        "type": "error",
        "error": error,
        "error_code": typeof error == "number" ? error : status ? status : 400,
    }
    if (metadata) response.metadata = metadata;
    return response;
}

app.get("/client/:id", async (req, res) => {
    let client = await oidc.Client.find(req.params.id);
    if (client) {
    if (client.clientSecret) {
    client.clientSecret = undefined;
    }
}
    res.json(client);
})

app.get("/interaction/:uid", async (req, res) => {
    let inter = await oidc.Interaction.find(req.params.uid);
    res.json(inter);
})
app.post("/interaction/:uid/login", async (req, res, next) => {
    console.log(req.cookies)
    try {
         let email = req.body.email;
    let password = req.body.password;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            permissions: true
        }
    });
    const authError = errorResponse(400, 400, "Invalid email or password");
    if (!user) return res.status(401).json(authError);
    const match = await compare(password, user.password);
    if (!match) return res.status(401).json(authError);
    const result = {
        login: {
            accountId: user.id
        }
    }
    const inter = await oidc.Interaction.find(req.params.uid);
    inter.result = result;
    let epoch = (date = Date.now()) => Math.floor(date / 1000);
    await inter.save(inter.exp - epoch());
    return res.redirect(inter.returnTo);
    } catch (error) {
        console.log(error)
        return next(error)
    }
})

app.post("/interaction/:uid/confirm", async (req, res, next) => {
    try {
            let inter = await oidc.Interaction.find(req.params.uid)
    let grantId = inter.grantId;
    let grant;
    if (grantId) {
        grant = await oidc.Grant.find(grantId);
    } else {
        grant = new oidc.Grant({
            accountId: inter.session.accountId,
            clientId: inter.params.client_id
        });
    }
    if (inter.prompt.details.missingOIDCScope) {
        grant.addOIDCScope(inter.prompt.details.missingOIDCScope.join(" "));
    }
    if (inter.prompt.details.missingOIDCClaims) {
        grant.addOIDCClaims(inter.prompt.details.missingOIDCClaims);
    }
    if (inter.prompt.details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(inter.prompt.details.missingResourceScopes)) {
            grant.addResourceScope(indicator, scopes.join(" "));
        }
    }
    grantId = await grant.save();
    let consent = {};
    if (!inter.grantId) {
        consent.grantId = grantId;
    }
    const result = {consent};
    inter.result = {...inter.lastSubmission, ...result};
    let epoch = (date = Date.now()) => Math.floor(date / 1000);
    await inter?.save(inter.exp - epoch())
    res.setHeader("Location", inter.returnTo);
    res.setHeader("Content-Length", "0");
    res.status(303);
    res.end();
    } catch (error) {
        res.send(500).send("err");
    }

})

app.listen(3003);