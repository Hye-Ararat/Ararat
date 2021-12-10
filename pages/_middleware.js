import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt"

export async function middleware(req) {
    console.log("indeed", req.url)
    try {
        var u = req.url
        if (!u.startsWith('http')) u = 'http://localhost' + u
        var url = new URL(u)
        var path = url.pathname
    } catch (error) {
       
      console.log(error)
    }
    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.refresh_token && !req.cookies.access_token && !path.includes("/auth")) {
        try {
           var valid = await jwt.verify(req.cookies.refresh_token, process.env.ENC_KEY)
        } catch (error) {
           console.log(error)
        }
        if (valid) {
            var data = await fetch(`${process.env.URL}/api/v1/client/auth/refresh_token_user`, {
                headers: {
                    "Refresh-Token": req.cookies.refresh_token
                }
            })
            if (data.status == 200) {
                var access_token = await jwt.sign(await data.json(), process.env.ENC_KEY)
                return NextResponse.redirect(`/api/v1/client/auth/set_access_token?access_token=${access_token}&route=${req.url}`)
            } else {
                return NextResponse.redirect(`/api/v1/client/auth/remove_refresh_token`)

            }
        }
        return NextResponse.redirect(`/api/v1/client/auth/remove_refresh_token`)
    }
    if (req.cookies.refresh_token && path.includes("/auth")) {
        return NextResponse.redirect("/");
    }
    if (req.cookies.refresh_token || path.includes("/auth")) {
        return NextResponse.next();
    }
    return NextResponse.redirect("/auth/login", 307);
}  