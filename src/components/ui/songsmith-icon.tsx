import { cn } from '@/lib/utils';

interface SongsmithIconProps {
  className?: string;
}

export function SongsmithIcon({ className }: SongsmithIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6 text-teal', className)}
    >
      {/* Pen/quill */}
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      {/* Musical note accent */}
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <path d="M8 18V12" />
    </svg>
  );
}
