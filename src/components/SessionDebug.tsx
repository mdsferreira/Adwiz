// components/SessionDebug.tsx
'use client';

import { useSession } from 'next-auth/react';

export function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md bg-black/70 px-3 py-2 text-xs text-white">
      <div>Status: {status}</div>
      <div>User: {session?.user?.email ?? 'none'}</div>
      <div>ID: {(session?.user as any)?.id ?? 'none'}</div>
    </div>
  );
}
