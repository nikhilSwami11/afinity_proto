'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function MapPage() {
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
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
        <CardHeader>
          <CardTitle className="text-3xl">Map</CardTitle>
          <CardDescription className="text-slate-400">
            A 2D MVP version of the semantic space
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative h-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617]">
            {dots.map((dot) => (
              <motion.div
                key={dot.id}
                className={cn(
                  'absolute rounded-full cursor-pointer',
                  dot.mine
                    ? 'bg-white shadow-[0_0_35px_rgba(255,255,255,0.8)]'
                    : dot.id % 4 === 0
                      ? 'bg-violet-300/70'
                      : 'bg-white/60'
                )}
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: dot.size,
                  height: dot.size
                }}
                animate={{
                  scale: dot.mine ? [1, 1.15, 1] : [1, 1.05, 1],
                  opacity: [0.55, 1, 0.55]
                }}
                transition={{
                  duration: dot.mine ? 2 : 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Selected profile</CardTitle>
            <CardDescription className="text-slate-400">
              Why this dot is near you
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="text-lg font-medium">Mira</div>
              <div className="mt-1 text-sm text-slate-400">Very near</div>
            </div>

            <p className="text-slate-300">
              You appear close because both of you write often about identity,
              uncertainty, and emotional honesty.
            </p>

            <div className="flex flex-wrap gap-2">
              {['identity', 'uncertainty', 'honesty'].map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full bg-violet-500/15 text-violet-200 hover:bg-violet-500/15"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Button className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200">
              View full profile
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Map controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Search users or themes
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Filter by cluster
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Highlight nearest neighbors
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}