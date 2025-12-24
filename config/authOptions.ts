import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/db.config";

/* =====================================================
   Token Lifetimes (seconds)
===================================================== */
const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes
const ABSOLUTE_SESSION_LIFETIME = 2 * 60 * 60; // 2 hours

/* =====================================================
   Validators
===================================================== */
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string): boolean =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[@#$%^&*(),.?":{}|<>]/.test(password);

/* =====================================================
   Auth Options
===================================================== */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (!isValidEmail(credentials.email)) {
          throw new Error("Invalid email format");
        }

        if (!isValidPassword(credentials.password)) {
          throw new Error("Invalid password format");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordValid) {
          throw new Error("Invalid credentials");
        }

        // Returned object becomes `user` in jwt callback
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  /* =====================================================
     JWT + Refresh Logic
  ===================================================== */
  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);

      /* ---------- Initial Login ---------- */
      if (user) {
        token.id = user.id;
        token.role = user.role;

        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
        token.absoluteExpires = now + ABSOLUTE_SESSION_LIFETIME;

        return token;
      }

      /* ---------- Absolute session expired ---------- */
      if (token.absoluteExpires && now > token.absoluteExpires) {
        throw new Error("Session expired");
      }

      /* ---------- Access token still valid ---------- */
      if (token.accessTokenExpires && now < token.accessTokenExpires) {
        return token;
      }

      /* ---------- Refresh access token ---------- */
      token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },

  /* =====================================================
     Session & Security
  ===================================================== */
  session: {
    strategy: "jwt",
    maxAge: ABSOLUTE_SESSION_LIFETIME,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};

/* =====================================================
   Export Handler (App Router)
===================================================== */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };