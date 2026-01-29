import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const EARLY_BIRD_LIMIT = 25;

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const claim = searchParams.get('claim');
  const emailUpdates = searchParams.get('email_updates') === '1';
  const next = searchParams.get('next') ?? '/app';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Send notification for new Magic Link signups (not Google OAuth or returning users)
          const provider = user.app_metadata?.provider;
          if (provider === 'email' && process.env.RESEND_API_KEY && process.env.FEEDBACK_EMAIL_TO) {
            const { data: profileForNotif } = await supabase
              .from('profiles')
              .select('display_name, email, created_at')
              .eq('id', user.id)
              .single();

            // Only notify for new users (created within last minute)
            const isNewUser = profileForNotif?.created_at &&
              (new Date().getTime() - new Date(profileForNotif.created_at).getTime()) < 60000;

            if (isNewUser) {
              const resend = new Resend(process.env.RESEND_API_KEY);
              const userName = profileForNotif?.display_name || profileForNotif?.email || user.email || 'Unknown';

              await resend.emails.send({
                from: process.env.FEEDBACK_EMAIL_FROM || 'Songsmith <feedback@send.songsmith.nl>',
                to: process.env.FEEDBACK_EMAIL_TO,
                subject: `✉️ New Magic Link signup: ${userName}`,
                text: `
New user confirmed their account via Magic Link!

User: ${userName}
Email: ${profileForNotif?.email || user.email || 'Not available'}
Time: ${new Date().toISOString()}
                `.trim(),
              }).catch(err => console.error('Failed to send magic link notification:', err));
            }
          }

          // Handle early bird claim
          if (claim === 'earlybird') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('subscription_status, email, display_name')
              .eq('id', user.id)
              .single();

            if (profile?.subscription_status !== 'pro') {
              const { count } = await getAdminClient()
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('is_early_bird', true);

              const claimed = count || 0;

              if (claimed < EARLY_BIRD_LIMIT) {
                await getAdminClient()
                  .from('profiles')
                  .update({
                    subscription_status: 'pro',
                    is_early_bird: true,
                  })
                  .eq('id', user.id);

                if (process.env.RESEND_API_KEY && process.env.FEEDBACK_EMAIL_TO) {
                  const newClaimed = claimed + 1;
                  const remaining = Math.max(0, EARLY_BIRD_LIMIT - newClaimed);
                  const resend = new Resend(process.env.RESEND_API_KEY);
                  const userName = profile?.display_name || profile?.email || user.email || 'Unknown';

                  await resend.emails.send({
                    from: process.env.FEEDBACK_EMAIL_FROM || 'Songsmith <feedback@send.songsmith.nl>',
                    to: process.env.FEEDBACK_EMAIL_TO,
                    subject: `🐦 Early Bird claimed: ${userName}`,
                    text: `
New Early Bird Pro claim on Songsmith!

User: ${userName}
Email: ${profile?.email || user.email || 'Not available'}
Spot: ${newClaimed} of ${EARLY_BIRD_LIMIT}
Remaining: ${remaining}
Claimed at: ${new Date().toISOString()}
                    `.trim(),
                  });
                }
              }
            }
          }

          // Handle email updates opt-in
          if (emailUpdates) {
            await supabase
              .from('profiles')
              .update({ email_updates_opt_in: true })
              .eq('id', user.id);
          }
        }
      } catch (err) {
        console.error('Profile update error:', err);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
