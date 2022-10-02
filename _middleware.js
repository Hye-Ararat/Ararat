import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt"
import prisma from "./lib/prisma";

export async function middleware(req) {
    const path = req.nextUrl.pathname;
    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.refresh_token && path.includes("/auth")) return NextResponse.redirect(new URL("/", req.url));
    if (req.cookies.refresh_token || path.includes("/auth") || path.includes("lxd-a")) return NextResponse.next();
    //check for access token cookie
    if (!req.cookies.access_token) {
        if (req.cookies.refresh_token) {
            const refreshToken = req.cookies.refresh_token;
            const tokenData = jwt.verify(refreshToken, process.env.ENC_KEY);
            if (!tokenData) {
                return NextResponse.redirect("/login");
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: tokenData.id
                },
                include: {
                    permissions: true
                }
            });
            if (!user) {
                //delete refresh token cookie
                return NextResponse.redirect("/login");
            }
            const accessToken = jwt.sign({ id: user.id }, process.env.ENC_KEY, { expiresIn: "7d" });
            //set cookie
            let url = req.nextUrl;
            return NextResponse.redirect(url).cookies.set("access_token", accessToken);
        }
    }
    return NextResponse.redirect(new URL("/auth/login", req.url), 307);
}  
