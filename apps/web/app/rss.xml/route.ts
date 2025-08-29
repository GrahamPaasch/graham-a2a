import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const items = [
    {
      title: 'Shipping A2A pilots that actually stick',
      link: `${base}/blog`,
      description: 'Notes on picking the first workflow and instrumenting success.'
    }
  ];
  const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>Graham Paasch</title><link>${base}</link><description>Blog feed</description>${items
    .map((i) => `<item><title>${i.title}</title><link>${i.link}</link><description>${i.description}</description></item>`)
    .join('')}</channel></rss>`;
  return new NextResponse(rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
