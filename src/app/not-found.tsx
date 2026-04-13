import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <p className="text-7xl font-display font-bold text-brand-primary mb-2">404</p>
        <h1 className="text-2xl font-display font-bold text-brand-text mb-3">
          Stranica nije pronađena
        </h1>
        <p className="text-brand-muted mb-8">
          Stranica koju tražite ne postoji ili je uklonjena.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-brand-text px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Na početnu
          </Link>
          <Link
            href="/oprema"
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Search className="h-4 w-4" />
            Pregledaj opremu
          </Link>
        </div>
      </div>
    </div>
  );
}
