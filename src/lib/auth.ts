import { NextAuthOptions, DefaultSession } from "next-auth"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import { compare } from "bcryptjs"

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string | null
      email: string | null
    } & DefaultSession["user"]
  }
}

// Ensure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set in environment variables");
}

export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter for now as we're using a custom Users model
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Auth attempt with credentials:", JSON.stringify({
          email: credentials?.email,
          hasPassword: !!credentials?.password
        }));

        if (!credentials?.password) {
          console.log("Missing password");
          return null;
        }

        // Get the identifier (email or username)
        const identifier = credentials.email;
        
        if (!identifier) {
          console.log("Missing identifier (email or username)");
          return null;
        }

        // Check if input is an email or username
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        console.log(`Identifier type: ${isEmail ? 'email' : 'username'}`);
        
        let user;
        try {
          if (isEmail) {
            // Find user by email
            user = await db.users.findUnique({
              where: { email: identifier }
            });
            console.log(`User lookup by email: ${user ? 'found' : 'not found'}`);
          } else {
            // Find user by username
            user = await db.users.findUnique({
              where: { username: identifier }
            });
            console.log(`User lookup by username: ${user ? 'found' : 'not found'}`);
          }
        } catch (error) {
          console.error("Database error during user lookup:", error);
          return null;
        }

        if (!user) {
          console.log("User not found");
          return null;
        }

        try {
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );
          
          console.log(`Password validation: ${isPasswordValid ? 'success' : 'failed'}`);

          if (!isPasswordValid) {
            return null;
          }
        } catch (error) {
          console.error("Password comparison error:", error);
          return null;
        }

        console.log("Authentication successful");
        return {
          id: String(user.id),
          email: user.email,
          name: user.username || null
        };
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name || null;
        session.user.email = token.email || null;
      }

      return session;
    },
    async jwt({ token, user }) {
      try {
        // If we have user data from the authorize callback, use it
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email
          };
        }

        // Otherwise, try to find the user in the database
        if (token.email) {
          const dbUser = await db.users.findFirst({
            where: {
              email: token.email
            }
          });

          if (dbUser) {
            console.log("JWT callback: User found in database");
            return {
              id: String(dbUser.id),
              name: dbUser.username || null,
              email: dbUser.email
            };
          }
        }

        console.log("JWT callback: Using existing token");
        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return token;
      }
    }
  }
} 