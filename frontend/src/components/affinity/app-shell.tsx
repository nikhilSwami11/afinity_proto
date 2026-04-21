'use client';

import type { ReactNode } from 'react';
import {
  Sparkles,
  PenSquare,
  Compass,
  Globe,
  User,
  Settings,
  Sun,
  Moon
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
import { t } from '@/lib/tokens';
import { useTheme } from '@/lib/theme-context';
import { useRightPanel } from '@/lib/right-panel-context';

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
  const { theme, toggle } = useTheme();
  const { rightPanel } = useRightPanel();

  const nav = [
    { id: 'home', label: 'Map', icon: Globe },
    { id: 'write', label: 'Write', icon: PenSquare },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <div className={t.page}>
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside
          className={cn(
            'hidden w-64 shrink-0 p-4 md:flex md:flex-col',
            t.sidebar
          )}
        >
          <div className="mb-6 flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-app-violet ring-1 ring-app-violet-line">
              <Sparkles className="h-5 w-5 text-app-violet-fg" />
            </div>
            <div>
              <div className={cn('text-lg font-semibold', t.fg)}>Affinity</div>
              <div className={cn('text-xs', t.fgMuted)}>Thought-based network</div>
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
                    active ? t.navActive : t.navInactive
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <button
              onClick={toggle}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                t.navInactive
              )}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            </button>
          </div>
        </aside>

        <main className="mb-20 min-w-0 flex-1 md:mb-0">{children}</main>

        <aside className="hidden w-80 shrink-0 space-y-4 xl:block">
          {rightPanel ?? (
            <>
              <Card className={t.cardMd}>
                <CardHeader>
                  <CardTitle className={cn('text-base', t.fg)}>
                    Selected profile
                  </CardTitle>
                  <CardDescription className={t.fgMuted}>
                    Why this dot is near you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className={cn('font-medium', t.fg)}>Mira</div>
                    <div className={cn('mt-1 text-sm', t.fgMuted)}>Very near</div>
                  </div>
                  <p className={cn('text-sm', t.fgSoft)}>
                    You appear close because both of you write often about identity,
                    uncertainty, and emotional honesty.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['identity', 'uncertainty', 'honesty'].map((tag) => (
                      <Badge key={tag} className={t.badgeAccent}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button className={cn('w-full px-4 py-2 text-sm font-medium transition', t.btnPrimary)}>
                    View full profile
                  </button>
                </CardContent>
              </Card>

              <Card className={t.cardMd}>
                <CardHeader>
                  <CardTitle className={cn('text-base', t.fg)}>
                    Your current signal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['reflective', 'values-driven', 'ambiguity-friendly', 'emotionally precise'].map((tag) => (
                      <Badge key={tag} className={t.badgeAccent}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className={cn('text-sm', t.fgMuted)}>
                    Your position will keep evolving as you publish more thoughts.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-app-line bg-app-bg md:hidden">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrent(item.id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition',
                active ? t.navActive : t.navInactive
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
