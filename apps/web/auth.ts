import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authResult = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      // authorize: async (credentials) => {
      //   const user = null

      //   const { email, password } = await signInSchema.parseAsync(credentials)

      //   // logic to salt and hash password
      //   // const pwHash = saltAndHashPassword(credentials.password)

      //   // logic to verify if the user exists
      //   // user = await getUserFromDb(credentials.email, pwHash)

      //   if (!user) {
      //     // No user found, so this is their first attempt to login
      //     // Optionally, this is also the place you could do a user registration
      //     throw new Error("Invalid credentials.")
      //   }

      //   // return user object with their profile data
      //   return user
      // },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // const dbUser = await db.user.findUnique({
        //   where: { email: user.email! },
        // });
        // token.role = dbUser?.role ?? "USER"; // fallback
      }
      return token;
    },

    async session({ session }) {
      if (session.user) {
        // session.user.role = token.role; // Pass role to session
      }
      return session;
    },
  },
});

export const handlers = authResult.handlers;
export const signIn: typeof authResult.signIn = authResult.signIn;
export const signOut = authResult.signOut;
export const auth: typeof authResult.auth = authResult.auth;
