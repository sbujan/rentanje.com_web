"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


const categories = [
  {
    id: 1,
    slug: "audio-video-oprema",
    title: "Audio i video",
    subtitle: "Projektori, zvučnici, kamere, dronovi",
    imageUrl: "/Projektor-s-platnom.jpg",
    color: "#01D2D6",
  },
  {
    id: 2,
    slug: "oprema-za-evente",
    title: "Evente i zabava",
    subtitle: "Šatori, stolovi, dekoracije, igre",
    imageUrl: "/Druzenje-na-otvorenom.jpg",
    color: "#FF6B6B",
  },
  {
    id: 3,
    slug: "rostilj-kuhanje",
    title: "Roštilj i kuhanje",
    subtitle: "Roštilji, pećnica za pizzu, ražanj",
    imageUrl: "/Kulinarski-dozivljaj.jpg",
    color: "#FF8E6C",
  },
  {
    id: 4,
    slug: "kamp-outdoor",
    title: "Kamp i outdoor",
    subtitle: "Šatori, madraci, hladnjaci, pumpe",
    imageUrl: "/sator-za-kampiranje-mh100-fresh-black-za-tri-osobe-2.avif",
    color: "#6EE7B7",
  },
  {
    id: 5,
    slug: "alati-ciscenje",
    title: "Alati i čišćenje",
    subtitle: "Strojevi za pranje, usisavači",
    imageUrl: "/kercher%20puzzi.jpg",
    color: "#FFD166",
  },
  {
    id: 6,
    slug: "ostalo",
    title: "Ostalo",
    subtitle: "Rekviziti, ukrasi i sve ostalo",
    imageUrl: "/Hiluckey-solarni-Powerbank-25000mAh.jpg",
    color: "#BCA7F0",
  },
];

interface AccordionItemProps {
  item: (typeof categories)[0];
  isActive: boolean;
  onActivate: () => void;
}

function AccordionItem({ item, isActive, onActivate }: AccordionItemProps) {
  const router = useRouter();

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out shrink-0 h-[380px] sm:h-[440px]`}
      style={{ width: isActive ? "340px" : "56px" }}
      onMouseEnter={onActivate}
      onClick={() => {
        if (isActive) router.push(`/najam/${item.slug}`);
        else onActivate();
      }}
    >
      {/* Background image */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 340px, 340px"
        className="absolute inset-0 object-cover"
      />

      {/* Color tint overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to top, ${item.color}CC 0%, ${item.color}40 50%, transparent 100%)`,
          opacity: isActive ? 1 : 0.7,
        }}
      />

      {/* Dark overlay for inactive */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Active: bottom label */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white font-bold text-lg leading-tight mb-1 drop-shadow">
            {item.title}
          </p>
          <p className="text-white/80 text-sm leading-snug mb-3">
            {item.subtitle}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors">
            Pregledaj →
          </span>
        </div>
      )}

      {/* Inactive: vertical title */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-white text-sm font-semibold whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {item.title}
          </span>
        </div>
      )}
    </div>
  );
}

export function CategoryAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* Left: text */}
        <div className="w-full lg:w-2/5 text-left lg:text-left">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-text leading-tight mb-4">
            Što možete iznajmiti?
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed mb-6">
            Ne kupuj stvari koje skupljaju prašinu, iznajmi ih! Izaberi
            kategoriju i pronađi što trebaš u jednom kliku. Iznajmi, iskoristi,
            vrati!
          </p>
          <Link
            href="/oprema"
            className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
          >
            Pregledaj svu opremu
          </Link>
        </div>

        {/* Right: accordion (desktop) */}
        <div className="w-full lg:w-3/5 hidden lg:block">
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:overflow-visible justify-center lg:justify-end">
            {categories.map((cat, index) => (
              <AccordionItem
                key={cat.id}
                item={cat}
                isActive={index === activeIndex}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Mobile / tablet: card grid */}
        <div className="w-full lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/oprema?cat=${cat.slug}`}
                className="group relative block aspect-[3/1] rounded-2xl overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 transition-opacity"
                  style={{
                    background: `linear-gradient(to top, ${cat.color}E6 0%, ${cat.color}40 55%, transparent 100%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white font-bold text-base leading-tight drop-shadow">
                    {cat.title}
                  </p>
                  <p className="text-white/85 text-xs leading-snug mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
