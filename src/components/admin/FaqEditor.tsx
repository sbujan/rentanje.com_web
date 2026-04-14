"use client";

import { Plus, Trash2 } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  value: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}

export default function FaqEditor({ value, onChange }: Props) {
  function add() {
    onChange([...value, { question: "", answer: "" }]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof FaqItem, text: string) {
    onChange(value.map((item, idx) => idx === i ? { ...item, [field]: text } : item));
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wide">FAQ {i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Obriši FAQ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">Pitanje</label>
            <input
              value={item.question}
              onChange={(e) => update(i, "question", e.target.value)}
              placeholder="Što je uključeno u cijenu najma?"
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">Odgovor</label>
            <textarea
              value={item.answer}
              onChange={(e) => update(i, "answer", e.target.value)}
              placeholder="Cijena uključuje..."
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none bg-white"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-brand-primary border border-brand-primary/30 px-3 py-2 rounded-lg hover:bg-brand-light transition-colors"
      >
        <Plus className="h-4 w-4" />
        Dodaj FAQ pitanje
      </button>

      {value.length === 0 && (
        <p className="text-xs text-brand-muted">
          FAQ pitanja pomažu korisnicima i AI alatima (Google, ChatGPT, Perplexity) da bolje razumiju vaš sadržaj.
        </p>
      )}
    </div>
  );
}
