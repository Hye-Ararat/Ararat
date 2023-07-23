const express = require("express");
const next = require("next");

const provider = require("oidc-provider")
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const url = process.env.URL;
const app = next({ dev })
const handle = app.getRequestHandler()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ "path": "./.env.local" })
const mongo = require("./src/lib/mongo")
const { compare } = require("bcrypt")

app.prepare().then(() => {
    const usersCollection = mongo.db().collection("User")
    const server = express()
    const configuration = require("./src/authentication/configuration.js");
    /**
 * @type {import("@types/oidc-provider").default}
 */
    const oidcProvider = new provider(`http://${process.env.URL}/oidc`, { ...configuration });
    oidcProvider.on("authorization.error", console.log)
    server.use(bodyParser.json())
    server.use(cookieParser())
    server.get("/oidc/.well-known/openid-configuration", async (req, res) => {
        console.log("adsfasdf")
        let config = await fetch("http://localhost:3000/.well-known/openid-configuration").then(re => re.json());
        res.json(config);
    })
    server.get("/oidc/interaction/:uid", async (req, res) => {
        let inter = await oidcProvider.Interaction.find(req.params.uid);
        res.json(inter);
    })
    server.post("/oidc/interaction/:uid/login", async (req, res, next) => {

        let email = req.body.login;
        let password = req.body.password;
        try {
            var user = await usersCollection.findOne({
                email: email
            })
        } catch (error) {
            return res.status(500).json({
                error: "Internal server error"
            })
        }
        const authError = {
            error: "Invalid email or password"
        }
        if (!user) return res.status(401).json(authError);
        const match = await compare(password, user.password);
        if (!match) return res.status(401).json(authError);
        const result = {
            login: {
                accountId: user._id.toString(),
                firstName: user.firstName
            }
        }
        const inter = await oidcProvider.Interaction.find(req.params.uid);
        inter.result = result;
        let epoch = (date = Date.now()) => Math.floor(date / 1000);
        await inter.save(inter.exp - epoch());
        return res.redirect(inter.returnTo);

    })

    server.post("/oidc/interaction/:uid/confirm", async (req, res, next) => {
        try {
            let inter = await oidcProvider.Interaction.find(req.params.uid)
            let grantId = inter.grantId;
            let grant;
            if (grantId) {
                grant = await oidcProvider.Grant.find(grantId);
            } else {
                grant = new oidcProvider.Grant({
                    accountId: inter.session.accountId,
                    clientId: inter.params.client_id,
                    firstName: inter.session.firstName
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
            const result = { consent };
            inter.result = { ...inter.lastSubmission, ...result };
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
    server.get("/oidc/client/:id", async (req, res) => {
        let client = await oidcProvider.Client.find(req.params.id);
        if (client) {
           if (client.clientSecret) {
               client.clientSecret = undefined;
           }
        }
        res.json(client);
    })

    server.all('*', (req, res) => {
        if (req.url.startsWith("/.well-known") || req.url.startsWith("/oidc")) return oidcProvider.callback()(req, res)
        return handle(req, res)
    })
    server.use(oidcProvider.callback());
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Hye Ararat is running on http://${process.env.URL}`)
    })
})
