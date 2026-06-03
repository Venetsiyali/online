import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!pathname.startsWith('/admin/login')) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || 'online_academy_secret_2024',
      });
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }
    return NextResponse.next();
  }

  // Skip i18n for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|favicon.ico|.*\\..*).*)'],
};
