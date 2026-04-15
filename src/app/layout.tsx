import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/public/CookieBanner";

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "rentanje.com — Iznajmljivanje opreme",
    template: "%s – Iznajmljivanje | rentanje.com",
  },
  description:
    "Iznajmite opremu za evente, roštilj, kamp, audio i video — brzo i povoljno. List 360 d.o.o. | rentanje.com",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentanje.com"
  ),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
      </body>
    </html>
  );
}
