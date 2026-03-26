import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const validUsername =
          credentials.username === process.env.ADMIN_USERNAME;
        const validPassword = await bcrypt.compare(
          credentials.password as string,
          process.env.ADMIN_PASSWORD_HASH!,
        );

        if (validUsername && validPassword) {
          return { id: "admin", name: credentials.username as string };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h safety net for JWT expiry
  },
  pages: {
    signIn: "/admin/login",
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // No maxAge = session cookie (expires when browser closes)
      },
    },
  },
});
