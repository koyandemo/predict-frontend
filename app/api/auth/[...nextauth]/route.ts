import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"

import {
  getUserByEmail,
  loginUser,
  registerUser,
} from "@/api/auth.api"


const mapOAuthProfile = (user: any, profile: any, provider: string) => ({
  name: user.name,
  email: user.email,
  provider,
  type: "user",
  avatar_url: profile?.picture || profile?.image,
})

const handleOAuthRegister = async (
  user: any,
  account: any,
  profile: any
) => {
  try {
    const payload = mapOAuthProfile(user, profile, account.provider)
    const res = await registerUser(payload as any)

    if (res?.success && res?.user && res?.token) {
      return {
        userId: res.user.user_id.toString(),
        userType: res.user.type,
        apiToken: res.token,
      }
    }
  } catch (error) {
    console.error("OAuth Register Error:", error)
  }

  return null
}

const enrichTokenWithUserData = async (token: any) => {
  if (!token?.email) return token

  try {
    const user = await getUserByEmail(token.email)

    if (user) {
      return {
        ...token,
        userId: user.user_id.toString(),
        userType: user.type,
        avatar_url: user.avatar_url,
        favorite_team_id: user.favorite_team_id,
        avatar_bg_color: user.avatar_bg_color,
      }
    }
  } catch (error) {
    console.error("Fetch User Error:", error)
  }

  return token
}

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        provider: "google",
      }
    },
  }),

  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture?.data?.url,
        provider: "facebook",
      }
    },
  }),

  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      try {
        const res = await loginUser(credentials.email, credentials.password)

        if (res?.success && res?.user && res?.token) {
          return {
            id: res.user.user_id.toString(),
            name: res.user.name,
            email: res.user.email,
            provider: "email",
            type: res.user.type,
            apiToken: res.token,
          }
        }
      } catch (error) {
        console.error("Login Error:", error)
      }

      return null
    },
  }),
]

const callbacks: NextAuthOptions["callbacks"] = {
  async signIn({ user, account }) {
    if (account?.provider === "credentials") {
      return !!user
    }
    return true
  },

  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`
    if (new URL(url).origin === baseUrl) return url
    return baseUrl
  },

  async jwt({ token, user, account, profile }:any) {
    // 🔹 First login
    if (account && user) {
      if (account.provider === "credentials") {
        token.userId = user.id
        token.userType = user.type || "user"
        token.apiToken = user.apiToken
      } else {
        const result = await handleOAuthRegister(user, account, profile)

        if (result) {
          token.userId = result.userId
          token.userType = result.userType
          token.apiToken = result.apiToken
        }
      }
    }

    // 🔹 Ensure token has DB data
    if (!token.userId) {
      token = await enrichTokenWithUserData(token)
    }

    // 🔹 Always refresh user data
    token = await enrichTokenWithUserData(token)

    return token
  },

  async session({ session, token }:{session: any, token: any}) {
    let userData = null

    try {
      userData = await getUserByEmail(session.user?.email as string)
    } catch (error) {
      console.error("Session Fetch Error:", error)
    }

    const source = userData || token

    session.user = {
      ...session.user,
      id: token.userId as string,
      type: token.userType as string,
      avatar_url: source?.avatar_url,
      favorite_team_id: source?.favorite_team_id,
      avatar_bg_color: source?.avatar_bg_color,
      apiToken: token.apiToken,
    }

    return session
  },
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks,

  pages: {
    signIn: "/login",
  },

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }