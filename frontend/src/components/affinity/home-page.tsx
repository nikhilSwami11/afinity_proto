'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import type { AppPage } from './app-shell';
import WriteModal from './write-modal';

type HomePageProps = {
  onNavigate: (page: AppPage) => void;
};

export default function HomePage({ onNavigate: _onNavigate }: HomePageProps) {
  const [writeOpen, setWriteOpen] = useState(false);

  const dots = useMemo(() => {
    return [...Array(36)].map((_, i) => ({
      id: i,
      x: 6 + ((i * 11) % 86),
      y: 8 + ((i * 17) % 80),
      size: i === 4 ? 18 : 8 + (i % 4),
      mine: i === 4
    }));
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Compact post bar */}
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

        {/* Semantic space map */}
        <Card className={t.card}>
          <CardHeader>
            <CardTitle className={t.fg}>Semantic space</CardTitle>
            <CardDescription className={t.fgMuted}>
              A 2D view of where you sit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] overflow-hidden rounded-[28px] border border-app-line bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617]">
              {dots.map((dot) => (
                <motion.div
                  key={dot.id}
                  className={cn(
                    'absolute cursor-pointer rounded-full',
                    dot.mine
                      ? 'bg-white shadow-[0_0_35px_rgba(255,255,255,0.8)]'
                      : dot.id % 4 === 0
                        ? 'bg-violet-300/70'
                        : 'bg-white/60'
                  )}
                  style={{ left: `${dot.x}%`, top: `${dot.y}%`, width: dot.size, height: dot.size }}
                  animate={{
                    scale: dot.mine ? [1, 1.15, 1] : [1, 1.05, 1],
                    opacity: [0.55, 1, 0.55]
                  }}
                  transition={{ duration: dot.mine ? 2 : 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} />
    </>
  );
}
