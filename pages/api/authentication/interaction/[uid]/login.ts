import { NextIncomingMessage } from "next/dist/server/request-meta";
import oidc from "../../../../../lib/oidc";

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "POST":
            let inter= await oidc.Interaction.find(req.query.uid);
            console.log(inter)
            const account = {
                id: "test"
            }
            const result = {
                login: {
                  accountId: account.id,
                },
              };
            inter.result = result;
            let epoch = (date = Date.now()) => Math.floor(date / 1000)
            await inter?.save(inter.exp - epoch())
            console.log(inter.returnTo)
            res.setHeader("Location", inter.returnTo).setHeader("Content-Length", "0").status(303).end();
    }
}