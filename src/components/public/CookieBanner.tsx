"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// window.gtag is declared globally in src/lib/gtag.ts — we just call it here.

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === "all") {
      // Re-apply granted consent on every page load
      window.gtag?.("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
  }, []);

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, "all");
    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    setVisible(false);
  }

  function acceptNecessary() {
    localStorage.setItem(STORAGE_KEY, "necessary");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-5 sm:p-6 pointer-events-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1">
            <h2 className="font-display font-bold text-brand-text text-base mb-1">
              Ova web stranica koristi kolačiće
            </h2>
            <p className="text-sm text-brand-muted leading-snug">
              Koristimo kolačiće za analizu prometa. Klikom na „Prihvati sve&ldquo; pristajete na pohranu kolačića na vašem uređaju.{" "}
              <Link href="/privatnost" className="text-brand-primary underline hover:opacity-80">
                Pravila privatnosti
              </Link>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={acceptNecessary}
              className="flex-1 sm:flex-none border-2 border-gray-200 text-brand-text font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Samo nužni
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 sm:flex-none bg-brand-primary text-white font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Prihvati sve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
