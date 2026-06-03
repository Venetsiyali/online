/**
 * Shared NextAuth secret — must match the secret used in authOptions.
 * Always use this constant in getToken() calls so the fallback stays in sync.
 */
export const AUTH_SECRET = process.env.NEXTAUTH_SECRET || 'online_academy_secret_2024';
