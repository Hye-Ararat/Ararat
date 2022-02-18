import { NextResponse } from "next/server";

export async function middleware(req) {
    const path = req.nextUrl.pathname;
    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.refresh_token && path.includes("/auth")) return NextResponse.redirect(new URL("/", req.url));
    if (req.cookies.refresh_token || path.includes("/auth")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", req.url), 307);
}  
