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

export default function WritePage() {
  const [mode, setMode] = useState('prompted');
  const [text, setText] = useState('');
  const prompt = 'What are you willing to sacrifice for, and what are you not?';

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
        <CardHeader>
          <CardTitle className="text-3xl">Write</CardTitle>
          <CardDescription className="text-slate-400">
            A quiet place to publish a raw thought.
          </CardDescription>
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
            className="min-h-[320px] rounded-[28px] border-white/10 bg-white/5 p-5 text-base leading-7 text-slate-100 placeholder:text-slate-500"
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
                className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                Save draft
              </Button>
              <Button className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200">
                Publish thought
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}