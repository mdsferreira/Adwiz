'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardBody, Typography, Input, Button } from '@material-tailwind/react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loadingCreds, setLoadingCreds] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function handleCredentialsSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoadingCreds(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoadingCreds(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push(callbackUrl);
  }

  async function handleGoogleSignIn() {
    setLoadingGoogle(true);
    await signIn('google', { callbackUrl });
    setLoadingGoogle(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Tiny brand header */}
        <div className="text-center space-y-1">
          <Typography variant="small" className="text-emerald-300 font-semibold tracking-wide">
            AdWiz
          </Typography>
          <Typography variant="h4" className="text-slate-50">
            Sign in
          </Typography>
          <Typography variant="small" className="text-slate-400">
            Use your Google account or email and password to continue.
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

            {/* Credentials form */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
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
                  placeholder="••••••••"
                  crossOrigin={undefined}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                disabled={loadingCreds}
                className="mt-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400"
              >
                {loadingCreds ? 'Signing in…' : 'Sign in with email'}
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-700" />
              <Typography variant="small" className="text-slate-500 text-[11px]">
                or
              </Typography>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* Google button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="border-slate-600 text-slate-100 hover:bg-slate-900/70"
            >
              {loadingGoogle ? 'Redirecting…' : 'Continue with Google'}
            </Button>

            <Typography variant="small" className="mt-2 text-center text-[11px] text-slate-400">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-emerald-300 underline underline-offset-2">
                Create one
              </a>
            </Typography>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
