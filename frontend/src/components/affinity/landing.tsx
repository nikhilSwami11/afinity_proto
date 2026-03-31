'use client';

import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { starterThoughts } from './data';

type LandingProps = {
  onStart: () => void;
};

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#312e81,transparent_30%),radial-gradient(circle_at_bottom_right,#0f766e,transparent_25%),#020617] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/30">
              <Sparkles className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <div className="text-lg font-semibold">Affinity</div>
              <div className="text-xs text-slate-400">
                Publish thoughts, not profiles
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="rounded-2xl text-slate-200 hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              onClick={onStart}
              className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
            >
              Get Started
            </Button>
          </div>
        </header>

        <section className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className="mb-5 rounded-full bg-white/10 text-slate-200 hover:bg-white/10">
              Thought-based social graph
            </Badge>

            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl">
              Publish thoughts, not profiles.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Write honestly. We place your dot in a shared semantic space, so
              you can discover people who see the world like you do.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                onClick={onStart}
                size="lg"
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
              >
                Start Writing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                Explore the Space
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Write', desc: 'Share a few honest thoughts.' },
                { title: 'Position', desc: 'Your language shapes your place.' },
                { title: 'Discover', desc: 'Find nearby minds and clusters.' }
              ].map((item) => (
                <Card
                  key={item.title}
                  className="rounded-3xl border-white/10 bg-white/5 text-slate-100"
                >
                  <CardContent className="p-5">
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-2 text-sm text-slate-400">{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-white/5 blur-3xl" />

            <Card className="overflow-hidden rounded-[32px] border-white/10 bg-white/5 text-slate-100 shadow-2xl backdrop-blur">
              <CardContent className="p-0">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[520px] border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
                    {[...Array(22)].map((_, i) => {
                      const left = `${10 + ((i * 17) % 75)}%`;
                      const top = `${8 + ((i * 23) % 80)}%`;
                      const size = 8 + (i % 4) * 4;

                      return (
                        <motion.div
                          key={i}
                          className={cn(
                            'absolute rounded-full',
                            i % 5 === 0
                              ? 'bg-violet-300/90'
                              : i % 3 === 0
                                ? 'bg-teal-300/80'
                                : 'bg-white/70'
                          )}
                          style={{ left, top, width: size, height: size }}
                          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                          transition={{
                            duration: 3 + (i % 5),
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                      );
                    })}

                    <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                      <div className="mb-2 text-sm text-slate-400">
                        Hovered thought
                      </div>
                      <p className="text-sm leading-6 text-slate-200">
                        “I think the need to be known is stronger than the need to
                        be impressive.”
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <div className="text-sm text-slate-400">
                        Example thoughts
                      </div>
                      <div className="mt-3 space-y-3">
                        {starterThoughts.slice(0, 3).map((thought) => (
                          <div
                            key={thought}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                          >
                            {thought}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                      <div className="text-sm font-medium text-violet-200">
                        Current cluster
                      </div>
                      <div className="mt-2 text-sm text-slate-300">
                        Reflective, emotionally precise, open to ambiguity.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}