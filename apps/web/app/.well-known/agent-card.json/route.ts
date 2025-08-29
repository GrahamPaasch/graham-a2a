import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const publicBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const agentBase = process.env.NEXT_PUBLIC_AGENT_URL?.replace(/\/rpc$/, '') || 'http://localhost:8787';
  const body = {
    protocolVersion: '1.0',
    identity: {
      name: 'Graham Paasch',
      provider: 'grahampaasch.com',
      url: publicBase
    },
    capabilities: { streaming: true },
    interfaces: { jsonrpc: { endpoint: `${agentBase}/rpc` } },
    skills: [
      { id: 'job-lead-triage', title: 'Job‑lead triage & outreach draft', description: 'Ingest job leads and draft tailored outreach messages', inputs: { leadUrl: { type: 'string', required: true }, context: { type: 'string' } }, outputs: { draft: { type: 'string' } } },
      { id: 'meetup-aggregator', title: 'Meetup aggregator & calendar export', description: 'Aggregate meetups and export .ics calendar', inputs: { locations: { type: 'string' }, topics: { type: 'string' } }, outputs: { icsUrl: { type: 'string' } } },
      { id: 'research-brief', title: 'Research brief generator', description: 'Generate concise research briefs with sources', inputs: { query: { type: 'string', required: true } }, outputs: { brief: { type: 'string' } } },
      { id: 'portfolio-helper', title: 'Portfolio build helper', description: 'Bootstrap case notes and assets for portfolio entries', inputs: { repo: { type: 'string' } }, outputs: { checklist: { type: 'string' } } }
    ],
    securitySchemes: {
      openIdConnect: {
        issuer: 'https://accounts.example.com',
        authorizationEndpoint: 'https://accounts.example.com/authorize',
        tokenEndpoint: 'https://accounts.example.com/token',
        scopes: ['openid', 'profile', 'email']
      }
    }
  };
  return NextResponse.json(body);
}
