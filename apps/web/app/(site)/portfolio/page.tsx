export const metadata = { title: 'Portfolio' };
export default function Portfolio() {
  return (
    <main className="container">
      <h1>Case notes</h1>
      <ul>
        <li><strong>Agent inbox triage:</strong> 42% faster response SLAs; reduced manual routing by 60%.</li>
        <li><strong>Meetup pipeline:</strong> Aggregated 7 sources to weekly ICS feed; +18% attendance.</li>
        <li><strong>Docs brief generator:</strong> 8-minute briefs with link annotations; 0 P0 incidents.</li>
      </ul>
    </main>
  );
}
