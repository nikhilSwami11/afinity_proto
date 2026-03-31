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
import { t } from '@/lib/tokens';
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
            <motion.div
              className={t.modalBackdrop}
              onClick={() => setWriteOpen(false)}
            />

            <motion.div
              className="relative z-10 w-full max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={t.cardModal}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className={cn('text-2xl', t.fg)}>Write</CardTitle>
                    <CardDescription className={t.fgMuted}>
                      A quiet place to publish a raw thought.
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setWriteOpen(false)}
                    className={cn('rounded-xl p-2 transition hover:bg-app-surface-hover', t.fgMuted)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs value={mode} onValueChange={setMode}>
                    <TabsList className={t.tabList}>
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

                    <TabsContent value="prompted" className="mt-6">
                      <div className={cn('p-5', t.accentCard)}>
                        <div className={cn('mb-2 text-sm', 'text-app-violet-fg')}>
                          Prompt
                        </div>
                        <div className={cn('text-lg', t.fg)}>{prompt}</div>
                      </div>
                    </TabsContent>

                    <TabsContent value="free" className="mt-6">
                      <div className={cn('p-5', t.innerLg, t.fgSoft)}>
                        Write anything that feels true right now.
                      </div>
                    </TabsContent>

                    <TabsContent value="short" className="mt-6">
                      <div className={cn('p-5', t.innerLg, t.fgSoft)}>
                        One sharp thought is enough.
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-wrap gap-2">
                    {['Belief', 'Doubt', 'Memory', 'Question', 'Contradiction', 'Change'].map(
                      (chip) => (
                        <Badge key={chip} className={t.badge}>
                          {chip}
                        </Badge>
                      )
                    )}
                  </div>

                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start with the sentence you would least likely post anywhere else."
                    className={cn(
                      'min-h-[200px] rounded-[28px] p-5 text-base leading-7',
                      t.input
                    )}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className={t.badgeOk}>Public</Badge>
                      <span className={cn('text-sm', t.fgMuted)}>
                        Visible in the shared space
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setWriteOpen(false)}
                        className={t.btnOutline}
                      >
                        Save draft
                      </Button>
                      <Button
                        onClick={() => setWriteOpen(false)}
                        className={t.btnPrimary}
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
