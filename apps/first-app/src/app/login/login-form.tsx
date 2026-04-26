'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@affex/ui-kit';
import { type FormEvent, useState } from 'react';

interface SignInResponse {
  ok: boolean;
  message?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setToken(null);
    setPending(true);
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json: SignInResponse & { token?: string } = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.message ?? 'sign-in failed');
        return;
      }
      setToken(json.token ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unexpected error');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Demo using @affex/ui-kit + auth-core JWT.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {token ? (
            <p className="break-all rounded-base border border-border bg-subtle p-2 text-xs text-secondary">
              jwt: {token}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
