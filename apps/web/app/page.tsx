import { track } from '../lib/analytics';

export default function HomePage() {
  return (
    <main id="content" className="container">
      <h1>Agent-to-Agent (A2A) & MCP integrations</h1>
      <p>
        I help teams ship pragmatic agent systems: wiring A2A transports, MCP tools, and
        reliable orchestration that passes the demo and survives production.
      </p>
      <div className="cta">
  <a className="button" href="/contact" onClick={() => track('cta_click', { cta: 'intro_call' })}>Book intro call</a>
  <a className="button secondary" href="/services" onClick={() => track('cta_click', { cta: 'hire_pilot' })}>Hire for a pilot</a>
      </div>
    </main>
  );
}
