import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import { compare } from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const client = await clientPromise;
        const users = client.db().collection('users');
        const user = await users.findOne({ email: credentials.email });
        if (user && user.hashedPassword) {
          const isValid = await compare(credentials.password, user.hashedPassword);
          if (isValid) {
            return { id: user._id.toString(), email: user.email, username: user.username };
          }
        }
        return null;
      },
    }),
  ],
  session: { 
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: JWT; user: any; trigger?: string; session?: any }) {
      if (user) {
        token.username = user.username;
        token.id = user.id;
      }
      
      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.username = token.username;
        session.user.id = token.id;
        session.error = token.error;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }: { token: JWT }) {
      // Clean up any session-related data if needed
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Handle session events
    },
  },
};

export default NextAuth(authOptions); 