import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect /dashboard and its sub-routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const adminAuth = request.cookies.get('admin_auth')
    
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
