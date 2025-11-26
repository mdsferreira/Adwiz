import { ReactNode } from 'react';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from './dashboard-shell';
import { getServerSession } from 'next-auth';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/dashboard`);
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
