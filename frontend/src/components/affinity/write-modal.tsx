'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
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
import { createThought, updateThought } from '@/lib/api/thoughts';
import type { ThoughtResponse } from '@/types/thought';

type WriteModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editThought?: ThoughtResponse;
};

const PROMPT = 'What are you willing to sacrifice for, and what are you not?';

export default function WriteModal({ open, onClose, onSuccess, editThought }: WriteModalProps) {
  const isEditing = !!editThought;
  const [mode, setMode] = useState(() =>
    editThought?.prompt_source ? 'prompted' : 'free'
  );
  const [text, setText] = useState(editThought?.content ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setText(editThought?.content ?? '');
    setMode(editThought?.prompt_source ? 'prompted' : 'free');
  }, [editThought]);

  async function handleSubmit(status: 'draft' | 'published', visibility: 'public' | 'private') {
    if (!text.trim()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await updateThought(editThought.id, { content: text, status, visibility });
      } else {
        await createThought({
          content: text,
          status,
          visibility,
          prompt_source: mode === 'prompted' ? PROMPT : undefined,
        });
      }
      setText('');
      onClose();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className={t.modalBackdrop} onClick={onClose} />

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
                  <CardTitle className={cn('text-2xl', t.fg)}>{isEditing ? 'Edit thought' : 'Write'}</CardTitle>
                  <CardDescription className={t.fgMuted}>
                    {isEditing ? 'Update your thought.' : 'A quiet place to publish a raw thought.'}
                  </CardDescription>
                </div>
                <button
                  onClick={onClose}
                  className={cn('rounded-xl p-2 transition hover:bg-app-surface-hover', t.fgMuted)}
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={mode} onValueChange={setMode}>
                  <TabsList className={t.tabList}>
                    <TabsTrigger value="prompted" className="rounded-xl">Prompted</TabsTrigger>
                    <TabsTrigger value="free" className="rounded-xl">Free write</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompted" className="mt-5">
                    <p className="text-sm text-app-violet-fg">{PROMPT}</p>
                  </TabsContent>

                  <TabsContent value="free" className="mt-5">
                    <p className={cn('text-sm', t.fgMuted)}>Write anything that feels true right now.</p>
                  </TabsContent>
                </Tabs>

                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start with the sentence you would least likely post anywhere else."
                  className={cn('min-h-[200px] rounded-[28px] p-5 !text-lg leading-8', t.input)}
                />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className={cn('text-sm', t.fgMuted)}>{text.length} / 5000</span>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className={t.btnOutline}
                      disabled={loading || !text.trim()}
                      onClick={() => handleSubmit('draft', 'private')}
                    >
                      Save draft
                    </Button>
                    <Button
                      className={t.btnPrimary}
                      disabled={loading || !text.trim()}
                      onClick={() => handleSubmit('published', 'public')}
                    >
                      {loading ? 'Saving…' : isEditing ? 'Save changes' : 'Publish thought'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
