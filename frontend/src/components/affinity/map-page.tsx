'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import type { AppPage } from './app-shell';
import type { UserPosition } from './prototype-app';

type SeedUser = {
  id: number;
  name: string;
  excerpt: string;
  themes: string[];
  map_x: number;
  map_y: number;
};

type HoverState = {
  user: SeedUser;
  dotX: number; // px from canvas left
  dotY: number; // px from canvas top
} | null;

type MapPageProps = {
  userPosition: UserPosition;
  onNavigate: (page: AppPage) => void;
};

const API = 'http://localhost:8000/api/v1';

function euclidean(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export default function MapPage({ userPosition, onNavigate: _onNavigate }: MapPageProps) {
  const [seeds, setSeeds] = useState<SeedUser[]>([]);
  const [selected, setSelected] = useState<SeedUser | null>(null);
  const [hovered, setHovered] = useState<HoverState>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/map/users`)
      .then((r) => r.json())
      .then(setSeeds)
      .catch(() => {});
  }, []);

  // K=3 nearest seeds to the user by Euclidean distance
  const nearestIds = new Set<number>();
  if (userPosition && seeds.length > 0) {
    const sorted = [...seeds].sort((a, b) =>
      euclidean(userPosition.x, userPosition.y, a.map_x, a.map_y) -
      euclidean(userPosition.x, userPosition.y, b.map_x, b.map_y)
    );
    sorted.slice(0, 3).forEach((s) => nearestIds.add(s.id));
  }

  function handleDotEnter(user: SeedUser, e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setHovered({
      user,
      dotX: e.clientX - rect.left,
      dotY: e.clientY - rect.top,
    });
  }

  function handleDotClick(user: SeedUser) {
    setSelected((prev) => (prev?.id === user.id ? null : user));
  }

  const defaultPanel = seeds
    .filter((s) => nearestIds.has(s.id))
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Map canvas */}
      <Card className={t.card}>
        <CardHeader>
          <CardTitle className={t.fg}>Mind map</CardTitle>
          <CardDescription className={t.fgMuted}>
            Each dot is a person. Your position is based on what you think.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative h-[440px] overflow-hidden rounded-[28px] border border-app-line bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617]"
            onClick={() => setSelected(null)}
          >
            {/* Seed user dots */}
            {seeds.map((user) => {
              const isNearest = nearestIds.has(user.id);
              const isSelected = selected?.id === user.id;
              const size = isNearest ? 12 : 8;

              return (
                <motion.div
                  key={user.id}
                  className={cn(
                    'absolute cursor-pointer rounded-full',
                    isSelected
                      ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent'
                      : '',
                    isNearest
                      ? 'bg-violet-300/80 shadow-[0_0_12px_rgba(167,139,250,0.6)]'
                      : 'bg-white/50'
                  )}
                  style={{
                    left: `${user.map_x * 100}%`,
                    top: `${user.map_y * 100}%`,
                    width: size,
                    height: size,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: isNearest ? 2.5 : 4, repeat: Infinity, ease: 'easeInOut' }}
                  onMouseEnter={(e) => handleDotEnter(user, e)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => { e.stopPropagation(); handleDotClick(user); }}
                />
              );
            })}

            {/* User's own dot */}
            {userPosition && (
              <motion.div
                className="absolute cursor-default rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.85)]"
                style={{
                  left: `${userPosition.x * 100}%`,
                  top: `${userPosition.y * 100}%`,
                  width: 18,
                  height: 18,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* "You" label — fades after 3s */}
            {userPosition && (
              <motion.div
                className={cn('pointer-events-none absolute px-2 py-1 text-xs text-white', t.overlayLabel)}
                style={{
                  left: `calc(${userPosition.x * 100}% + 14px)`,
                  top: `calc(${userPosition.y * 100}% - 10px)`,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                you
              </motion.div>
            )}

            {/* No position yet */}
            {!userPosition && (
              <div className={cn('absolute bottom-4 left-4 px-3 py-2 text-sm text-white', t.overlayLabel)}>
                Complete onboarding to place your dot.
              </div>
            )}

            {/* Legend */}
            <div className={cn('absolute bottom-4 right-4 flex flex-col gap-1.5 px-3 py-2 text-xs', t.overlayLabel)}>
              <div className="flex items-center gap-2 text-white/70">
                <span className="inline-block h-3 w-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                you
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <span className="inline-block h-3 w-3 rounded-full bg-violet-300/80" />
                nearby minds
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/50" />
                others
              </div>
            </div>

            {/* Hover card — absolute div sibling of dots, not inside SVG */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.user.id}
                  className={cn(
                    'pointer-events-none absolute z-10 w-52 px-3 py-3',
                    t.overlayLabel
                  )}
                  style={{
                    left: Math.min(hovered.dotX + 12, (canvasRef.current?.offsetWidth ?? 400) - 220),
                    top: hovered.dotY > 120 ? hovered.dotY - 110 : hovered.dotY + 16,
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={cn('font-medium', t.fg)}>{hovered.user.name}</div>
                  <div className="mb-1.5 flex flex-wrap gap-1 mt-1">
                    {hovered.user.themes.slice(0, 2).map((theme) => (
                      <Badge key={theme} className={cn('text-[10px] px-1.5 py-0', t.badgeAccent)}>
                        {theme}
                      </Badge>
                    ))}
                  </div>
                  <p className={cn('text-xs leading-relaxed italic', t.fgMuted)}>
                    "{hovered.user.excerpt}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Selected user detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={t.card}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={t.fg}>{selected.name}</CardTitle>
                    <CardDescription className={t.fgMuted}>
                      {nearestIds.has(selected.id) ? 'Very near · similar themes' : 'In the space'}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className={cn('text-sm', t.fgMuted, 'hover:text-app-fg transition')}
                  >
                    close
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selected.themes.map((theme) => (
                    <Badge key={theme} className={t.badgeAccent}>{theme}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className={cn('text-sm leading-relaxed italic', t.fgSoft)}>
                  "{selected.excerpt}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default nearby minds panel */}
      {!selected && defaultPanel.length > 0 && (
        <Card className={t.card}>
          <CardHeader>
            <CardTitle className={cn('text-base', t.fg)}>Nearby minds</CardTitle>
            <CardDescription className={t.fgMuted}>
              The 3 people closest to where you landed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {defaultPanel.map((user) => (
              <div
                key={user.id}
                className={cn('cursor-pointer rounded-2xl p-3 transition', t.inner, 'hover:bg-app-surface')}
                onClick={() => setSelected(user)}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('font-medium text-sm', t.fg)}>{user.name}</span>
                  <div className="flex gap-1">
                    {user.themes.slice(0, 2).map((theme) => (
                      <Badge key={theme} className={cn('text-[10px] px-1.5 py-0', t.badgeAccent)}>
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className={cn('mt-1 text-xs leading-relaxed italic', t.fgMuted)}>
                  "{user.excerpt}"
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
