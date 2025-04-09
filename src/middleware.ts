import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.startsWith('/api/webhook')
  ) {
    return NextResponse.next()
  }
  // If the user is not logged in and tries to access any page other than /login or /api/auth
  if (!token && pathname !== '/login' && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If the user is logged in and tries to access the /login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next()
}

// Define which paths this middleware should run for
export const config = {
  matcher: ['/:path*', '/login'], // Apply to all paths and the /login route
}
