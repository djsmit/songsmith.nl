'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  /** Duration in seconds */
  duration: number;
  /** Called when timer completes */
  onComplete?: () => void;
  /** Called with elapsed seconds on tick */
  onTick?: (elapsed: number) => void;
  className?: string;
}

export function Timer({ duration, onComplete, onTick, className }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const elapsed = duration - timeRemaining;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        onTick?.(duration - next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, duration, onComplete, onTick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setHasStarted(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(duration);
    setHasStarted(false);
  }, [duration]);

  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative">
        {/* Progress ring */}
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <circle
            className="stroke-muted"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="stroke-teal transition-all duration-1000"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${progress}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-medium">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {isRunning ? (
          <Button size="sm" variant="outline" onClick={handlePause}>
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleStart} disabled={timeRemaining === 0}>
            <Play className="h-4 w-4" />
          </Button>
        )}
        {hasStarted && (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasStarted && (
        <span className="text-sm text-muted-foreground">
          {formatTime(elapsed)} written
        </span>
      )}
    </div>
  );
}
