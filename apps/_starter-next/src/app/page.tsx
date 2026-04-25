export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '8rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>affex starter-next</h1>
      <p style={{ color: '#52525b', marginBottom: '2rem' }}>
        Reference Next.js 14 app wired with Layer 1 cores. The generator copies from this folder.
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>
          Health: <a href="/api/health">/api/health</a>
        </li>
      </ul>
    </main>
  );
}
