'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { nearbyUsers } from './data';
import type { AppPage } from './app-shell';

type HomePageProps = {
  onNavigate: (page: AppPage) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardContent className="p-7">
            <Badge className="mb-4 rounded-full bg-white/10 text-slate-200 hover:bg-white/10">
              Your signal is still forming
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              Add another thought to sharpen your place in the space.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Your recent writing suggests depth, emotional precision, and
              openness to ambiguity. More writing will make your neighborhood
              clearer.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => onNavigate('write')}
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
              >
                Write now
              </Button>
              <Button
                onClick={() => onNavigate('map')}
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                Open map
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Recent movement</CardTitle>
            <CardDescription className="text-slate-400">
              How your position is changing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Your last thought pulled you closer to 8 people writing about
              identity and trust.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              A new cluster is forming around ambiguity, honesty, and selfhood.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Your writing style appears more emotionally precise than 72% of
              nearby users.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100 xl:col-span-2">
          <CardHeader>
            <CardTitle>Suggested prompts</CardTitle>
            <CardDescription className="text-slate-400">
              Ways to deepen your signal
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              'Write about a belief you rarely share.',
              'Write about something that changed your mind.',
              'Write about what makes you feel understood.',
              'Write about a contradiction you live with.'
            ].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate('write')}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
              >
                <div className="text-base font-medium">{item}</div>
                <div className="mt-2 text-sm text-slate-400">
                  Open in writing mode
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
          <CardHeader>
            <CardTitle>Nearby minds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearbyUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  <Badge className="bg-white/10 text-slate-200 hover:bg-white/10">
                    {user.closeness}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{user.excerpt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}