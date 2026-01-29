'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenLine, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session } from '@/types/songsmith';

interface SessionCardProps {
  session: Session;
  className?: string;
}

export function SessionCard({ session, className }: SessionCardProps) {
  const statusColors = {
    active: 'bg-teal/10 text-teal border-teal/20',
    completed: 'bg-green-500/10 text-green-600 border-green-500/20',
    archived: 'bg-muted text-muted-foreground border-muted',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/app/sessions/${session.id}`}>
      <Card
        className={cn(
          'hover:border-teal/50 transition-colors cursor-pointer',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-md bg-muted shrink-0">
                <PenLine className="h-4 w-4 text-teal" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium truncate">
                  {session.title || 'Untitled'}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {session.spark}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn('shrink-0', statusColors[session.status])}>
              {session.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(session.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
