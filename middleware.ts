import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth temporarily disabled for testing — re-enable before handoff
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
