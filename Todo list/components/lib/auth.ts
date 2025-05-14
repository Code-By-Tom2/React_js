import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/ngo/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const ngo = await db.ngo.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            organizationName: true,
          },
        });

        if (!ngo) {
          throw new Error("NGO not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          ngo.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: ngo.id,
          email: ngo.email,
          name: ngo.organizationName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }

      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
}; 