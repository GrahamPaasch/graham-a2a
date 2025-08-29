export const metadata = { title: 'For Agents' };
export default function ForAgents() {
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const agentEndpoint = process.env.NEXT_PUBLIC_AGENT_URL || 'http://localhost:8787/rpc';
  return (
    <main className="container">
      <h1>For Agents</h1>
      <p>Agent Card: <code>{domain}/.well-known/agent-card.json</code></p>
      <p>JSON‑RPC endpoint: <code>{agentEndpoint}</code></p>
      <p>Rate limit: 60 req/min IP (burst 60). Use backoff and retry on 429.</p>

      <h2>A2A methods</h2>
      <pre>
{`POST ${agentEndpoint}
{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"recipient":"demo","text":"Hello","stream":true}}`}
      </pre>
      <p>Stream events:</p>
      <pre>
{`GET ${agentEndpoint.replace(/\/rpc$/, '')}/rpc/stream?taskId=<TASK_ID>`}
      </pre>

      <h2>MCP interop</h2>
      <p>Install stub: <code>pnpm -w --filter @graham/mcp-stub build</code> then run <code>node packages/mcp-stub/dist/index.js</code></p>
      <p>Tools: echo; Resources: mcp://about</p>
    </main>
  );
}
