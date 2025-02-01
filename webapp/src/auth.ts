import NextAuth from "next-auth";
import LINE from "next-auth/providers/line";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LINE({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      checks: ["state"],
    }),
  ],
});
