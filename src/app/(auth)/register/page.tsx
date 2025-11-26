'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Card, CardBody, Typography, Input, Button } from '@material-tailwind/react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Could not register.');
      return;
    }

    // Auto sign in
    await signIn('credentials', {
      email,
      password,
      callbackUrl,
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <Typography variant="small" className="text-emerald-300 font-semibold tracking-wide">
            AdWiz
          </Typography>
          <Typography variant="h4" className="text-slate-50">
            Create your account
          </Typography>
          <Typography variant="small" className="text-slate-400">
            Sign up with email and password to start generating ads.
          </Typography>
        </div>

        <Card className="border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl shadow-xl shadow-black/40">
          <CardBody className="space-y-5">
            {error && (
              <Typography
                variant="small"
                className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-xs text-red-100"
              >
                {error}
              </Typography>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <Typography variant="small" className="text-slate-300">
                  Email
                </Typography>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@store.com"
                  crossOrigin={undefined}
                />
              </div>
              <div className="space-y-1">
                <Typography variant="small" className="text-slate-300">
                  Password
                </Typography>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  crossOrigin={undefined}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="mt-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <Typography variant="small" className="mt-2 text-center text-[11px] text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-300 underline underline-offset-2">
                Sign in
              </a>
            </Typography>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
