
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT, type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; // Add role to session user
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string; // Add role to user object
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role?: string; // Add role to JWT
  }
}
