'use client';

import { useState } from 'react';
import { Globe, Lock, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { deleteThought } from '@/lib/api/thoughts';
import type { ThoughtResponse } from '@/types/thought';

type ThoughtCardProps = {
  thought: ThoughtResponse;
  onEdit?: (thought: ThoughtResponse) => void;
  onDelete?: (id: number) => void;
};

export default function ThoughtCard({ thought, onEdit, onDelete }: ThoughtCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const date = new Date(thought.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const time = new Date(thought.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isPublic = thought.visibility === 'public';
  const isDraft = thought.status === 'draft';

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteThought(thought.id);
      setConfirmOpen(false);
      onDelete?.(thought.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Card className={cn(t.card, 'group transition-all duration-200 hover:border-app-violet-line')}>
        <CardContent className="px-4 py-1">

          {/* Header */}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-violet text-sm font-semibold text-app-violet-fg ring-1 ring-app-violet-line">
              Y
            </div>
            <div className="flex flex-col">
              <span className={cn('text-sm font-medium', t.fg)}>You</span>
              <span className={cn('flex items-center gap-1 text-xs', t.fgMuted)}>
                {isPublic ? <><Globe className="h-3 w-3" />Public</> : <><Lock className="h-3 w-3" />Private</>}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {isDraft && <Badge className={cn(t.badge, 'mr-2')}>Draft</Badge>}
              <button
                className={cn('rounded-xl p-2 transition hover:bg-app-surface-hover', t.fgMuted)}
                onClick={() => onEdit?.(thought)}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className={cn('rounded-xl p-2 transition hover:bg-app-surface-hover hover:text-red-400', t.fgMuted)}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Prompt as question */}
          {thought.prompt_source && (
            <p className={cn('mb-2 text-sm', t.fgMuted)}>{thought.prompt_source}</p>
          )}

          <p className={cn('text-base leading-7', t.fg)}>{thought.content}</p>

          {/* Footer */}
          <div className={cn('mt-1 text-right text-xs', t.fgMuted)}>
            {date} · {time}
          </div>

        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className={t.modalBackdrop} onClick={() => setConfirmOpen(false)} />
            <motion.div
              className="relative z-10 w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <Card className={t.cardModal}>
                <CardContent className="p-6">
                  <h2 className={cn('mb-2 text-lg font-semibold', t.fg)}>Delete thought?</h2>
                  <p className={cn('mb-6 text-sm', t.fgMuted)}>
                    This can't be undone. Your thought will be permanently removed.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className={t.btnOutline}
                      onClick={() => setConfirmOpen(false)}
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-2xl bg-red-500 text-white hover:bg-red-600"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
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
