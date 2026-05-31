// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-newlera-key-1234567890-change-this-in-production'
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('nwl_auth_token')?.value;

  // Paths that require authentication
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isDashboardPath || isAdminPath) {
    if (!token) {
      // Not logged in, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // If accessing admin, require ADMIN role
      if (isAdminPath && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Valid token, proceed
      return NextResponse.next();
    } catch (error) {
      // Invalid token, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('nwl_auth_token');
      return response;
    }
  }

  if (isAuthPath && token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // Already logged in, redirect to appropriate dashboard
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Token invalid, allow accessing auth path
      const response = NextResponse.next();
      response.cookies.delete('nwl_auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

// Config to specify which paths proxy should run on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
