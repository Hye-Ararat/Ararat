import axios from "axios";
import { NextResponse } from "next/server";
import {cookies} from "next/headers"

export async function GET(req, res) {
    let clientCookies = cookies().getAll();
    let cookieHeader = "";
    for (let cookie in clientCookies) {
        cookieHeader += clientCookies[cookie].name + "=" + clientCookies[cookie].value + "; ";
    }
    let query = req.nextUrl.searchParams;
    let dat = await (axios.get("http://127.0.0.1:8080/realms/Ararat/protocol/openid-connect/auth" + req.nextUrl.search, {
        headers: {
            "Cookie": cookieHeader,
        },
        maxRedirects: 0,
    }).catch(err => {
        return err
    }))
    if (dat.response) {
    if (dat.response.status == 302) {
        return NextResponse.redirect(dat.response.headers.location);
    }
}
    return new NextResponse(dat.data, {
        headers: {
            "Content-Type": "text/html",
            "set-cookie": dat.headers["set-cookie"],
        }
    })
}