
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Disabling NextAuth middleware as we switched to client-side auth based on reference
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
