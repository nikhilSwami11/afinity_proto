'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';

export default function SettingsPage() {
  return (
    <Card className={t.card}>
      <CardContent className={cn('p-8', t.fgSoft)}>
        Settings can hold privacy, appearance, notifications, and publishing
        defaults.
      </CardContent>
    </Card>
  );
}
