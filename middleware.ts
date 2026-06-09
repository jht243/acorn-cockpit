import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth check disabled for local dev
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
