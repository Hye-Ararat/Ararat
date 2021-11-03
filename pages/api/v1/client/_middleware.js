import jwt from "jsonwebtoken"
import { NextResponse, NextRequest } from "next/server";
export async function middleware(req, res) {
	if (req.url.includes("/api/v1/client/auth/login")) return NextResponse.next();
    if (req.headers.get("authorization")) {
        try {
            jwt.verify(req.headers.get("authorization").split(" ")[1], process.env.ACCESS_TOKEN_SECRET)
        }
        catch (error) {
            return NextResponse.redirect("/api/v1/unauthorized");
        }
        return NextResponse.next();
    } 
    return NextResponse.redirect("/api/v1/unauthorized");
}
