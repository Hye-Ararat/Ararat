import jwt from "@tsndr/cloudflare-worker-jwt";
import { NextResponse } from "next/server";
export async function middleware(req, res) {
	if (req.nextUrl.pathname.includes("/api/v1/client/auth")) return NextResponse.next();
	if (req.nextUrl.searchParams.get("authorization")) req.headers["authorization"] = "Bearer " + req.nextUrl.searchParams.get("authorization");
	let key;
	if (req.headers.get("authorization").split(" ")[1].includes(":::")) key = req.headers.get("authorization").split(" ")[1].split(":::")[1];
	if (req.headers.get("authorization").split(" ")[1].includes(":") && !key) key = req.headers.get("authorization").split(" ")[1].split(":")[1];
	if (!key) key = req.headers.get("authorization").split(" ")[1];
	try {
		if (!await jwt.verify(key, process.env.ENC_KEY)) return new Response("Unauthorized", { status: 401 });
	} catch (error) {
		return new Response("Unauthorized", { status: 401 });
	}
}
