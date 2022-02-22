import jwt from "@tsndr/cloudflare-worker-jwt";

export async function middleware(req) {
    if (!req.headers.get("authorization")) return new Response("Unauthorized", { status: 401 });
    if (!req.headers.get("authorization").split(" ")[1]) return new Response("Unauthorized", { status: 401 });
    let key;
    if (req.headers.get("authorization").split(" ")[1].includes("::") && !key) key = req.headers.get("authorization").split(" ")[1].split("::")[1];
    if (req.headers.get("authorization").split(" ")[1].includes(":") && !key) key = req.headers.get("authorization").split(" ")[1].split(":")[1];
    if (!key) key = req.headers.get("authorization").split(" ")[1];
    try {
        if (!await jwt.verify(key, process.env.ENC_KEY)) return new Response("Unauthorized", { status: 401 });
    } catch (error) {
        return new Response("Unauthorized", { status: 401 });
    }
}
