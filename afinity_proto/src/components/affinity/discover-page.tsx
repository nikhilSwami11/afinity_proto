'use client';

import { MessageSquareQuote, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { nearbyUsers, starterThoughts } from './data';

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Discover</h1>
          <p className="mt-2 text-slate-400">
            Explore nearby and distant ways of seeing the world.
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-slate-100 placeholder:text-slate-500"
            placeholder="Search users or themes"
          />
        </div>
      </div>

      <Tabs defaultValue="near" className="space-y-6">
        <TabsList className="rounded-2xl bg-white/5">
          <TabsTrigger value="near" className="rounded-xl">
            Near you
          </TabsTrigger>
          <TabsTrigger value="different" className="rounded-xl">
            Different from you
          </TabsTrigger>
          <TabsTrigger value="clusters" className="rounded-xl">
            Emerging clusters
          </TabsTrigger>
          <TabsTrigger value="recent" className="rounded-xl">
            Recent thoughts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="near">
          <div className="grid gap-4 lg:grid-cols-2">
            {nearbyUsers.map((user) => (
              <Card
                key={user.id}
                className="rounded-[28px] border-white/10 bg-white/5 text-slate-100"
              >
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium">{user.name}</div>
                      <div className="text-sm text-slate-400">
                        {user.closeness}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                    >
                      View profile
                    </Button>
                  </div>

                  <p className="text-slate-300">{user.excerpt}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.themes.map((theme) => (
                      <Badge
                        key={theme}
                        className="rounded-full bg-violet-500/15 text-violet-200 hover:bg-violet-500/15"
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="different">
          <Card className="rounded-[28px] border-white/10 bg-white/5 text-slate-100">
            <CardContent className="p-6 text-slate-300">
              Users here would surface people whose writing is meaningfully far
              from yours.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters">
          <div className="grid gap-4 md:grid-cols-3">
            {['Belonging & Identity', 'Truth & Ambiguity', 'Love & Distance'].map(
              (cluster) => (
                <Card
                  key={cluster}
                  className="rounded-[28px] border-white/10 bg-white/5 text-slate-100"
                >
                  <CardContent className="p-6">
                    <div className="text-lg font-medium">{cluster}</div>
                    <p className="mt-2 text-sm text-slate-400">
                      An emerging semantic neighborhood built from recent writing.
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4">
            {starterThoughts.map((thought) => (
              <Card
                key={thought}
                className="rounded-[28px] border-white/10 bg-white/5 text-slate-100"
              >
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                    <MessageSquareQuote className="h-4 w-4" /> Recent thought
                  </div>
                  <p className="text-slate-200">{thought}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}