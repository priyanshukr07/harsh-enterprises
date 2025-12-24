import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

type UserRole = "USER" | "MANAGER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;

    // JWT refresh metadata
    accessTokenExpires: number;
    absoluteExpires: number;
  }
}
