export const metadata = { title: 'Services' };
export default function Services() {
  return (
    <main className="container">
      <h1>Services</h1>
      <h2>Discovery → Pilot → Rollout</h2>
      <ul>
        <li><strong>Discovery (1–2 weeks):</strong> A2A/MCP architecture, ROI framing, risk + controls.</li>
        <li><strong>Pilot (2–4 weeks):</strong> Stand up minimal A2A transport + 1–2 MCP tools. Ship a real workflow.</li>
        <li><strong>Rollout (4–8 weeks):</strong> Harden, observability, rate limits, keys/rotation, and team enablement.</li>
      </ul>
      <p>Typical pilots start at $8k. Fixed-price discovery available.</p>
    </main>
  );
}
