'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';

export type SeedUser = {
  id: number;
  name: string;
  excerpt: string;
  themes: string[];
  camp: string;
  map_x: number;
  map_y: number;
};

function SkeletonRow({ delay }: { delay: number }) {
  return (
    <motion.div
      className={cn('rounded-2xl p-3', t.inner)}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-24 rounded-full bg-white/10" />
        <div className="flex gap-1">
          <div className="h-4 w-12 rounded-full bg-white/8" />
          <div className="h-4 w-10 rounded-full bg-white/8" />
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-2.5 w-full rounded-full bg-white/6" />
        <div className="h-2.5 w-4/5 rounded-full bg-white/6" />
      </div>
    </motion.div>
  );
}

export function NearbyMindsPanel({
  users,
  loading = false,
  onSelect,
}: {
  users: SeedUser[];
  loading?: boolean;
  onSelect: (u: SeedUser) => void;
}) {
  return (
    <Card className={t.cardMd}>
      <CardHeader>
        <CardTitle className={cn('text-base', t.fg)}>Nearby minds</CardTitle>
        <CardDescription className={t.fgMuted}>
          The 3 people closest to where you landed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <SkeletonRow delay={0} />
            <SkeletonRow delay={0.15} />
            <SkeletonRow delay={0.3} />
          </>
        ) : (
          <AnimatePresence>
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08, ease: 'easeOut' }}
                className={cn('cursor-pointer rounded-2xl p-3 transition', t.inner, 'hover:bg-app-surface')}
                onClick={() => onSelect(user)}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm font-medium', t.fg)}>{user.name}</span>
                  <div className="flex gap-1">
                    {user.themes.slice(0, 2).map((theme) => (
                      <Badge key={theme} className={cn('px-1.5 py-0 text-[10px]', t.badgeAccent)}>
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className={cn('mt-1 text-xs italic leading-relaxed', t.fgMuted)}>
                  "{user.excerpt}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}

export function SelectedUserPanel({
  user,
  isNearest,
  onClose,
}: {
  user: SeedUser;
  isNearest: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card className={t.cardMd}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={cn('text-base', t.fg)}>{user.name}</CardTitle>
              <CardDescription className={t.fgMuted}>
                {isNearest ? 'Very near · similar themes' : 'In the space'}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className={cn('text-sm transition', t.fgMuted, 'hover:text-app-fg')}
            >
              close
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.themes.map((theme) => (
              <Badge key={theme} className={t.badgeAccent}>{theme}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className={cn('text-sm italic leading-relaxed', t.fgSoft)}>
            "{user.excerpt}"
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
