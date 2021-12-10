export default async function handler(req, res) {
    res.setHeader('Set-Cookie', `refresh_token=; Path=/; Expires=${new Date(0).toUTCString()}`);
    return res.redirect("/auth/login")
}