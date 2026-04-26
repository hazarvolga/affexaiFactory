import { Button } from '@affex/ui-kit';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-32">
      <h1 className="text-3xl font-semibold">affex starter-next</h1>
      <p className="text-secondary">
        Reference Next.js 14 app wired with Layer 1 + the auth-core / ui-kit / design-tokens
        promotion. The generator copies from this folder.
      </p>
      <ul className="flex flex-col gap-2 text-sm">
        <li>
          Health:{' '}
          <a className="text-accent underline-offset-4 hover:underline" href="/api/health">
            /api/health
          </a>
        </li>
      </ul>
      <Button asChild>
        <Link href="/login">Go to /login →</Link>
      </Button>
    </main>
  );
}
