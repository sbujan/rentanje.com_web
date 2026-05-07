"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  /** Default alt used as a fallback for any image without its own alt. */
  alt: string;
  /**
   * Optional per-image alt text aligned with `images`. Indexes can be
   * null/empty — those fall back to `alt` so the SEO/accessibility
   * baseline never disappears.
   */
  alts?: (string | null | undefined)[];
}

export default function ImageLightbox({ images, alt, alts }: Props) {
  const altFor = (i: number) => {
    const candidate = alts?.[i];
    return candidate && candidate.trim() ? candidate : alt;
  };
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, prev, next]);

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  if (images.length === 0) return null;

  const heroUrl = images[0];
  const thumbs = images.slice(1);

  return (
    <>
      {/* Hero image — mobile */}
      <div
        className="relative aspect-video rounded-lg overflow-hidden mb-6 lg:hidden cursor-pointer"
        onClick={() => openAt(0)}
      >
        <Image src={heroUrl} alt={altFor(0)} fill className="object-cover" priority />
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            1/{images.length}
          </span>
        )}
      </div>

      {/* Hero image — desktop */}
      <div
        className="relative aspect-video rounded-lg overflow-hidden hidden lg:block cursor-pointer"
        onClick={() => openAt(0)}
      >
        <Image
          src={heroUrl}
          alt={altFor(0)}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </div>

      {/* Thumbnails */}
      {thumbs.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbs.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => openAt(i + 1)}
            >
              <Image
                src={img}
                alt={altFor(i + 1)}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-brand-text hover:bg-black/20 transition-colors"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-brand-muted text-sm font-medium">
            {index + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-4 z-10 h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-brand-text hover:bg-black/20 transition-colors"
              aria-label="Prethodna"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-4 z-10 h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-brand-text hover:bg-black/20 transition-colors"
              aria-label="Sljedeća"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={altFor(index)}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
