'use client';

import { ReactNode, useState } from 'react';
import { Navbar, Typography, IconButton, Button, Card } from '@material-tailwind/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

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

  const initials = (user.name ?? user.email ?? 'AD').slice(0, 2).toUpperCase();

  async function handleSignOut() {
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <div className="flex min-h-dvh bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-950/80 border-r border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/80">
          <div>
            <Typography variant="h6" className="font-semibold tracking-tight text-slate-50">
              AdWiz
            </Typography>
            <Typography variant="small" className="text-[11px] text-slate-400">
              Shopify ad studio
            </Typography>
          </div>
          <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-400/40 grid place-items-center text-[10px] font-semibold text-emerald-200">
            {initials}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? 'filled' : 'text'}
                  color={active ? 'teal' : 'gray'}
                  className={`w-full justify-start normal-case text-sm rounded-lg ${
                    active
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] text-slate-500">
            Signed in as
            <div className="truncate text-slate-300">{user.email ?? user.name ?? 'User'}</div>
          </div>
          <Button
            variant="text"
            color="red"
            className="w-full justify-start normal-case text-xs text-red-300 hover:bg-red-500/10"
            size="sm"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col">
        {/* NAVBAR */}
        <Navbar
          fullWidth
          className="mx-0 rounded-none border-b border-slate-800/70 bg-slate-950/60 px-4 py-2 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-2">
            {/* LEFT: brand + mobile menu */}
            <div className="flex items-center gap-3">
              {/* mobile menu */}
              <IconButton
                variant="text"
                className="md:hidden text-slate-200"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <span className="block h-[2px] w-5 bg-slate-200 mb-[4px]" />
                <span className="block h-[2px] w-5 bg-slate-200 mb-[4px]" />
                <span className="block h-[2px] w-5 bg-slate-200" />
              </IconButton>
              <div className="flex flex-col">
                <Typography variant="small" className="font-semibold text-slate-50">
                  Dashboard
                </Typography>
                <Typography variant="small" className="text-[11px] text-slate-400">
                  Generate, test & export your ad creatives
                </Typography>
              </div>
            </div>

            {/* RIGHT: user info + CTA */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <Typography variant="small" className="font-medium text-slate-100">
                  {user.name || user.email || 'User'}
                </Typography>
                <Typography variant="small" className="text-[11px] text-slate-400">
                  {user.role ?? 'Member'}
                </Typography>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-400/40 grid place-items-center text-xs font-semibold text-emerald-200">
                {initials}
              </div>
              <Link href="/pricing">
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden sm:inline-flex bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-md shadow-emerald-500/40"
                >
                  View plans
                </Button>
              </Link>
            </div>
          </div>
        </Navbar>

        {/* SIDEBAR MOBILE */}
        {isSidebarOpen && (
          <div className="md:hidden bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-xl">
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? 'filled' : 'text'}
                      color={active ? 'teal' : 'gray'}
                      className={`w-full justify-start normal-case text-sm rounded-lg ${
                        active
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                          : 'text-slate-200 hover:bg-slate-800/80'
                      }`}
                      size="sm"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <Card className="w-full border border-slate-800/70 bg-slate-950/60 p-4 md:p-6 shadow-xl shadow-black/30 backdrop-blur-xl">
              {children}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
