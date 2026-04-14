'use client';

import { useState, useEffect } from 'react';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { listMyThoughts } from '@/lib/api/thoughts';
import type { ThoughtResponse } from '@/types/thought';
import ThoughtCard from './thought-card';
import WriteModal from './write-modal';

export default function WritePage() {
  const [writeOpen, setWriteOpen] = useState(false);
  const [editThought, setEditThought] = useState<ThoughtResponse | undefined>();
  const [thoughts, setThoughts] = useState<ThoughtResponse[]>([]);

  async function fetchThoughts() {
    try {
      const data = await listMyThoughts();
      setThoughts(data);
    } catch {
      // silently fail for now
    }
  }

  useEffect(() => {
    fetchThoughts();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Compact post bar — only show when there are thoughts */}
        {thoughts.length > 0 && (
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
                  What's on your mind?
                </div>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Thoughts list */}
        {thoughts.length > 0 ? (
          <div className="space-y-2">
            {thoughts.map((thought) => (
              <ThoughtCard
                key={thought.id}
                thought={thought}
                onEdit={(t) => { setEditThought(t); setWriteOpen(true); }}
                onDelete={(id) => setThoughts((prev) => prev.filter((t) => t.id !== id))}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <PenSquare className={cn('h-10 w-10', t.fgMuted)} />
            <p className={cn('text-lg font-medium', t.fg)}>No thoughts yet</p>
            <p className={cn('text-sm', t.fgMuted)}>
              Publish your first thought to see it here.
            </p>
            <Button className={cn(t.btnPrimary, 'w-48')} onClick={() => setWriteOpen(true)}>
              Write
            </Button>
          </div>
        )}
      </div>

      <WriteModal
        open={writeOpen}
        onClose={() => { setWriteOpen(false); setEditThought(undefined); }}
        onSuccess={fetchThoughts}
        editThought={editThought}
      />
    </>
  );
}
