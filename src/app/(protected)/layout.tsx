import { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from './dashboard-shell';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
