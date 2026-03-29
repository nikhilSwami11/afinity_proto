'use client';

import type { ReactNode } from 'react';
import {
  Sparkles,
  Home,
  PenSquare,
  Compass,
  Map,
  User,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { nearbyUsers } from './data';

export type AppPage =
  | 'home'
  | 'write'
  | 'discover'
  | 'map'
  | 'profile'
  | 'settings';

type AppShellProps = {
  current: AppPage;
  setCurrent: (page: AppPage) => void;
  children: ReactNode;
};

export default function AppShell({
  current,
  setCurrent,
  children
}: AppShellProps) {
  const nav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'write', label: 'Write', icon: PenSquare },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur md:block">
          <div className="mb-6 flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/30">
              <Sparkles className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <div className="text-lg font-semibold">Affinity</div>
              <div className="text-xs text-slate-400">Thought-based network</div>
            </div>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrent(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                    active
                      ? 'bg-white text-slate-950'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>

        <aside className="hidden w-80 shrink-0 space-y-4 xl:block">
          <Card className="rounded-3xl border-white/10 bg-white/5 text-slate-100">
            <CardHeader>
              <CardTitle className="text-base">Nearby minds</CardTitle>
              <CardDescription className="text-slate-400">
                People currently close to your writing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyUsers.map((u) => (
                <div
                  key={u.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="font-medium">{u.name}</div>
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-slate-200"
                    >
                      {u.closeness}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300">{u.excerpt}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-white/5 text-slate-100">
            <CardHeader>
              <CardTitle className="text-base">Your current signal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[
                  'reflective',
                  'values-driven',
                  'ambiguity-friendly',
                  'emotionally precise'
                ].map((tag) => (
                  <Badge
                    key={tag}
                    className="rounded-full bg-violet-500/20 text-violet-200 hover:bg-violet-500/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Your position will keep evolving as you publish more thoughts.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}