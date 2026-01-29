import type { Metadata } from "next";
import { Inter, Geist_Mono, Lora } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { ToastHandler } from "@/components/toast-handler";
import { ConsentBanner } from "@/components/consent-banner";
import { ThemeProvider } from "@/contexts/theme-context";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const GTM_ID = "GTM-MCJB2BXQ";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Songsmith - Songwriting Tool",
  description: "Finish more songs with Pat Pattison's three-boxes technique. AI-assisted songwriting workflow.",
  metadataBase: new URL("https://songsmith.nl"),
  openGraph: {
    title: "Songsmith - Songwriting Tool",
    description:
      "Finish more songs with Pat Pattison's three-boxes technique. AI-assisted songwriting workflow.",
    url: "https://songsmith.nl",
    siteName: "Songsmith",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Songsmith - AI-Assisted Songwriting Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Songsmith - Songwriting Tool",
    description:
      "Finish more songs with Pat Pattison's three-boxes technique. AI-assisted songwriting workflow.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Theme script - must run before page renders to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var path = window.location.pathname;
                var landingPages = ['/', '/privacy', '/terms', '/changelog'];
                var isLandingPage = landingPages.indexOf(path) !== -1;

                if (isLandingPage) {
                  // Landing pages are always dark
                  document.documentElement.classList.add('dark');
                  document.body && document.body.classList.add('dark');
                } else {
                  // Other pages use user preference or system preference
                  var darkMode = localStorage.getItem('songsmith-dark-mode');
                  var isDark = darkMode === 'dark' || (darkMode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Consent Mode v2 defaults - must load before GTM */}
        <Script
          id="consent-mode-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <GoogleTagManager gtmId={GTM_ID} />
      <body
        className={`${inter.variable} ${geistMono.variable} ${lora.variable} antialiased`}
      >
        <ThemeProvider>
          <NextTopLoader color="#14B8A6" showSpinner={false} />
          {children}
          <ToastHandler />
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
