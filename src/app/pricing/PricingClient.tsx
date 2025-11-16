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

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <Typography variant="h3" className="text-center mb-2">
        Choose your plan
      </Typography>
      <Typography variant="small" color="gray" className="text-center">
        Free for light usage, Pro when you’re ready to scale.
      </Typography>

      {success && (
        <Typography
          variant="small"
          className="mx-auto max-w-md rounded-md bg-green-50 p-3 text-center text-green-800"
        >
          Payment successful 🎉 Your account is now on the Pro plan.
        </Typography>
      )}
      {canceled && (
        <Typography
          variant="small"
          className="mx-auto max-w-md rounded-md bg-yellow-50 p-3 text-center text-yellow-800"
        >
          Checkout canceled. You can try again anytime.
        </Typography>
      )}

      <div className="grid gap-6 md:grid-cols-2 mt-4">
        {/* FREE */}
        <Card className={tier === 'FREE' ? 'border-2 border-black' : ''}>
          <CardBody className="space-y-3">
            <Typography variant="h5">Free</Typography>
            <Typography variant="small" color="gray">
              For testing the tool and occasional campaigns.
            </Typography>
            <Typography variant="h4">€0</Typography>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Up to 3 ad generations per week</li>
              <li>• Meta & Google ad copy</li>
              <li>• Basic audience suggestions</li>
            </ul>
            <Button variant="outlined" size="sm" className="mt-4" disabled>
              {tier === 'FREE' ? 'Current plan' : 'Switch to Free'}
            </Button>
          </CardBody>
        </Card>

        {/* PRO */}
        <Card className={tier === 'PRO' ? 'border-2 border-black' : ''}>
          <CardBody className="space-y-3">
            <Typography variant="h5">Pro</Typography>
            <Typography variant="small" color="gray">
              For active stores running campaigns every week.
            </Typography>
            <div className="flex items-baseline gap-1">
              <Typography variant="h4">€29</Typography>
              <Typography variant="small" color="gray">
                / month
              </Typography>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Unlimited ad generations</li>
              <li>• Meta & Google multi-variant export</li>
              <li>• Priority improvements & new features</li>
            </ul>
            <Button size="sm" className="mt-4" onClick={onGoPro} disabled={loading}>
              {tier === 'PRO' ? 'You are Pro 🎉' : loading ? 'Redirecting…' : 'Go Pro'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
