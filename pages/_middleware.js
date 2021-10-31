import { NextResponse } from "next/server";

export async function middleware(req) {
    console.log(req.url)
    if (req.url.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.access_token && req.url == "/auth/login") {
        return NextResponse.redirect("/");
    }
    if (req.cookies.access_token || req.url == "/auth/login") {
        return NextResponse.next();
    } else {
        return NextResponse.redirect("/auth/login");
    }
}  