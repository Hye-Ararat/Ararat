export default async function handler(req, res) {
    res.status(303).setHeader("Location", `/authentication/authorize?interaction=${req.query.uid}`).send("One Moment...")
}