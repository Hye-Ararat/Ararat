import { NextResponse } from "next/server";
export async function middleware(req, res) {
	if (req.url.includes("/api/v1/client/auth/login")) return NextResponse.next();
    if (req.headers.get("authorization")) return NextResponse.next();
    return NextResponse.redirect("/api/v1/unauthorized");
}
