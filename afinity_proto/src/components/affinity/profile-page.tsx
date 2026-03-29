'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mockProfileThoughts } from './data';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
        <CardContent className="grid gap-6 p-7 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            <Badge className="mb-4 rounded-full bg-white/10 text-slate-200 hover:bg-white/10">
              Thought profile
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Satyam</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Drawn to honesty, contradiction, emotional clarity, and difficult
              questions that don’t resolve cleanly.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {['identity', 'truth', 'belonging', 'ambiguity', 'trust'].map(
                (tag) => (
                  <Badge
                    key={tag}
                    className="rounded-full bg-violet-500/15 text-violet-200 hover:bg-violet-500/15"
                  >
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm text-slate-400">Mini map</div>
            <div className="relative h-48 rounded-2xl bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_25%),#020617]">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute rounded-full',
                    i === 6 ? 'bg-white' : 'bg-white/55'
                  )}
                  style={{
                    left: `${8 + ((i * 14) % 80)}%`,
                    top: `${10 + ((i * 19) % 72)}%`,
                    width: i === 6 ? 14 : 7,
                    height: i === 6 ? 14 : 7
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Published thoughts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {mockProfileThoughts.map((thought) => (
              <div
                key={thought}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-slate-200"
              >
                {thought}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
            <CardHeader>
              <CardTitle>Recurring themes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['belonging', 'truth', 'identity', 'love', 'distance', 'change'].map(
                (t) => (
                  <Badge
                    key={t}
                    className="rounded-full bg-white/10 text-slate-200 hover:bg-white/10"
                  >
                    {t}
                  </Badge>
                )
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
            <CardHeader>
              <CardTitle>Questions I keep returning to</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                What does honesty look like when kindness matters too?
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Why is being understood harder than being admired?
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}