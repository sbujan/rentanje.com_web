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
    if (!file.type.startsWith("image/")) {
      setError("Molimo odaberite sliku.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Slika mora biti manja od 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err: any) {
      setError(err.message ?? "Greška pri uploadu.");
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
