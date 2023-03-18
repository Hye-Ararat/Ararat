import {provider} from "../../../../../lib/oidc";
import prisma from "../../../../../lib/prisma";
import { errorResponse } from "../../../../../lib/responses";
import {compare} from "bcryptjs";

export default async function handler(req, res) {
    const oidc = provider();
    const { method } = req;
    switch (method) {
        case "POST":
          console.log(req.body)
          const lines = req.body.split('\n');
          const body = {};
          let currentKey = null;
          
          for (const line of lines) {
            if (line.startsWith('Content-Disposition')) {
              currentKey = line.split('"')[1];
            } else if (currentKey && line.trim()) {
              body[currentKey] = line.trim();
              currentKey = null;
            }
          }   
          let email = body.login;
          let password = body.password;
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
            include: {
              permissions: true
            }
          });
          const authError = errorResponse(400, 400, "Invalid email or password");
          if (!user) return res.status(401).send(authError);
          const match = await compare(password, user.password);
          if (!match) return res.status(401).send(authError);

            let inter= await oidc.Interaction.find(req.query.uid);
            console.log("THE STUFF")
            console.log(inter)
            const account = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            const result = {
                login: {
                  accountId: account.id,
                },
              };
            inter.result = result;
            let epoch = (date = Date.now()) => Math.floor(date / 1000)
            await inter?.save(inter.exp - epoch())
            res.setHeader("Location", inter.returnTo).setHeader("Content-Length", "0").status(303).end();
    }
}