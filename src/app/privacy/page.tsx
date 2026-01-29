import { LandingShell } from "@/components/landing/landing-shell";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Privacy Policy - Songsmith",
  description:
    "Privacy Policy for Songsmith - how I collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <LandingShell>
      <LandingHeader showBackLink showAuthButtons={false} />

      <main className="flex-1 py-8 md:py-12 lg:py-16 xl:py-20 mt-16 md:mt-20">
        <div className="container mx-auto px-4 lg:max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-teal prose-a:no-underline hover:prose-a:underline">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Songsmith, a service operated by Dear John Music. I
              respect your privacy and am committed to protecting your personal
              data. This privacy policy explains how I collect, use, and
              safeguard your information when you use Songsmith.
            </p>

            <h2>2. Information I Collect</h2>
            <p>I collect the following types of information:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Your email address and
                display name when you sign up.
              </li>
              <li>
                <strong>Authentication Data:</strong> If you sign in with
                Google, we receive your name, email, and profile picture from
                Google.
              </li>
              <li>
                <strong>User Content:</strong> Songs (lyrics and chords),
                setlists, and any other content you create within Songsmith.
              </li>
              <li>
                <strong>Usage Data:</strong> Basic analytics about how you use
                the service to help us improve it.
              </li>
            </ul>

            <h2>3. How I Use Your Information</h2>
            <p>I use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Songsmith service</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Store and sync your writing sessions across devices</li>
              <li>Communicate with you about service updates and support</li>
              <li>Process payments if you subscribe to a paid plan</li>
            </ul>

            <h2>4. How I Store Your Data</h2>
            <p>
              Your data is stored securely using Supabase, a trusted cloud
              database provider. I implement appropriate technical and
              organizational measures to protect your personal data against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              Your song content is stored with encryption to ensure only you can
              access your lyrics and chords.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>I use the following third-party services:</p>
            <ul>
              <li>
                <strong>Google OAuth:</strong> For secure sign-in with your
                Google account.
              </li>
              <li>
                <strong>Supabase:</strong> For database hosting and
                authentication services.
              </li>
              <li>
                <strong>Stripe:</strong> For processing payments (if you
                subscribe to a paid plan).
              </li>
              <li>
                <strong>Google Tag Manager & Analytics:</strong> For
                understanding how visitors use our website, subject to your
                consent.
              </li>
            </ul>
            <p>
              Each of these services has their own privacy policy governing how
              they handle your data.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>
                Access your personal data at any time through your account
              </li>
              <li>Export your writing sessions</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Update or correct your personal information</li>
            </ul>
            <p>
              To exercise these rights, visit your account settings or contact
              me directly.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              I retain your data for as long as your account is active. If you
              delete your account, I&apos;ll delete all your personal data and
              content within 30 days, except where I&apos;m required to retain
              it for legal purposes.
            </p>

            <h2>8. Cookies and Tracking</h2>
            <p>I use the following types of cookies:</p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required to keep you signed
                in and maintain your session. These cannot be disabled.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use our website. These are only activated if you
                consent.
              </li>
            </ul>
            <p>
              When you first visit Songsmith, you will see a cookie consent
              banner. You can choose to accept or decline analytics cookies.
              Your preference is stored locally and you can change it at any
              time by clearing your browser data.
            </p>
            <p>
              I use Google Tag Manager with Consent Mode v2, which means
              analytics data is only collected after you give your consent. I do
              not use cookies for advertising or share cookie data with third
              parties for advertising purposes.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              I may update this privacy policy from time to time. I&apos;ll
              notify you of any significant changes by posting a notice on the
              website or sending you an email.
            </p>

            <h2>10. Contact Me</h2>
            <p>
              Songsmith is operated by Dear John Music. If you have any questions
              about this privacy policy or how I handle your data, please
              contact me at{" "}
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
