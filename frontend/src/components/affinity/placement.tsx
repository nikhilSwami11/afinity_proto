'use client';

import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PlacementProps = {
  onContinue: () => void;
};

export default function Placement({ onContinue }: PlacementProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <Card className="w-full max-w-4xl overflow-hidden rounded-[32px] border-white/10 bg-white/5">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <Badge className="mb-4 w-fit rounded-full bg-violet-500/20 text-violet-200 hover:bg-violet-500/20">
              Initial placement complete
            </Badge>

            <h2 className="text-4xl font-semibold tracking-tight">
              You’ve entered the space.
            </h2>

            <p className="mt-4 max-w-md text-slate-300">
              Your first thoughts have given us an initial sense of where you
              belong. Your position will keep evolving as you write.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={onContinue}
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
              >
                Explore nearby minds
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                View profile
              </Button>
            </div>
          </div>

          <div className="relative min-h-[420px] border-t border-white/10 bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617] lg:border-l lg:border-t-0">
            {[...Array(30)].map((_, i) => {
              const left = `${6 + ((i * 13) % 85)}%`;
              const top = `${10 + ((i * 19) % 75)}%`;
              const active = i === 8;

              return (
                <motion.div
                  key={i}
                  className={cn(
                    'absolute rounded-full',
                    active
                      ? 'bg-white shadow-[0_0_35px_rgba(255,255,255,0.8)]'
                      : i % 4 === 0
                        ? 'bg-violet-300/70'
                        : 'bg-white/55'
                  )}
                  style={{
                    left,
                    top,
                    width: active ? 16 : 9,
                    height: active ? 16 : 9
                  }}
                  animate={{
                    scale: active ? [1, 1.15, 1] : [1, 1.05, 1],
                    opacity: [0.55, 1, 0.55]
                  }}
                  transition={{
                    duration: active ? 2.4 : 3.8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              );
            })}

            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 backdrop-blur">
              Your dot is now visible.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}