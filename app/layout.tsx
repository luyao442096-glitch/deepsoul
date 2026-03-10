import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Companion for Healing & Sleep | Deep Soul Lab",
  description: "A minimalist AI companion designed to help you stop doomscrolling, untangle anxious thoughts, and fall asleep peacefully.",
  keywords: "AI companion, mental health AI, burnout recovery, anxiety relief, sleep help, stop doomscrolling",
  authors: [{ name: "Deep Soul Lab" }],
  creator: "Deep Soul Lab",
  publisher: "Deep Soul Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.deepsoullab.com",
    title: "AI Companion for Healing & Sleep | Deep Soul Lab",
    description: "A minimalist AI companion designed to help you stop doomscrolling and fall asleep peacefully.",
    siteName: "Deep Soul Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Companion for Healing & Sleep | Deep Soul Lab",
    description: "A minimalist AI companion designed to help you stop doomscrolling.",
    creator: "@DeepSoulAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/lib/live2d.min.js"></script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050A18" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DeepSoul AI",
              "url": "https://www.deepsoullab.com",
              "logo": "https://www.deepsoullab.com/logo.png",
              "description": "AI-powered mental health support and emotional companionship for burnout, anxiety, and sleep issues",
              "sameAs": [
                "https://twitter.com/DeepSoulAI",
                "https://www.facebook.com/DeepSoulAI",
                "https://www.linkedin.com/company/deepsoul-ai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@deepsoullab.com"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "DeepSoul AI",
              "url": "https://www.deepsoullab.com",
              "description": "AI-powered mental health support and emotional companionship",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.deepsoullab.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}