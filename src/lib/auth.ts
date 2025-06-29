import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name ?? "",
                password: null,
              },
            });
            // Update the user object with the database ID
            user.id = newUser.id;
          } else {
            // Update the user object with the existing database ID
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // On sign-in, add user.id to the token
      if (user) {
        token.id = user.id;
      }
      
      // If token.id is not set, fetch it from the database using the email
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({ 
            where: { email: token.email } 
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; 
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
});