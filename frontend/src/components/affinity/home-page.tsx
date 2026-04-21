'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // still used by post bar panel
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { useRightPanel } from '@/lib/right-panel-context';
import type { AppPage } from './app-shell';
import type { UserPosition } from './prototype-app';
import WriteModal from './write-modal';

type SeedUser = {
  id: number;
  name: string;
  excerpt: string;
  themes: string[];
  camp: string;
  map_x: number;
  map_y: number;
};

type HoverState = {
  user: SeedUser;
  dotX: number;
  dotY: number;
} | null;

type HomePageProps = {
  onNavigate: (page: AppPage) => void;
  userPosition: UserPosition;
};

const API = 'http://localhost:8000/api/v1';

function euclidean(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

// ── Right panel content components ──────────────────────────────────────────

function NearbyMindsPanel({
  users,
  onSelect,
}: {
  users: SeedUser[];
  onSelect: (u: SeedUser) => void;
}) {
  if (users.length === 0) return null;
  return (
    <Card className={t.cardMd}>
      <CardHeader>
        <CardTitle className={cn('text-base', t.fg)}>Nearby minds</CardTitle>
        <CardDescription className={t.fgMuted}>
          The 3 people closest to where you landed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SelectedUserPanel({
  user,
  isNearest,
  onClose,
}: {
  user: SeedUser;
  isNearest: boolean;
  onClose: () => void;
}) {
  return (
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
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function HomePage({ userPosition }: HomePageProps) {
  const [writeOpen, setWriteOpen] = useState(false);
  const [seeds, setSeeds] = useState<SeedUser[]>([]);
  const [selected, setSelected] = useState<SeedUser | null>(null);
  const [hovered, setHovered] = useState<HoverState>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { setRightPanel } = useRightPanel();

  useEffect(() => {
    fetch(`${API}/map/users`)
      .then((r) => r.json())
      .then(setSeeds)
      .catch(() => {});
  }, []);

  // K=3 nearest to user position
  const nearestIds = new Set<number>();
  if (userPosition && seeds.length > 0) {
    [...seeds]
      .sort((a, b) =>
        euclidean(userPosition.x, userPosition.y, a.map_x, a.map_y) -
        euclidean(userPosition.x, userPosition.y, b.map_x, b.map_y)
      )
      .slice(0, 3)
      .forEach((s) => nearestIds.add(s.id));
  }

  const nearbyUsers = seeds.filter((s) => nearestIds.has(s.id));

  // Fall back to first 3 seeds when no position yet
  const panelUsers = nearbyUsers.length > 0 ? nearbyUsers : seeds.slice(0, 3);

  // Sync right panel whenever selection or seeds change
  useEffect(() => {
    if (seeds.length === 0) return;
    if (selected) {
      setRightPanel(
        <SelectedUserPanel
          user={selected}
          isNearest={nearestIds.has(selected.id)}
          onClose={() => setSelected(null)}
        />
      );
    } else {
      setRightPanel(
        <NearbyMindsPanel users={panelUsers} onSelect={setSelected} />
      );
    }
  // setRightPanel is stable (useCallback), nearestIds/panelUsers derive from seeds+userPosition
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, seeds, userPosition, setRightPanel]);

  // Reset to fallback on unmount so other pages see the default hardcoded panel
  useEffect(() => {
    return () => setRightPanel(null);
  // setRightPanel is stable — empty deps is correct here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDotEnter(user: SeedUser, e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setHovered({ user, dotX: e.clientX - rect.left, dotY: e.clientY - rect.top });
  }

  function handleDotClick(user: SeedUser, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected((prev) => (prev?.id === user.id ? null : user));
  }

  return (
    <>
      <div className="space-y-4">
        {/* Post bar */}
        <Card className={t.card}>
          <CardContent className="p-4">
            <button
              onClick={() => setWriteOpen(true)}
              className="flex w-full items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-app-violet text-sm font-medium text-app-violet-fg ring-1 ring-app-violet-line">
                Y
              </div>
              <div className={cn('flex-1 rounded-full border border-app-line bg-app-surface-hover px-5 py-3 text-sm transition hover:bg-app-surface-hover', t.fgMuted)}>
                Add another thought to sharpen your place in the space.
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Map canvas — no container, dots float on page background */}
        <div className="relative">
          {/* Fullscreen backdrop */}
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFullscreen(false)}
              />
            )}
          </AnimatePresence>

          <div
            ref={canvasRef}
            className={cn(
              'relative overflow-hidden bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_30%),#020617] transition-all duration-300',
              isFullscreen
                ? 'fixed inset-6 z-50 h-auto rounded-[32px]'
                : 'h-[600px] rounded-none'
            )}
            onClick={() => setSelected(null)}
          >
            {/* Floating fullscreen button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFullscreen((f) => !f); }}
              className="absolute right-4 top-4 z-10 rounded-xl bg-white/5 p-2 text-white/40 backdrop-blur transition hover:bg-white/10 hover:text-white/80"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
              {/* Dot layer — scales into left portion when fullscreen panel opens */}
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: 'left center' }}
                animate={{
                  scale: isFullscreen && selected ? 0.72 : 1,
                  x: isFullscreen && selected ? 8 : 0,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
              {/* Seed dots */}
              {seeds.map((user, i) => {
                const isNearest = nearestIds.has(user.id);
                const isSelected = selected?.id === user.id;
                const SIZES = [7, 9, 8, 11, 7, 10, 8, 12, 9, 7, 11, 8];
                const size = isNearest ? 12 : SIZES[user.id % SIZES.length];
                const floatY = isNearest ? 5 : 3 + (i % 3);
                const duration = 2.5 + (i % 7) * 0.4;

                return (
                  <motion.div
                    key={user.id}
                    className={cn(
                      'absolute cursor-pointer rounded-full',
                      isSelected ? 'ring-2 ring-white/50 ring-offset-1 ring-offset-transparent' : '',
                      isNearest
                        ? 'bg-violet-300/80 shadow-[0_0_12px_rgba(167,139,250,0.5)]'
                        : 'bg-white/50'
                    )}
                    style={{
                      left: `${5 + user.map_x * 90}%`,
                      top: `${8 + user.map_y * 78}%`,
                      width: size,
                      height: size,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      x: [0, (i % 2 === 0 ? 1 : -1) * (1 + (i % 3)), 0],
                      y: [0, -floatY, 0],
                      scale: [1, 1.06, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (i * 0.17) % duration,
                    }}
                    onMouseEnter={(e) => handleDotEnter(user, e)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => handleDotClick(user, e)}
                  />
                );
              })}

              {/* User dot */}
              {userPosition && (
                <>
                  <motion.div
                    className="absolute cursor-default rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.85)]"
                    style={{
                      left: `${5 + userPosition.x * 90}%`,
                      top: `${8 + userPosition.y * 78}%`,
                      width: 18,
                      height: 18,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{ x: [0, 1.5, 0], y: [0, -5, 0], scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className={cn('pointer-events-none absolute px-2 py-1 text-xs text-white', t.overlayLabel)}
                    style={{
                      left: `calc(${5 + userPosition.x * 90}% + 14px)`,
                      top: `calc(${8 + userPosition.y * 78}% - 10px)`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  >
                    you
                  </motion.div>
                </>
              )}

              {/* Fullscreen: pulsing sonar rings on K=3 nearest dots */}
              {isFullscreen && seeds
                .filter((s) => nearestIds.has(s.id))
                .map((s, ringIdx) => (
                  <motion.div
                    key={`ring-${s.id}`}
                    className="pointer-events-none absolute rounded-full border border-violet-300/40"
                    style={{
                      left: `${5 + s.map_x * 90}%`,
                      top: `${8 + s.map_y * 78}%`,
                      width: 12,
                      height: 12,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      scale: [1, 4.5],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: ringIdx * 0.8,
                    }}
                  />
                ))}

              {/* Fullscreen: camp region labels */}
              {isFullscreen && seeds.length > 0 && (() => {
                const campMap: Record<string, { x: number[]; y: number[] }> = {};
                seeds.forEach((s) => {
                  if (!campMap[s.camp]) campMap[s.camp] = { x: [], y: [] };
                  campMap[s.camp].x.push(s.map_x);
                  campMap[s.camp].y.push(s.map_y);
                });
                const CAMP_LABELS: Record<string, string> = {
                  introspection: 'Introspection',
                  systems: 'Systems',
                  belonging: 'Belonging',
                  doubt: 'Doubt',
                  memory: 'Memory',
                  ambition: 'Ambition',
                  language: 'Language',
                };
                return Object.entries(campMap).map(([camp, pts]) => {
                  const cx = pts.x.reduce((a, b) => a + b, 0) / pts.x.length;
                  const cy = pts.y.reduce((a, b) => a + b, 0) / pts.y.length;
                  return (
                    <motion.div
                      key={camp}
                      className="pointer-events-none absolute select-none text-[11px] font-medium tracking-widest text-white/20 uppercase"
                      style={{
                        left: `${cx * 100}%`,
                        top: `${cy * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {CAMP_LABELS[camp] ?? camp}
                    </motion.div>
                  );
                });
              })()}

              </motion.div>

              {/* Legend — horizontal, centered at bottom */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 rounded-full border border-white/8 bg-black/30 px-5 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                  <span className="text-[11px] text-white/50">you</span>
                </div>
                <span className="h-3 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-300/80" />
                  <span className="text-[11px] text-white/50">nearby</span>
                </div>
                <span className="h-3 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="text-[11px] text-white/50">others</span>
                </div>
              </div>

              {/* Fullscreen: selected user slide-in panel */}
              <AnimatePresence>
                {isFullscreen && selected && (
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 z-20 flex w-72 flex-col overflow-hidden"
                    style={{
                      background: 'linear-gradient(to left, rgba(2,6,23,0.92) 70%, transparent)',
                      backdropFilter: 'blur(12px)',
                      borderLeft: '1px solid rgba(255,255,255,0.07)',
                    }}
                    initial={{ x: 288, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 288, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      {/* Close */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-white/30">
                          {selected.camp}
                        </span>
                        <button
                          onClick={() => setSelected(null)}
                          className="rounded-lg p-1 text-white/30 transition hover:text-white/70"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Name */}
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {selected.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selected.themes.map((theme) => (
                            <Badge
                              key={theme}
                              className={cn('px-2 py-0.5 text-[10px]', t.badgeAccent)}
                            >
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/8" />

                      {/* Thought */}
                      <div>
                        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/30">
                          Their thought
                        </p>
                        <p className="text-sm italic leading-relaxed text-white/70">
                          "{selected.excerpt}"
                        </p>
                      </div>

                      {/* Nearness indicator */}
                      {nearestIds.has(selected.id) && (
                        <div className="mt-auto rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
                          <p className="text-xs text-violet-300/80">
                            This mind is one of your 3 nearest in the space.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover card */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    key={hovered.user.id}
                    className={cn('pointer-events-none absolute z-10 w-52 px-3 py-3', t.overlayLabel)}
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
                    <div className="mt-1 mb-1.5 flex flex-wrap gap-1">
                      {hovered.user.themes.slice(0, 2).map((theme) => (
                        <Badge key={theme} className={cn('px-1.5 py-0 text-[10px]', t.badgeAccent)}>
                          {theme}
                        </Badge>
                      ))}
                    </div>
                    <p className={cn('text-xs italic leading-relaxed', t.fgMuted)}>
                      "{hovered.user.excerpt}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} />
    </>
  );
}
