'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { AppPage } from './app-shell';

type HomePageProps = {
  onNavigate: (page: AppPage) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [writeOpen, setWriteOpen] = useState(false);
  const [mode, setMode] = useState('prompted');
  const [text, setText] = useState('');
  const prompt = 'What are you willing to sacrifice for, and what are you not?';

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
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardContent className="p-4">
            <button
              onClick={() => setWriteOpen(true)}
              className="flex w-full items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-medium text-violet-300 ring-1 ring-violet-400/30">
                Y
              </div>
              <div className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-400 transition hover:bg-white/10">
                Add another thought to sharpen your place in the space.
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Semantic space map */}
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Semantic space</CardTitle>
            <CardDescription className="text-slate-400">
              A 2D view of where you sit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617]">
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
      </div>

      {/* Write modal */}
      <AnimatePresence>
        {writeOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setWriteOpen(false)}
            />

            {/* Modal card */}
            <motion.div
              className="relative z-10 w-full max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-[32px] border-white/10 bg-slate-900 text-slate-100 shadow-2xl">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-2xl">Write</CardTitle>
                    <CardDescription className="text-slate-400">
                      A quiet place to publish a raw thought.
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setWriteOpen(false)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs value={mode} onValueChange={setMode}>
                    <TabsList className="rounded-2xl bg-white/5">
                      <TabsTrigger value="prompted" className="rounded-xl">
                        Prompted
                      </TabsTrigger>
                      <TabsTrigger value="free" className="rounded-xl">
                        Free write
                      </TabsTrigger>
                      <TabsTrigger value="short" className="rounded-xl">
                        Short thought
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="prompted" className="mt-6 space-y-4">
                      <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5">
                        <div className="mb-2 text-sm text-violet-200">Prompt</div>
                        <div className="text-lg">{prompt}</div>
                      </div>
                    </TabsContent>

                    <TabsContent value="free" className="mt-6">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                        Write anything that feels true right now.
                      </div>
                    </TabsContent>

                    <TabsContent value="short" className="mt-6">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                        One sharp thought is enough.
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-wrap gap-2">
                    {['Belief', 'Doubt', 'Memory', 'Question', 'Contradiction', 'Change'].map(
                      (chip) => (
                        <Badge
                          key={chip}
                          className="rounded-full bg-white/10 px-3 py-1 text-slate-200 hover:bg-white/10"
                        >
                          {chip}
                        </Badge>
                      )
                    )}
                  </div>

                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start with the sentence you would least likely post anywhere else."
                    className="min-h-[200px] rounded-[28px] border-white/10 bg-white/5 p-5 text-base leading-7 text-slate-100 placeholder:text-slate-500"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/15">
                        Public
                      </Badge>
                      <span className="text-sm text-slate-400">
                        Visible in the shared space
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setWriteOpen(false)}
                        className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                      >
                        Save draft
                      </Button>
                      <Button
                        onClick={() => setWriteOpen(false)}
                        className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
                      >
                        Publish thought
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
