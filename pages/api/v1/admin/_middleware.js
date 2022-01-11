import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt";
export async function middleware(req, res) {
    if (req.headers.get("authorization")) {
        if (req.headers.get("authorization").split(" ")[1].includes("::")) {
            //is node key
            console.log(req.headers.get("authorization").split(" ")[1].split("::")[1])
            try {
                var allowed = await jwt.verify(req.headers.get("authorization").split(" ")[1].split("::")[1], process.env.ENC_KEY);
            } catch (error){
                console.log(error)
                return NextResponse.redirect("/api/v1/unauthorized");
            }
            console.log(allowed)
            if (!allowed) return NextResponse.redirect("/api/v1/unauthorized");
        } else if (req.headers.get("authorization").split(" ")[1].includes(":")) {
            //is api key
            try {
                var allowed = await jwt.verify(req.headers.get("authorization").split(" ")[1].split(":")[1], process.env.ENC_KEY);
            }
            catch {
                return NextResponse.redirect("/api/v1/unauthorized");
            }
            if (!allowed) return NextResponse.redirect("/api/v1/unauthorized");
        } else {
            try {
                var user_data = await jwt.verify(req.headers.get("authorization").split(" ")[1], process.env.ENC_KEY);
            } catch (error) {
                return NextResponse.redirect("/api/v1/unauthorized");
            }
            if (!user_data) return NextResponse.redirect("/api/v1/unauthorized");
        }
        return NextResponse.next();
    }
}
