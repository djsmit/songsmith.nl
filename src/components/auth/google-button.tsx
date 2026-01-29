'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface GoogleButtonProps {
  claim?: string;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton({ claim }: GoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'opening' | 'signing-in'>('idle');
  const router = useRouter();
  const supabase = createClient();

  const handleCredentialResponse = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      setLoadingState('signing-in');
      try {
        const { error: signInError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (signInError) {
          setError(signInError.message);
          setLoadingState('idle');
          return;
        }

        if (claim === 'earlybird') {
          try {
            await fetch('/api/earlybird/claim', { method: 'POST' });
          } catch {
            // Earlybird claim failure is not critical - user still signed in
          }
        }

        router.push('/app');
      } catch {
        setError('Failed to sign in with Google');
        setLoadingState('idle');
      }
    },
    [claim, router, supabase.auth]
  );

  const handleButtonClick = () => {
    setLoadingState('opening');
    // Reset loading after a timeout in case popup is closed without completing
    setTimeout(() => {
      setLoadingState((current) => current === 'opening' ? 'idle' : current);
    }, 30000);
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current || initializedRef.current) return;

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id || !buttonRef.current || initializedRef.current) return;

      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        use_fedcm_for_prompt: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
      });
    };

    // Check if script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    script.onerror = () => setError('Failed to load Google Sign-In');
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [handleCredentialResponse]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="text-sm text-destructive text-center">
        Google Client ID not configured
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive text-center">{error}</div>
    );
  }

  const isLoading = loadingState !== 'idle';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={buttonRef}
        onClick={handleButtonClick}
        className={isLoading ? 'pointer-events-none opacity-50' : ''}
      />
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {loadingState === 'signing-in'
              ? 'Signing in with Google...'
              : 'Opening Google sign-in...'}
          </span>
        </div>
      )}
    </div>
  );
}
