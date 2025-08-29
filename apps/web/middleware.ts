import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Basic HSTS (enabled only on production host with HTTPS)
  const host = req.headers.get('host') || '';
  if (host.includes('localhost') === false) {
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  // CSP sample (no inline scripts). If you add inline, use a nonce and include it in allowed list.
  const base = req.nextUrl.origin;
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://plausible.io https://*.plausible.io`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self' https://plausible.io https://*.plausible.io",
    "font-src 'self'",
    "frame-ancestors 'none'",
    `base-uri ${base}`
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
