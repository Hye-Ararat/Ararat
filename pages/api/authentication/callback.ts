import {provider} from "../../../lib/oidc";
import {client as oidcClient} from "../../../lib/oidcClient";
import http from "node:http";
import {serialize} from "cookie"
import caddyConfig from "../../../caddyConfig.json";

export default async function handler(req, res : http.ServerResponse) {
    let url = caddyConfig.apps.http.servers.ararat.routes[0].match[0].host;
    const oidc = provider();
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "authorization_code");
    formBody.append("code", req.query.code);
    formBody.append("redirect_uri", `https://${url}/api/authentication/callback`);
    formBody.append("client_id", "lxd");
    formBody.append("scope", "openid profile");
    formBody.append("code_verifier", (await oidcClient()).codeVerifier);

    let dat = await oidc.AuthorizationCode.length
    const tokenResponse = await fetch(`https://${url}/api/authentication/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody.toString(),
        cache: "no-cache"
    })
    let data = await tokenResponse.json();
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
    return res.redirect("/dashboard")
    }