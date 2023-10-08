import { usePrisma } from "@/app/_lib/prisma";
import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
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
      const prisma = usePrisma();

      let dbUser = await prisma.user.findUnique({
        where: {
          email: profile.email ?? user.email,
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
        dbUser = await prisma.user.create({
          data: {
            id: account.providerAccountId.toString(),
            email: user.email ?? user.email,
            name: user.name,
            authProvider: account.provider,
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
      name: "Xentain",
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
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
