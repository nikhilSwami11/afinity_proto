'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { mockProfileThoughts } from './data';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card className={t.card}>
        <CardContent className="grid gap-6 p-7 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            <Badge className={cn('mb-4', t.badge)}>Thought profile</Badge>
            <h1 className={cn('text-4xl font-semibold tracking-tight', t.fg)}>
              Satyam
            </h1>
            <p className={cn('mt-3 max-w-2xl', t.fgSoft)}>
              Drawn to honesty, contradiction, emotional clarity, and difficult
              questions that don't resolve cleanly.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {['identity', 'truth', 'belonging', 'ambiguity', 'trust'].map(
                (tag) => (
                  <Badge key={tag} className={t.badgeAccent}>
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className={cn('p-4', t.innerXl)}>
            <div className={cn('mb-3 text-sm', t.fgMuted)}>Mini map</div>
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
        <Card className={t.card}>
          <CardHeader>
            <CardTitle className={t.fg}>Published thoughts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {mockProfileThoughts.map((thought) => (
              <div key={thought} className={cn('p-5', t.inner, t.fg)}>
                {thought}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={t.card}>
            <CardHeader>
              <CardTitle className={t.fg}>Recurring themes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {['belonging', 'truth', 'identity', 'love', 'distance', 'change'].map(
                (tag) => (
                  <Badge key={tag} className={t.badge}>
                    {tag}
                  </Badge>
                )
              )}
            </CardContent>
          </Card>

          <Card className={t.card}>
            <CardHeader>
              <CardTitle className={t.fg}>Questions I keep returning to</CardTitle>
            </CardHeader>
            <CardContent className={cn('space-y-3', t.fgSoft)}>
              <div className={cn('p-4', t.inner)}>
                What does honesty look like when kindness matters too?
              </div>
              <div className={cn('p-4', t.inner)}>
                Why is being understood harder than being admired?
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
