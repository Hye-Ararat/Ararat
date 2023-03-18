import {provider} from "../../../lib/oidc";
import {client as oidcClient} from "../../../lib/oidcClient";
import http from "node:http";
import {serialize} from "cookie"

export default async function handler(req, res : http.ServerResponse) {
    const oidc = provider();
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "authorization_code");
    formBody.append("code", req.query.code);
    formBody.append("redirect_uri", "https://us-dal-1.hye.gg/api/authentication/callback");
    formBody.append("client_id", "test");
    formBody.append("client_secret", "test");
    formBody.append("scope", "openid profile");
    formBody.append("code_verifier", (await oidcClient()).codeVerifier);

    let dat = await oidc.AuthorizationCode.length
    const tokenResponse = await fetch("https://us-dal-1.hye.gg/api/authentication/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody.toString(),
        cache: "no-cache"
    })
    let data = await tokenResponse.json();
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
    return res.redirect("/dashboard")
    }