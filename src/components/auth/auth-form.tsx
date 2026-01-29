"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "./google-button";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface AuthFormProps {
  claim?: string;
}

export function AuthForm({ claim }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const supabase = createClient();

  const verifyTurnstile = async (): Promise<boolean> => {
    if (!TURNSTILE_SITE_KEY) {
      // Skip verification if not configured (development)
      return true;
    }

    if (!turnstileToken) {
      setMessage("Please complete the verification challenge");
      return false;
    }

    try {
      const response = await fetch("/api/turnstile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const data = await response.json();
      if (!data.success) {
        setMessage("Verification failed. Please try again.");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return false;
      }
      return true;
    } catch {
      setMessage("Verification error. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      return false;
    }
  };

  // Build redirect URL with claim parameter
  const getRedirectUrl = () => {
    const params = new URLSearchParams();
    if (claim) params.set("claim", claim);
    const queryString = params.toString();
    return `${window.location.origin}/auth/callback${queryString ? `?${queryString}` : ""}`;
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(false);

    // Verify Turnstile first
    const verified = await verifyTurnstile();
    if (!verified) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage(
        `We sent a sign-in link to ${email}. Check your inbox and spam folder.`,
      );
      setIsSuccess(true);
    }
    setLoading(false);
    // Reset Turnstile for next attempt
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(false);

    // Verify Turnstile first
    const verified = await verifyTurnstile();
    if (!verified) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(
        "Invalid email or password. Use Magic Link to sign in and reset your password in Settings.",
      );
      setIsSuccess(false);
      setLoading(false);
      // Reset Turnstile for next attempt
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } else {
      // Keep loading state while redirecting
      router.push("/app");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton claim={claim} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form
        onSubmit={showPasswordField ? handlePasswordLogin : handleMagicLink}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {showPasswordField && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
        >
          {loading
            ? showPasswordField
              ? "Signing in..."
              : "Sending..."
            : showPasswordField
              ? "Sign In"
              : "Send Magic Link"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setShowPasswordField(!showPasswordField);
            setMessage(null);
            setPassword("");
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          {showPasswordField
            ? "Use Magic Link instead"
            : "Sign in with password"}
        </button>
      </form>

      {message &&
        (isSuccess ? (
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-teal/10 border border-teal/20">
            <p className="text-sm text-center text-foreground">{message}</p>
          </div>
        ) : (
          <p className="text-sm text-center text-destructive">{message}</p>
        ))}

      {TURNSTILE_SITE_KEY && (
        <div className="flex justify-center border-t">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onError={() => {
              setTurnstileToken(null);
              setMessage("Verification failed. Please refresh and try again.");
            }}
            onExpire={() => {
              setTurnstileToken(null);
            }}
            options={{
              theme: "auto",
              size: "invisible",
            }}
          />
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground text-balance">
        By signing up, you agree to our{" "}
        <Link
          href="/terms"
          className="underline hover:text-foreground transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {claim === "earlybird" && (
        <p className="text-xs text-center text-muted-foreground text-balance">
          Free forever for early users who stay active.{" "}
          <Link
            href="/terms#early-bird"
            className="underline hover:text-foreground transition-colors"
          >
            Learn more
          </Link>
        </p>
      )}
    </div>
  );
}
