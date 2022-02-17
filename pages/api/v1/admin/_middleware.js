import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt";
export async function middleware(req, res) {
    if (!req.headers.get("authorization")) return NextResponse.redirect("/api/v1/unauthorized");
    if (!req.headers.get("authorization").split(" ")[1]) return NextResponse.redirect("/api/v1/unauthorized");
    let key;
    if (req.headers.get("authorization").split(" ")[1].includes("::")) key = req.headers.get("authorization").split(" ")[1].split("::")[1];
    if (req.headers.get("authorization").split(" ")[1].includes(":")) key = req.headers.get("authorization").split(" ")[1].split(":")[1];
    if (!key) key = req.headers.get("authorization").split(" ")[1];
    try {
        if (!await jwt.verify(key, process.env.ENC_KEY)) return NextResponse.redirect("/api/v1/unauthorized");
    } catch (error) {
        return NextResponse.redirect("/api/v1/unauthorized");
    }
    return NextResponse.next();
}
