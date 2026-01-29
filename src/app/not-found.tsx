import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4 text-center">
        <Logo size="xl" className="justify-center" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">
            This page doesn&apos;t exist.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
