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
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { nearbyUsers, starterThoughts } from './data';

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={cn('text-3xl font-semibold tracking-tight', t.fg)}>
            Discover
          </h1>
          <p className={cn('mt-2', t.fgMuted)}>
            Explore nearby and distant ways of seeing the world.
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className={cn('pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2', t.fgDim)} />
          <Input
            className={cn('h-12 rounded-2xl pl-11', t.input)}
            placeholder="Search users or themes"
          />
        </div>
      </div>

      <Tabs defaultValue="near" className="space-y-6">
        <TabsList className={t.tabList}>
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
              <Card key={user.id} className={t.cardSm}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className={cn('text-lg font-medium', t.fg)}>
                        {user.name}
                      </div>
                      <div className={cn('text-sm', t.fgMuted)}>
                        {user.closeness}
                      </div>
                    </div>
                    <Button variant="outline" className={t.btnOutline}>
                      View profile
                    </Button>
                  </div>

                  <p className={t.fgSoft}>{user.excerpt}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.themes.map((theme) => (
                      <Badge key={theme} className={t.badgeAccent}>
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
          <Card className={t.cardSm}>
            <CardContent className={cn('p-6', t.fgSoft)}>
              Users here would surface people whose writing is meaningfully far
              from yours.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters">
          <div className="grid gap-4 md:grid-cols-3">
            {['Belonging & Identity', 'Truth & Ambiguity', 'Love & Distance'].map(
              (cluster) => (
                <Card key={cluster} className={t.cardSm}>
                  <CardContent className="p-6">
                    <div className={cn('text-lg font-medium', t.fg)}>
                      {cluster}
                    </div>
                    <p className={cn('mt-2 text-sm', t.fgMuted)}>
                      An emerging semantic neighborhood built from recent
                      writing.
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
              <Card key={thought} className={t.cardSm}>
                <CardContent className="p-6">
                  <div className={cn('mb-2 flex items-center gap-2 text-sm', t.fgMuted)}>
                    <MessageSquareQuote className="h-4 w-4" /> Recent thought
                  </div>
                  <p className={t.fg}>{thought}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
