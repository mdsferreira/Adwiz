'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@material-tailwind/react';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
