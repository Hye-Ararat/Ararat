const express = require("express");

const provider = require("oidc-provider");
const port = 3002;

const bodyParser = require("body-parser");
const app = express()

const cookieParser = require("cookie-parser");
require("dotenv").config({ "path": "./.env.local" })
const configuration = require("./src/authentication/configuration.js");
const mongo = require("./src/lib/mongo");
const {compare} = require("bcrypt");
const jwsClient = require("jwks-rsa")
const jwt = require("jsonwebtoken")
const usersCollection = mongo.db().collection("User")
const oidcProvider = new provider(`http://${process.env.URL}/oidc`, { ...configuration });
app.use(bodyParser.json())
app.use(cookieParser())
app.get("/oidc/.well-known/openid-configuration", async (req, res) => {
    console.log("adsfasdf")
    let config = await fetch("http://localhost:3000/.well-known/openid-configuration").then(re => re.json());
    res.json(config);
})
app.get("/oidc/interaction/:uid", async (req, res) => {
    let inter = await oidcProvider.Interaction.find(req.params.uid);
    console.log("return of /oidc/interaction/:uid")
    console.log(JSON.stringify(inter))
    res.json(inter);
})
app.post("/oidc/interaction/:uid/login", async (req, res, next) => {

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
    console.log("return of /oidc/interaction/:uid/login")
    console.log(`redirects to ${inter.returnTo}`)
    return res.redirect(inter.returnTo);

})

app.post("/isValid", async (req, res) => {
    var jws = jwsClient({
        jwksUri: `http://127.0.0.1:3002/oidc/jwks`
    })

    jwt.verify(req.body.access_token, function getKey(header, callback) {
        console.log(header)
        jws.getSigningKey(header.kid, function (err, key) {
            if (!key) {
                console.log(err)
                console.log("no key")
                res.status(401).send("Invalid token")
            } else {
                var signingKey = key.getPublicKey()
                callback(null, signingKey);
            }
        });
    }, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(401).send("Invalid token")
        } else {
res.status(200).send("Success")
        }
    })
})

app.post("/oidc/interaction/:uid/confirm", async (req, res, next) => {
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
        console.log("return of /oidc/interaction/:uid/confirm")
        console.log(`redirects to ${inter.returnTo}`)
        res.setHeader("Location", inter.returnTo);
        res.setHeader("Content-Length", "0");
        res.status(303);
        res.end();
    } catch (error) {
        res.send(500).send("err");
    }

})

app.get("/oidc/client/:id", async (req, res) => {
    let client = await oidcProvider.Client.find(req.params.id);
    if (client) {
       if (client.clientSecret) {
           client.clientSecret = undefined;
       }
    }
    console.log("return of /oidc/client/:id")
    console.log(JSON.stringify(client))
    res.json(client);
})

app.use(oidcProvider.callback());
app.listen(port, (err) => {
    if (err) throw err
    console.log(`> Hye Ararat is running on http://${process.env.URL}`)
})