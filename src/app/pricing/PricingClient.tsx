'use client';

import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

type Props = {
  tier: 'FREE' | 'PRO';
  success: boolean;
  canceled: boolean;
  isLoggedIn: boolean;
};

export default function PricingClient({ tier, success, canceled, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false);

  async function onGoPro() {
    if (!isLoggedIn) {
      await signIn('google', { callbackUrl: '/pricing' });
      return;
    }

    setLoading(true);
    const res = await fetch('/api/billing/checkout', { method: 'POST' });
    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Could not start checkout');
    }
  }

  const isFree = tier === 'FREE';
  const isPro = tier === 'PRO';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Typography variant="h3" className="mb-1 text-slate-50 text-3xl font-semibold">
            Pricing
          </Typography>
          <Typography variant="small" className="text-slate-400">
            Free for light usage, Pro when you’re ready to scale your campaigns.
          </Typography>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Current plan: <span className="uppercase">{tier}</span>
          </div>
        </div>

        {/* Status messages */}
        {success && (
          <div className="mx-auto max-w-md rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-xs text-emerald-100">
            Payment successful 🎉 Your account is now on the Pro plan.
          </div>
        )}
        {canceled && (
          <div className="mx-auto max-w-md rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-100">
            Checkout canceled. You can try again anytime.
          </div>
        )}

        {/* Plans */}
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {/* FREE */}
          <Card
            className={`
              relative bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/40
              ${isFree ? 'ring-2 ring-emerald-400/70' : ''}
            `}
          >
            <CardBody className="space-y-4 p-4">
              {isFree && (
                <span className="absolute right-3 top-3 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 border border-emerald-400/50">
                  Current
                </span>
              )}

              <Typography variant="h5" className="text-slate-50">
                Free
              </Typography>
              <Typography variant="small" className="text-slate-400">
                For testing the tool and occasional campaigns.
              </Typography>

              <div className="flex items-baseline gap-1">
                <Typography variant="h4" className="text-slate-50">
                  €0
                </Typography>
                <Typography variant="small" className="text-slate-500">
                  / forever
                </Typography>
              </div>

              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>• Up to 3 ad generations per week</li>
                <li>• Meta &amp; Google ad copy</li>
                <li>• Basic audience suggestions</li>
              </ul>

              <Button
                variant="outlined"
                size="sm"
                className="mt-4 border-slate-600 text-slate-200 hover:bg-slate-800/70"
                disabled
              >
                {isFree ? 'Current plan' : 'Switch to Free'}
              </Button>
            </CardBody>
          </Card>

          {/* PRO */}
          <Card
            className={`
              relative bg-slate-950/80 border border-emerald-500/60 backdrop-blur-xl shadow-xl shadow-emerald-500/30 
              ${isPro ? 'ring-2 ring-emerald-400/80' : ''}
            `}
          >
            <CardBody className="space-y-4 p-4">
              {isPro && (
                <span className="absolute right-3 top-3 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 border border-emerald-400/50">
                  Current
                </span>
              )}

              <Typography variant="h5" className="text-slate-50">
                Pro
              </Typography>
              <Typography variant="small" className="text-slate-400">
                For active stores running campaigns every week.
              </Typography>

              <div className="flex items-baseline gap-1">
                <Typography variant="h4" className="text-slate-50">
                  €29
                </Typography>
                <Typography variant="small" className="text-slate-500">
                  / month
                </Typography>
              </div>

              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>• Unlimited ad generations</li>
                <li>• Meta &amp; Google multi-variant export</li>
                <li>• Priority improvements &amp; new features</li>
              </ul>

              <Button
                size="sm"
                className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400"
                onClick={onGoPro}
                disabled={loading || isPro}
              >
                {isPro ? 'You are Pro 🎉' : loading ? 'Redirecting…' : 'Go Pro'}
              </Button>

              {!isLoggedIn && (
                <Typography variant="small" className="mt-1 text-[11px] text-slate-400 text-center">
                  You&apos;ll be asked to sign in with Google before checkout.
                </Typography>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
