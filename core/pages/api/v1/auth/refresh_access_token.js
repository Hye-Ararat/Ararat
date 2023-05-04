import { errorResponse } from "../../../../lib/responses";

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "POST":
            //refresh token inside of body
            const refreshToken = req.body.refresh_token;
            if (!refreshToken) return res.status(401).send(errorResponse("No refresh token provided", 401));
            const tokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (!tokenData) return res.status(403).send(errorResponse("Invalid refresh token", 403));
            const user = await prisma.user.findUnique({
                where: {
                    id: tokenData.id
                }
            });
            if (!user) return res.status(403).send(errorResponse("Invalid refresh token", 403));
            const accessToken = jwt.sign({ id: user.id }, process.env.ENC_KEY, { expiresIn: "7d" });

            return res.status(200).send({
                access_token: accessToken,
            });

        default:
            res.status(405).json({ message: "Method not allowed" });
    }
}