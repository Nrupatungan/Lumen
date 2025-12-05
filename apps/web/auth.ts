import NextAuth, { Account } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import api from "./lib/apiClient";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

const authResult = NextAuth({
  providers: [
    Github,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        try {
          const res = await api.post("/auth/login", { email, password });
          return res.data.user ?? null;
        } catch (err) {
          console.error("Credentials authorize error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    encode: async ({ token }) => {
      return jwt.sign(token!, process.env.AUTH_SECRET!, {
        algorithm: "HS256",
      });
    },

    decode: async ({ token }) => {
      try {
        return jwt.verify(token!, process.env.AUTH_SECRET!, {
          algorithms: ["HS256"],
        }) as JWT;
      } catch {
        return null;
      }
    },
  },

  callbacks: {
    /**
     * OAuth callback — merges OAuth provider → backend → user
     */
    async signIn({ account, profile }) {
      // Only run for OAuth, skip credentials
      if (account?.provider === "credentials") return true;

      try {
        const res = await api.post("/auth/oauth-login", {
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
          email: profile?.email,
          name: profile?.name,
          image: profile?.picture,
        });

        // Put user info into token via `jwt()` callback
        (account as Account).backendUser = res.data.user;

        return true;
      } catch (err) {
        console.error("OAuth login error:", err);
        return false;
      }
    },

    /**
     * Merges OAuth backend user OR credentials user into token
     */
    async jwt({ token, user, account }) {
      // Credentials user
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      // OAuth user returned from backend
      if (account?.backendUser) {
        const u = account.backendUser;
        token.id = u.id;
        token.email = u.email;
        token.name = u.name;
        token.role = u.role;
        token.picture = u.image;
      }

      return token;
    },

    /**
     * Expose token → session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
});

export const auth: typeof authResult.auth = authResult.auth;
export const handlers = authResult.handlers;
export const signIn: typeof authResult.signIn = authResult.signIn;
export const signOut = authResult.signOut;
