import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const urls = ['', '/services', '/for-agents', '/portfolio', '/blog', '/contact'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((u) => `\n  <url><loc>${base}${u}</loc></url>`)
    .join('')}\n</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
