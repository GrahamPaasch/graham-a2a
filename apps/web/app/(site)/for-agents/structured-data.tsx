export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Graham Paasch',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    sameAs: [
      'https://github.com/GrahamPaasch',
      'https://www.linkedin.com/in/grahampaasch'
    ]
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
