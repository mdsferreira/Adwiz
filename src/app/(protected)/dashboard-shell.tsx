'use client';

import { ReactNode, useState } from 'react';
import { Navbar, Typography, IconButton, Button, Card } from '@material-tailwind/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/projects' },
  { label: 'Settings', href: '/settings' },
];

type DashboardShellProps = {
  children: ReactNode;
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  };
};

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-dvh bg-blue-gray-50">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 flex-col bg-white shadow-lg">
        <div className="p-4 border-b">
          <Typography variant="h6" className="font-semibold tracking-tight">
            Adwiz
          </Typography>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'filled' : 'text'}
                color={isActive(item.href) ? 'blue' : 'gray'}
                className="w-full justify-start normal-case"
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          {/* depois a gente liga esse botão em um signOut de verdade */}
          <Link href="/api/auth/signout?callbackUrl=/login">
            <Button
              variant="text"
              color="red"
              className="w-full justify-start normal-case"
              size="sm"
            >
              Sign out
            </Button>
          </Link>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col">
        {/* NAVBAR */}
        <Navbar fullWidth className="mx-0 rounded-none border-b bg-white px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* botão mobile pro menu */}
              <IconButton
                variant="text"
                className="md:hidden"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <span className="block h-[2px] w-5 bg-gray-900 mb-[4px]" />
                <span className="block h-[2px] w-5 bg-gray-900 mb-[4px]" />
                <span className="block h-[2px] w-5 bg-gray-900" />
              </IconButton>
              <Typography variant="h6" className="hidden md:block">
                Dashboard
              </Typography>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <Typography variant="small" className="font-medium text-gray-800">
                  {user.name || user.email || 'User'}
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  {user.role ?? 'Member'}
                </Typography>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/40 grid place-items-center text-xs font-semibold text-blue-700">
                {(user.name ?? user.email ?? 'AD').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </Navbar>

        {/* SIDEBAR MOBILE */}
        {isSidebarOpen && (
          <div className="md:hidden bg-white shadow-lg border-b">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'filled' : 'text'}
                    color={isActive(item.href) ? 'blue' : 'gray'}
                    className="w-full justify-start normal-case"
                    size="sm"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          <Card className="w-full max-w-5xl mx-auto p-4 md:p-6 shadow-sm">{children}</Card>
        </main>
      </div>
    </div>
  );
}
