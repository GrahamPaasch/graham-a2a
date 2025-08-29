# Graham Paasch — A2A/MCP Integrations & Agent Orchestration

This monorepo contains:

- apps/web — Next.js site (About, Services, Portfolio, Blog, Contact, For Agents, Status)
- apps/agent — Agent2Agent (A2A) JSON-RPC server with SSE streaming
- packages/shared — Shared A2A types & schemas
- packages/mcp-stub — Minimal MCP-compatible stdio server (resource + tool)

## Setup (local)

- Install Node 20+ and pnpm 9.
- Copy .env.example to .env and set NEXT_PUBLIC_BASE_URL and NEXT_PUBLIC_AGENT_URL.
- Install deps and run:

```bash
pnpm install
pnpm dev
```

## A2A JSON-RPC methods

- message/send
- tasks/get
- tasks/cancel
- agent/getAuthenticatedExtendedCard

### Curl examples

- Send message (start streaming task):

```bash
curl -sS http://localhost:8787/rpc \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"recipient":"demo","text":"Hello","stream":true}}'
```

- Follow stream (SSE):

```bash
curl -N http://localhost:8787/rpc/stream?taskId=<TASK_ID>
```

- Get task events:

```bash
curl -sS http://localhost:8787/rpc -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tasks/get","params":{"taskId":"<TASK_ID>"}}'
```

- Cancel task:

```bash
curl -sS http://localhost:8787/rpc -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tasks/cancel","params":{"taskId":"<TASK_ID>"}}'
```

- Authenticated card:

```bash
curl -sS http://localhost:8787/rpc -H 'authorization: Bearer TEST' -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":4,"method":"agent/getAuthenticatedExtendedCard"}'
```

### Streaming demo (multi-turn)

1) Send message, note taskId.
2) Open SSE stream and observe queued, running, artifact, completed.
3) Call tasks/get to fetch all events.

## Web app

- Agent Card: /.well-known/agent-card.json
- Pages: Home, Services, For Agents, Portfolio, Blog, Contact, Status
- SEO: sitemap.xml, robots.txt, Open Graph/Twitter, JSON-LD (add your socials in metadata)
- Analytics: Plausible (set PLAUSIBLE_DOMAIN)

## Deployment

- Web (Vercel): link repo, set env NEXT_PUBLIC_BASE_URL and NEXT_PUBLIC_AGENT_URL.
- Agent (Fly.io):
  - `fly launch --no-deploy` then `fly deploy` (fly.toml included).
- Agent (Cloud Run): build container from apps/agent/Dockerfile and deploy; set env and min instances.

## Security

- Headers: HSTS, CSP (nonce-ready via middleware), X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
- Rate limiting and CORS on agent.
- .env.example provided. Rotate tokens by updating downstream secrets and redeploying. Documented in Spec Mapping.

## Spec Mapping (excerpt)

- Agent Card discovery: /.well-known/agent-card.json
- Transport: JSON-RPC 2.0 over HTTP(S); SSE for streaming
- Methods: message/send, tasks/get, tasks/cancel, agent/getAuthenticatedExtendedCard
- Task persistence: in-memory for demo; replace with durable store in prod
- MCP interop: packages/mcp-stub provides resource+tool

## Validate cards

- Fetch public card and validate required fields against packages/shared types.

## CI

- GitHub Actions: lint, typecheck, build, test

## Acceptance criteria

- [x] Monorepo with apps/web, apps/agent, packages/shared, packages/mcp-stub
- [x] Agent Card at /.well-known/agent-card.json
- [x] A2A server with JSON-RPC + SSE; methods implemented; in-repo test
- [x] Example skills included
- [x] Docs with curl examples and streaming demo
- [x] Deployment snippets (Vercel + Fly/Cloud Run)
- [x] SEO/A11y/Security headers baseline
- [x] CI workflow