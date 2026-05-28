import { type NextRequest, NextResponse } from 'next/server'

// Demo mode: no authentication required — all routes are public
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
