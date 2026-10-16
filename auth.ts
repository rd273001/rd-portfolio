import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { isAllowlisted } from "@/lib/auth/allowlist";
import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/auth/limits";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowlisted(user.email);
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const allowed = isAllowlisted(auth?.user?.email);

      if (pathname === "/admin/login") {
        if (allowed) {
          return Response.redirect(new URL("/admin/feedback", request.nextUrl));
        }

        return true;
      }

      if (pathname.startsWith("/admin")) {
        return allowed;
      }

      return true;
    },
  },
});