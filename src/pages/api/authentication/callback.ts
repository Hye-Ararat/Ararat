import { client as oidcClient } from "@/lib/oidc";
import { serialize } from "cookie"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("asdfasdf")
    let url = process.env.URL;
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "authorization_code");
    formBody.append("code", (req.query.code as string));
    formBody.append("redirect_uri", `https://${url}/api/authentication/callback`);
    formBody.append("client_id", "incus");
    formBody.append("scope", "openid profile");
    formBody.append("code_verifier", (await oidcClient()).codeVerifier);
    console.log("asdfasdf2")
    console.log(formBody.toString())

    process.env.NODE_DEBUG = "http"
    const tokenResponse = await fetch(`http://127.0.0.1:3002/oidc/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody.toString(),
        cache: "no-cache"
    })

    let data = await tokenResponse.json();
    console.log("asdfasdf3")
    console.log(data)
    let expires = data.expires_in;
    let id_token_cookie = serialize("id_token", data.id_token, {
        path: "/",
        maxAge: expires
    });
    let access_token_cookie = serialize("access_token", data.access_token, {
        path: "/",
        maxAge: expires
    });
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Set-Cookie", [id_token_cookie, access_token_cookie]);
    res.redirect("/")
    res.end()
    return;
}