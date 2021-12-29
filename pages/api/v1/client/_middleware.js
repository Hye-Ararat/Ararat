import jwt from "@tsndr/cloudflare-worker-jwt";
import { NextResponse } from "next/server";
export async function middleware(req) {
	if (
		req.url.includes("/api/v1/client/auth")
	)
		return NextResponse.next();
	if (req.headers.get("authorization")) {
		if (req.headers.get("authorization").split(" ")[1].includes(":")) {
			//Is API Key
		} else if (req.headers.get("authorization").split(" ")[1].includes("::")) {
			//Is Node API Key
		} else {
			try {
				var user_data = await jwt.verify(
					req.headers.get("authorization").split(" ")[1],
					process.env.ENC_KEY
				);
			} catch (error) {
				return NextResponse.redirect("/api/v1/unauthorized");
			}
			if (!user_data) return NextResponse.redirect("/api/v1/unauthorized");
		}
		return NextResponse.next();
	}
	return NextResponse.redirect("/api/v1/unauthorized");
}
