import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { registerWithProvider } from "./api/user.api";

function mapUser(res: any) {
  return {
    ...res.user,
    token:res.token,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // profile(profile) {
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //     provider: "google",
      //   };
      // },
      httpOptions: { timeout: 10000 },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      // profile(profile) {
      //   return {
      //     id: profile.id,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture?.data?.url,
      //     provider: "facebook",
      //   };
      // },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider) {
        try {
          const res: any = await registerWithProvider({
            accessToken: account.access_token || "",
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });
          const mapped = mapUser(res?.data as any);
          Object.assign(user, mapped);

          return true;
        } catch (err) {
          console.error("OAuth provider registration error:", err);
          return false;
        }
      }

      return false;
    },

    async jwt({ token, trigger, session, user }) {
      if(trigger === "update" && session?.user) {
        token.user = session.user;
      }
      if (user) {
        //@ts-ignore
        token.user = user;
      }
      return Promise.resolve(token);
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },

    async redirect({ url, baseUrl }) {
      try {
        const validUrl = new URL(url);
        if (validUrl.origin === baseUrl) return url;
      } catch {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};
