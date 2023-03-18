import {provider} from "../../../../../lib/oidc";

export default async function handler(req, res) {
    const oidc = provider();
    const { method } = req;
    switch (method) {
        case "POST":
            let inter= await oidc.Interaction.find(req.query.uid);
            let grantId = inter?.grantId;
            let grant;
            if (grantId) {
                grant  = await oidc.Grant.find(grantId);
            } else {
                grant = new oidc.Grant({
                    accountId: inter?.session?.accountId,
                    clientId: inter?.params.client_id
                })
            }
            if (inter?.prompt.details.missingOIDCScope) {
                grant.addOIDCScope(inter.prompt.details.missingOIDCScope.join(' '));
            }
            if (inter?.prompt.details.missingOIDCClaims) {
                grant.addOIDCClaims(inter.prompt.details.missingOIDCClaims);
            }
            if (inter?.prompt.details.missingResourceScopes) {
                for (const [indicator, scopes] of Object.entries(inter.prompt.details.missingResourceScopes)) {
                    grant.addResourceScope(indicator, scopes.join(" "));
                }
            }
            grantId = await grant.save();

            const consent = {};
            if (!inter.grantId) {
                consent.grantId = grantId;
            }
            const result = {consent};
            inter.result = {...inter?.lastSubmission, ...result};
            let epoch = (date = Date.now()) => Math.floor(date / 1000)
            await inter?.save(inter.exp - epoch())
            let returnTo =(await oidc.Interaction.find(req.query.uid)).returnTo
            res.setHeader("Location", inter.returnTo).setHeader("Content-Length", "0").status(303).end();
    }
}