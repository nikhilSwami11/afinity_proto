'use client';

import { useState } from 'react';
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

export default function WritePage() {
  const [mode, setMode] = useState('prompted');
  const [text, setText] = useState('');
  const prompt = 'What are you willing to sacrifice for, and what are you not?';

  return (
    <div className="space-y-6">
      <Card className={t.card}>
        <CardHeader>
          <CardTitle className={cn('text-3xl', t.fg)}>Write</CardTitle>
          <CardDescription className={t.fgMuted}>
            A quiet place to publish a raw thought.
          </CardDescription>
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

            <TabsContent value="prompted" className="mt-6 space-y-4">
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
              'min-h-[320px] rounded-[28px] p-5 text-base leading-7',
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
              <Button variant="outline" className={t.btnOutline}>
                Save draft
              </Button>
              <Button className={t.btnPrimary}>Publish thought</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
