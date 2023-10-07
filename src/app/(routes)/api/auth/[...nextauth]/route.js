import axios from "axios"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
/**
 * @type {import("next-auth").AuthOptions}
 */
export const authOptions = {
    secret: process.env.APP_SECRET,
    pages: {
        "signIn": "/auth/login"
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        {
            id: "whmcs",
            name: "Xentain",
            type: "oauth",
            authorization: {
                params: {
                    scope: "openid email profile"
                }
            },
            token: {
                async request(ctx) {
                    console.log({
                        code: ctx.params.code,
                        client_id: process.env.WHMCS_ID,
                        client_secret: process.env.WHMCS_SECRET,
                        redirect_uri: "http://localhost:3000/api/auth/callback/whmcs",
                        grant_type: "authorization_code"
                    })
                    const s = await axios.postForm("https://billing.xentain.com/oauth/token.php", {
                        code: ctx.params.code,
                        client_id: process.env.WHMCS_ID,
                        client_secret: process.env.WHMCS_SECRET,
                        redirect_uri: "http://localhost:3000/api/auth/callback/whmcs",
                        grant_type: "authorization_code"
                    })
                    console.log({
                        data: s.data,
                        head: s.headers
                    })
                    return { "tokens": s.data}
                }
            },
            idToken: true,
            clientId: process.env.WHMCS_ID,
            clientSecret: process.env.WHMCS_SECRET,
            wellKnown: "https://billing.xentain.com/oauth/openid-configuration.php",
            async profile(profile, tokens) {
                
                const s = await axios.get("https://billing.xentain.com/oauth/userinfo.php?access_token=" + tokens.access_token)
                return {...s.data, id: s.data.sub};
            }
        }
    ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }