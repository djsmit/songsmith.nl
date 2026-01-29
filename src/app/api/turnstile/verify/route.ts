import { NextRequest, NextResponse } from 'next/server';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(request: NextRequest) {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return NextResponse.json(
      { success: false, error: 'Captcha not configured' },
      { status: 500 }
    );
  }

  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    );

    const data: TurnstileVerifyResponse = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Turnstile verification failed:', data['error-codes']);
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification error' },
      { status: 500 }
    );
  }
}
