import { NextResponse } from "next/server";
// ik how let me how can i get the full url
export async function middleware(req) {
    var url = new URL(req.url)
    var path = url.pathname
    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.access_token && path == "/auth/login") {
        return NextResponse.redirect("/");
    }
    if (req.cookies.access_token || path == "/auth/login") {
        return NextResponse.next();
    }
    return NextResponse.redirect("/auth/login", 307);
}  