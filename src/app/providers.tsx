'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { MaterialThemeProvider } from './providers/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MaterialThemeProvider>{children}</MaterialThemeProvider>
    </SessionProvider>
  );
}
