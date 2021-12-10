export default async function handler(req, res) {
    var {query: {access_token, route}} = req
    res.setHeader('Set-Cookie', `access_token=${access_token}; Max-Age=${15 * 60}; path=/;`)
    console.log(route)
    return res.redirect(route ? route : "/")
}