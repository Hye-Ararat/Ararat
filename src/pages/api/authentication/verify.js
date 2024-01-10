import { validateSession } from "@/lib/oidc";



export default async function handler(req, res) {
    console.log(req.headers)
    let valid = await validateSession(req.headers["authorization"])
    if (valid) {

        res.status(200).json({
            "status": "valid",
        })
    } else {
        res.status(401).json({ "status": "invalid" })
    }
}