"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Phone, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { trackPhoneClick } from "@/lib/gtag";
import { SITE_PHONE as PHONE, SITE_PHONE_HREF as PHONE_HREF } from "@/lib/site";

const navLinks = [
  { href: "/oprema", label: "Oprema" },
  { href: "/paketi", label: "Paketi" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/rentanje-logo.svg"
            alt="rentanje.com"
            width={120}
            height={67}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-text hover:text-brand-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Phone */}
          <a
            href={PHONE_HREF}
            onClick={trackPhoneClick}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>

          {/* Phone icon — small screens only */}
          <a
            href={PHONE_HREF}
            onClick={trackPhoneClick}
            aria-label={`Nazovite ${PHONE}`}
            className="flex sm:hidden items-center justify-center h-10 w-10 rounded-full text-brand-primary hover:bg-brand-light transition-colors"
          >
            <Phone className="h-5 w-5" />
          </a>

          {/* Cart */}
          <Link
            href="/upit"
            className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-brand-light transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-brand-text" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Izbornik"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-base font-medium text-brand-text hover:text-brand-primary"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            onClick={trackPhoneClick}
            className="flex items-center gap-2 text-base font-semibold text-brand-primary"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
        </div>
      )}
    </header>
  );
}
