import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from './providers';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Adwiz',
  description: 'Your AD Helper',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
