import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getDb } from './db';
import { AUTH_SECRET } from './auth-secret';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlineacademy.uz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin2024!';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Admin check (no DB needed)
        if (
          credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return { id: 'admin', email: ADMIN_EMAIL, name: 'Admin', role: 'admin' };
        }

        // Regular user — check Neon DB
        try {
          const sql = getDb();
          const rows = await sql`
            SELECT id, email, full_name, password_hash
            FROM users
            WHERE LOWER(email) = LOWER(${credentials.email})
            LIMIT 1
          `;
          if (rows.length === 0) return null;

          const user = rows[0];
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password_hash as string
          );
          if (!isValid) return null;

          return {
            id: user.id as string,
            email: user.email as string,
            name: user.full_name as string,
            role: 'user',
          };
        } catch (err) {
          console.error('[auth] DB error:', err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // next-intl middleware redirects /login → /uz/login automatically
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'user';
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
