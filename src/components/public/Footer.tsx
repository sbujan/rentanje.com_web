import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const PHONE = "+385 95 204 4414";
const PHONE_HREF = "tel:+385952044414";

export default function Footer() {
  return (
    <footer className="bg-brand-darkBg text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="font-display text-xl font-bold text-brand-primary">
              rentanje.com
            </span>
            <p className="text-white/60 text-sm mt-2">
              List 360 d.o.o.
              <br />
              Iznajmite sve što vam treba.
            </p>
            <div className="mt-4 space-y-1.5">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-brand-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>
              <a
                href="mailto:info@rentanje.com"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-brand-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@rentanje.com
              </a>
            </div>
          </div>

          {/* Oprema */}
          <div>
            <h3 className="font-display font-semibold text-sm text-white/50 uppercase tracking-wider mb-3">
              Oprema
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/najam/audio-video-oprema", label: "Audio i video" },
                { href: "/najam/oprema-za-evente", label: "Evente i zabava" },
                { href: "/najam/rostilj-kuhanje", label: "Roštilj i kuhanje" },
                { href: "/najam/kamp-outdoor", label: "Kamp i outdoor" },
                { href: "/najam/alati-ciscenje", label: "Alati i čišćenje" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display font-semibold text-sm text-white/50 uppercase tracking-wider mb-3">
              Informacije
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/o-nama", label: "O nama" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/blog", label: "Blog" },
                { href: "/uvjeti-odgovornosti", label: "Uvjeti odgovornosti" },
                { href: "/privatnost", label: "Privatnost" },
                { href: "/uvjeti-koristenja", label: "Uvjeti korištenja" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/40 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} List 360 d.o.o. Sva prava pridržana.</span>
          <span>rentanje.com</span>
        </div>
      </div>
    </footer>
  );
}
