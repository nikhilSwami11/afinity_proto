'use client';

import { useState, useEffect } from 'react';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { listMyThoughts } from '@/lib/api/thoughts';
import { useRightPanel } from '@/lib/right-panel-context';
import type { ThoughtResponse } from '@/types/thought';
import type { UserPosition } from './prototype-app';
import ThoughtCard from './thought-card';
import WriteModal from './write-modal';
import { NearbyMindsPanel, SelectedUserPanel, type SeedUser } from './nearby-minds-panel';

const API = 'http://localhost:8000/api/v1';

function euclidean(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

type WritePageProps = {
  onPositionUpdate?: (pos: { x: number; y: number }) => void;
  userPosition?: UserPosition;
};

export default function WritePage({ onPositionUpdate, userPosition }: WritePageProps) {
  const [writeOpen, setWriteOpen] = useState(false);
  const [editThought, setEditThought] = useState<ThoughtResponse | undefined>();
  const [thoughts, setThoughts] = useState<ThoughtResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeds, setSeeds] = useState<SeedUser[]>([]);
  const [seedsLoading, setSeedsLoading] = useState(true);
  const [selected, setSelected] = useState<SeedUser | null>(null);
  const { setRightPanel } = useRightPanel();

  async function fetchThoughts() {
    try {
const data = await listMyThoughts();
      setThoughts(data);
    } catch {
      // silently fail for now
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchThoughts();
    fetch(`${API}/map/users`)
      .then((r) => r.json())
      .then((data) => { setSeeds(data); setSeedsLoading(false); })
      .catch(() => setSeedsLoading(false));
  }, []);

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

  const panelUsers = seeds.filter((s) => nearestIds.has(s.id)).length > 0
    ? seeds.filter((s) => nearestIds.has(s.id))
    : seeds.slice(0, 3);

  useEffect(() => {
    if (selected) {
      setRightPanel(
        <SelectedUserPanel
          user={selected}
          isNearest={nearestIds.has(selected.id)}
          onClose={() => setSelected(null)}
        />
      );
    } else {
      setRightPanel(<NearbyMindsPanel users={panelUsers} loading={seedsLoading} onSelect={setSelected} />);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, seeds, seedsLoading, userPosition, setRightPanel]);

  useEffect(() => {
    return () => setRightPanel(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn('h-24 animate-pulse rounded-[28px]', t.inner)}
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        ) : thoughts.length > 0 ? (
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
        onPositionUpdate={onPositionUpdate}
        editThought={editThought}
      />
    </>
  );
}
