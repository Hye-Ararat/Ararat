import { NextResponse } from "next/server";

export async function middleware(req) {
    var path = req.nextUrl.pathname;

    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.refresh_token && path.includes("/auth")) {
        return NextResponse.redirect("/");
    }
    if (req.cookies.refresh_token || path.includes("/auth")) {
        return NextResponse.next();
    }
    return NextResponse.redirect("/auth/login", 307);
}  
