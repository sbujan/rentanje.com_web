"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Inspect the first bytes of the file to confirm it's actually an image of a
 * known format. file.type is purely advisory — the browser trusts whatever
 * the OS labels the file. Magic bytes don't lie.
 */
async function detectImageFormat(file: File): Promise<string | null> {
  const buf = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // GIF: 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WebP: RIFF....WEBP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "image/webp";
  // AVIF: bytes 4-11 contain "ftypavif" or "ftypheic" for related formats
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = String.fromCharCode(buf[8]!, buf[9]!, buf[10]!, buf[11]!);
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return null;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  folder = "products",
  label = "Slika",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    if (!ALLOWED_MIME.has(file.type)) {
      setError("Dozvoljeni formati: JPG, PNG, WebP, AVIF, GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Slika mora biti manja od 5 MB.");
      return;
    }

    // Reject spoofed extensions / MIME mismatches.
    const detected = await detectImageFormat(file);
    if (!detected) {
      setError("Sadržaj datoteke nije valjana slika.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const ext = EXT_BY_MIME[detected] ?? "jpg";
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: true, contentType: detected });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Greška pri uploadu.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-brand-text">{label}</label>

      {value ? (
        <div className="relative group">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image src={value} alt="Pregled slike" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-brand-text px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Zamijeni
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Ukloni
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-brand-primary hover:bg-brand-light/50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-brand-muted">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              <span className="text-sm">Uploadanje...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-brand-muted">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Kliknite ili prevucite sliku</span>
              <span className="text-xs">PNG, JPG, WebP — max 5 MB</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Or paste URL */}
      <div className="flex gap-2 items-center">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs text-brand-muted">ili unesite URL</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
      />
    </div>
  );
}
