export const metadata = { title: 'Contact' };
export default function Contact() {
  return (
    <main className="container">
      <h1>Contact</h1>
      <p>
        Book time: <a href="https://cal.com/graham" target="_blank" rel="noreferrer">cal.com/graham</a>
      </p>
      <form action="#" method="post" onSubmit={(e) => e.preventDefault()} aria-describedby="contact-help">
        <label>
          Your email
          <input type="email" name="email" required aria-required="true" />
        </label>
        {/* Honeypot field for bots */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label>Do not fill
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label>
          Message
          <textarea name="message" rows={5} required aria-required="true" />
        </label>
        <button className="button" type="submit">Send</button>
      </form>
      <p id="contact-help">Spam protection is enabled. For project invites, include your repo or brief.</p>
    </main>
  );
}
