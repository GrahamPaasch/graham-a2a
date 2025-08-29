import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Graham Paasch — A2A/MCP Integrations & Agent Orchestration',
    template: '%s · Graham Paasch'
  },
  description: 'Consulting and implementation for Agent-to-Agent (A2A) and Model Context Protocol (MCP) integrations.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Graham Paasch — A2A/MCP Integrations',
    description: 'Consulting and implementation for A2A & MCP integrations.',
    url: '/',
    type: 'website'
  },
  twitter: { card: 'summary_large_image', creator: '@grahampaasch' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Structured Data: Person, Organization, WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  name: 'Graham Paasch',
                  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
                  sameAs: [
                    'https://github.com/GrahamPaasch',
                    'https://www.linkedin.com/in/grahampaasch'
                  ]
                },
                {
                  '@type': 'Organization',
                  name: 'Graham Paasch Consulting',
                  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                },
                {
                  '@type': 'WebSite',
                  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                  }
                }
              ]
            })
          }}
        />
        <a href="#content" className="skip">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
