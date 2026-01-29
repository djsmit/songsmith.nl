import { LandingShell } from "@/components/landing/landing-shell";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Terms of Service - Songsmith",
  description:
    "Terms of Service for Songsmith - the rules and guidelines for using the service.",
};

export default function TermsPage() {
  return (
    <LandingShell>
      <LandingHeader showBackLink showAuthButtons={false} />

      <main className="flex-1 py-8 md:py-12 lg:py-16 xl:py-20 mt-16 md:mt-20">
        <div className="container mx-auto px-4 lg:max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-teal prose-a:no-underline hover:prose-a:underline">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Songsmith, a service operated by Dear John
              Music, you agree to be bound by these Terms of Service. If you do
              not agree to these terms, please do not use the service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Songsmith is a web application that allows musicians to manage
              their songs (lyrics and chords) and organize setlists. The service
              includes features such as:
            </p>
            <ul>
              <li>Creating and storing song chord sheets</li>
              <li>Organizing songs into setlists</li>
              <li>Transposing chords to different keys</li>
              <li>Accessing your content across multiple devices</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To use Songsmith, you must create an account. You are responsible
              for:
            </p>
            <ul>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying me immediately of any unauthorized access</li>
            </ul>
            <p>
              You must provide accurate and complete information when creating
              your account.
            </p>

            <h2>4. Your Content</h2>
            <p>
              <strong>Ownership:</strong> You retain full ownership of all
              songs, lyrics, chords, and other content you create or upload to
              Songsmith. I do not claim any intellectual property rights over
              your content.
            </p>
            <p>
              <strong>License to Me:</strong> By using Songsmith, you grant me a
              limited license to store, display, and transmit your content
              solely to provide the service to you.
            </p>
            <p>
              <strong>Responsibility:</strong> You are responsible for ensuring
              you have the right to use any content you upload, including lyrics
              and chord arrangements that may be subject to copyright.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use Songsmith to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>
                Upload malicious code or attempt to compromise the systems
              </li>
              <li>Share your account credentials with others</li>
              <li>
                Use automated systems to access the service without permission
              </li>
            </ul>

            <h2>6. Subscription and Payments</h2>
            <p>
              Songsmith offers both free and paid subscription plans. For paid
              plans:
            </p>
            <ul>
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>
                You may cancel your subscription at any time through your
                account settings
              </li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>

            <h2>7. Service Availability</h2>
            <p>
              I strive to keep Songsmith available at all times, but I do not
              guarantee uninterrupted access. The service may be temporarily
              unavailable due to maintenance, updates, or circumstances beyond
              my control.
            </p>
            <p>
              I reserve the right to modify, suspend, or discontinue any part of
              the service with reasonable notice.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Dear John Music and
              Songsmith shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use of the service.
            </p>
            <p>
              I am not responsible for any loss of data, although I take
              reasonable measures to protect your content. I recommend keeping
              backups of important material.
            </p>

            <h2>9. Account Termination</h2>
            <p>
              You may delete your account at any time through your account
              settings. I may also terminate or suspend your account if you
              violate these terms.
            </p>
            <p>
              Upon termination, your right to use the service will cease
              immediately, and I may delete your account data in accordance with
              the Privacy Policy.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              I may update these Terms of Service from time to time. I&apos;ll
              notify you of significant changes by posting a notice on the
              website or sending you an email. Your continued use of the service
              after changes become effective constitutes acceptance of the
              updated terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles.
            </p>

            <h2 id="early-bird">12. Early Bird Pro Terms</h2>
            <p>
              Early Bird Pro access is granted to the first 25 users during the
              early access phase. This includes:
            </p>
            <ul>
              <li>All Pro features at no cost, for life</li>
              <li>Priority support and direct feedback channel</li>
            </ul>
            <p>
              <strong>Activity requirement:</strong> Accounts with no meaningful
              activity for 12 consecutive months may lose Early Bird status.
              Meaningful activity includes: logging in, creating or editing
              songs, building setlists, or exporting data.
            </p>
            <p>We&apos;ll always notify you before any status change.</p>

            <h2>13. Contact Me</h2>
            <p>
              Songsmith is operated by Dear John Music. If you have any questions
              about these Terms of Service, please contact me at{" "}
              <a href="mailto:songsmith@dearjohnmusic.nl">
                songsmith@dearjohnmusic.nl
              </a>
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
