import prisma from "@/app/_lib/prisma";
import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt"
/**
 * @type {import("next-auth").AuthOptions}
 */
export const authOptions = {
  secret: process.env.APP_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log({ user, profile, account })
      let dbUser = await prisma.user.findUnique({
        where: {
          email: profile?.email ? profile.email : user.email,
        },
      });
      if (!dbUser) {
        dbUser = await prisma.user.findUnique({
          where: {
            id: account.providerAccountId.toString(),
            authProvider: account.provider,
          },
        });
      }
      if (!dbUser) {
        var org = await prisma.organization.findFirst({
          where: {
            name: "default",
          },
        });
        dbUser = await prisma.user.create({
          data: {
            id: account.providerAccountId.toString(),
            email: profile?.email ? profile.email : user.email,
            name: user.name,
            authProvider: account.provider,
            organization: {
              connect: {
                id: org.id,
              },
            },
          },
        });
      }
      return true;
    },
    async session({ session, user, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user,user:email",
        },
      },
    }),
    {
      id: "whmcs",
      name: "WHMCS",
      type: "oauth",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      token: {
        async request(ctx) {
          const s = await axios.postForm(
            "https://billing.xentain.com/oauth/token.php",
            {
              code: ctx.params.code,
              client_id: process.env.WHMCS_ID,
              client_secret: process.env.WHMCS_SECRET,
              redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/whmcs`,
              grant_type: "authorization_code",
            }
          );
          return { tokens: s.data };
        },
      },
      idToken: true,
      clientId: process.env.WHMCS_ID,
      clientSecret: process.env.WHMCS_SECRET,
      wellKnown: "https://billing.xentain.com/oauth/openid-configuration.php",
      async profile(profile, tokens) {
        const s = await axios.get(
          "https://billing.xentain.com/oauth/userinfo.php?access_token=" +
          tokens.access_token
        );
        return { ...s.data, id: s.data.sub };
      },
    },
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "User/Pass",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log(credentials)
        if (!credentials.email || !credentials.password) return null;
        console.log(credentials)
        var prismuser = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            authProvider: "basic"
          }
        })
        console.log(prismuser)
        if (!prismuser) return null;
        var authorized = await bcrypt.compare(credentials.password, prismuser.password)
        console.log(authorized)
        if (!authorized) {
          return null;
        }
        return prismuser;
      }
    })
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
