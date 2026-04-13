"use client";

import { useEffect } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <p className="text-7xl font-display font-bold text-brand-primary mb-2">500</p>
        <h1 className="text-2xl font-display font-bold text-brand-text mb-3">
          Nešto je pošlo po krivu
        </h1>
        <p className="text-brand-muted mb-8">
          Došlo je do greške. Pokušajte ponovo ili nas kontaktirajte na{" "}
          <a href="mailto:info@rentanje.com" className="text-brand-primary underline">
            info@rentanje.com
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-brand-text px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Na početnu
          </a>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            Pokušaj ponovo
          </button>
        </div>
      </div>
    </div>
  );
}
