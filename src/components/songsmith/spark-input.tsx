'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SparkInputProps {
  onSubmit: (spark: string) => Promise<void>;
  isLoading?: boolean;
}

export function SparkInput({ onSubmit, isLoading = false }: SparkInputProps) {
  const [spark, setSpark] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spark.trim() || isLoading) return;
    await onSubmit(spark.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spark">What&apos;s your song idea?</Label>
        <Textarea
          id="spark"
          value={spark}
          onChange={(e) => setSpark(e.target.value)}
          placeholder="An emotion, a situation, an image, a phrase that caught your attention..."
          className="min-h-[120px] resize-none"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          This is your starting point. It can be anything: a feeling, a moment, a question, a line you overheard.
        </p>
      </div>
      <Button type="submit" disabled={!spark.trim() || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating session...
          </>
        ) : (
          'Start Writing'
        )}
      </Button>
    </form>
  );
}
