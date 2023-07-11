const jwsClient = require("jwks-rsa")
const jwt = require("jsonwebtoken")

async function validateSession(access_token, url) {
    return new Promise((resolve, reject) => {
        var jws = jwsClient({
            jwksUri: `http://${url}/oidc/jwks`
        })

        jwt.verify(access_token, function getKey(header, callback) {
            jws.getSigningKey(header.kid, function (err, key) {
                if (!key) {
                    resolve(false)
                } else {
                    var signingKey = key.getPublicKey()
                    callback(null, signingKey);
                }
            });
        }, { algorithms: ["RS256"] }, (err, decoded) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
module.exports = {
    validateSession
}