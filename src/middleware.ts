import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get the token from the cookies
  const isAuthenticated = request.cookies.has('session_token');

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/', '/pet', '/register-pet']; 

  // Check if the path is public or starts with /pet/
  const isPublicPath = publicPaths.includes(path) || path.startsWith('/pet/');

  if (path === '/') {
    return NextResponse.next();
  }

  // Don't redirect authenticated users from /login
  // Let AuthContext handle the redirect after login
  
  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If none of the above conditions are met, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};