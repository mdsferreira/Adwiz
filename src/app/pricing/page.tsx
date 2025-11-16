import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PricingClient from './PricingClient';

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const session = await getServerSession(authOptions);

  let tier: 'FREE' | 'PRO' = 'FREE';

  if (session?.user?.id) {
    const plan = await prisma.plan.findUnique({
      where: { userId: session.user.id },
    });
    if (plan?.tier === 'PRO') tier = 'PRO';
  }

  return (
    <PricingClient
      tier={tier}
      success={searchParams.success === '1'}
      canceled={searchParams.canceled === '1'}
      isLoggedIn={!!session?.user}
    />
  );
}
