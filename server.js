const express = require("express");
const next = require("next");
const provider = require("oidc-provider")
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.prepare().then(() => {
    const server = express()
    const configuration = require("./src/authentication/configuration.js");
    const oidcProvider = new provider("http://localhost:3000/oidc", { ...configuration });
    server.use(bodyParser.json())
    server.use(cookieParser())
    server.get("/oidc/interaction/:uid", async (req, res) => {
        let inter = await oidcProvider.Interaction.find(req.params.uid);
        res.json(inter);
    })
    server.post("/oidc/interaction/:uid/login", async (req, res, next) => {
        console.log(req.cookies)
        try {
            let email = req.body.email;
            let password = req.body.password;
            // const user = await prisma.user.findFirst({
            //     where: {
            //         email: email
            //     },
            //     include: {
            //         permissions: true
            //     }
            // });
            const authError = {
                error: "Invalid email or password"
            }
            let user = {
                id: "1234",
                email: "1234",
                password: "adfasdfasdfasdf"
            }
            if (!user) return res.status(401).json(authError);
            //const match = await compare(password, user.password);
            //if (!match) return res.status(401).json(authError);
            const result = {
                login: {
                    accountId: user.id
                }
            }
            const inter = await oidcProvider.Interaction.find(req.params.uid);
            inter.result = result;
            let epoch = (date = Date.now()) => Math.floor(date / 1000);
            await inter.save(inter.exp - epoch());
            console.log("inter", inter.returnTo)
            return res.redirect(inter.returnTo);
        } catch (error) {
            console.log(error)
            return next(error)
        }
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
    server.all('*', (req, res) => {
        if (req.url.startsWith("/.well-known") || req.url.startsWith("/oidc")) return oidcProvider.callback()(req, res)
        return handle(req, res)
    })
    server.use(oidcProvider.callback());
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Hye Ararat is running on http://localhost:${port}`)
    })
})
