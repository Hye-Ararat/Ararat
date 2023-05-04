import jwt from 'jsonwebtoken';
export default function handler(req, res) {
    const isTokenValid = jwt.verify(req.headers["authorization"].split(" ")[1], process.env.ENC_KEY);
    if (isTokenValid) {
        res.status(200).json({ message: "success" })
    } else {
        res.status(403).json({ message: "Not authorized" })
    }
}