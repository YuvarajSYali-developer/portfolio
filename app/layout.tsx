import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SiteChrome from "@/components/layout/SiteChrome";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SITE_URL } from "@/lib/constants";
import { education, personal, socials } from "@/lib/portfolio-data";

/* Fonts are self-hosted from the repo — no build-time network fetch. */
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", style: "normal", weight: "400" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const title = `${personal.name} — AI/ML Engineer, Researcher & Software Developer`;
const description = `${personal.subheadline} ECE undergraduate at Manipal Institute of Technology. Projects in network anomaly detection, EEG-based cognitive score prediction, chess error modelling and civic tech.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${personal.name}` },
  description,
  applicationName: personal.name,
  authors: [{ name: personal.name, url: SITE_URL }],
  creator: personal.name,
  keywords: [
    "Yuvaraj S Yali",
    "AI/ML Engineer",
    "Machine Learning",
    "Explainable AI",
    "EEG",
    "Applied Research",
    "Full-Stack Developer",
    "Manipal Institute of Technology",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: personal.name,
    title,
    description,
    locale: "en_IN",
    firstName: "Yuvaraj",
    lastName: "Yali",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080A10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: SITE_URL,
  email: `mailto:${personal.email}`,
  jobTitle: "AI/ML Engineer",
  image: `${SITE_URL}${personal.photo}`,
  description: personal.shortBio,
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  sameAs: socials.filter((s) => s.key !== "email").map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
      <body className="grain min-h-dvh">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        {/* Page-load curtain: pure CSS, never blocks content or interaction. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] grid animate-loader-out place-items-center bg-ink"
        >
          <span className="font-display text-sm font-semibold tracking-[0.3em] text-fg-2">YSY</span>
        </div>
        <AuroraBackground />
        <Navbar />
        <SiteChrome />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
