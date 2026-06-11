import type { Metadata } from "next";
import { Suspense } from "react";
import { Open_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import CookieBanner from "@/components/public/CookieBanner";
import RouteAnalytics from "@/components/public/RouteAnalytics";

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans",
  display: "swap",
  // Only weights actually used in src/ (font-normal/medium/semibold/bold).
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "rentanje.com — Iznajmljivanje opreme",
    template: "%s | rentanje.com",
  },
  description:
    "Iznajmite opremu za evente, roštilj, kamp, audio i video — brzo i povoljno. List 360 d.o.o. | rentanje.com",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentanje.com"
  ),
  openGraph: {
    locale: "hr_HR",
    siteName: "rentanje.com",
    type: "website",
    images: [
      {
        url: "/rentanje-najam-zagreb-iznajmi.jpg",
        width: 1254,
        height: 1254,
        alt: "RENTANJE.COM — Ne kupuj, iznajmi.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/rentanje-najam-zagreb-iznajmi.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "A9x73begeWeFmlYNJ0yZpaPPUDQMZPkGcvdyS8M69CY",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${openSans.variable} antialiased`}>
        {children}
        <CookieBanner />
        <Suspense fallback={null}>
          <RouteAnalytics />
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
