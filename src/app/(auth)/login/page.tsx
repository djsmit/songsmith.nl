import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const metadata = {
  title: 'Sign In - Songsmith',
  description: 'Sign in to Songsmith to start writing your next song.',
};

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  searchParams: Promise<{ claim?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { claim } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="xl" />
          <p className="text-muted-foreground">
            {claim === 'earlybird'
              ? 'Join Early Bird'
              : 'Finish more songs'}
          </p>
        </div>
        <AuthForm claim={claim} />
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
