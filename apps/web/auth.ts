import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./lib/apiClient";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

const authResult = NextAuth({
  providers: [
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

          const res = await api.post("/auth/login", {email, password});

          if (!res) return null;

          const user = res.data.user;

          return user;
        } catch (err) {
          console.error("Authorize Error:", err);
          return null;
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },
  jwt: {
    encode: async({token}) => {
      return jwt.sign(token!, process.env.AUTH_SECRET!, {
        algorithm: "HS256",
      })
    },

    decode: async ({ token }) => {
      try {
        return jwt.verify(token!, process.env.AUTH_SECRET!, {
          algorithms: ["HS256"]
        }) as JWT;
      } catch {
        return null;
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.role = token.role;
        }
        return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});

export const auth: typeof authResult.auth = authResult.auth;
export const handlers = authResult.handlers;
export const signIn: typeof authResult.signIn = authResult.signIn;
export const signOut = authResult.signOut;