'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <Card className="rounded-[32px] border-white/10 bg-white/5 text-slate-100">
      <CardContent className="p-8 text-slate-300">
        Settings can hold privacy, appearance, notifications, and publishing
        defaults.
      </CardContent>
    </Card>
  );
}