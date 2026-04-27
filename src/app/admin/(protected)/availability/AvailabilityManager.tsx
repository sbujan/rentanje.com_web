"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Loader2, Trash2, Plus, Lock } from "lucide-react";
import "react-day-picker/dist/style.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  stock_qty: number;
}

interface AvailRow {
  id: string;
  date: string;
  qty_booked: number;
  note: string | null;
  source_inquiry_id: string | null;
}

export default function AvailabilityManager({ products }: { products: Product[] }) {
  const supabase = createClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] ?? null);
  const [rows, setRows] = useState<AvailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [qtyInput, setQtyInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const loadRows = useCallback(async (productId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("availability")
      .select("id, date, qty_booked, note, source_inquiry_id")
      .eq("product_id", productId)
      .gte("date", format(new Date(), "yyyy-MM-dd"))
      .order("date");
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!selectedProduct) return;
    loadRows(selectedProduct.id);
  }, [selectedProduct, loadRows]);

  async function handleSave() {
    if (!selectedProduct || !selectedDate || !qtyInput) return;
    setSaving(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    // Manual upsert: only consider manual rows (inquiry-derived rows
    // coexist on the same date and must be left alone).
    const existing = rows.find(
      (r) => r.date === dateStr && r.source_inquiry_id === null
    );
    if (existing) {
      await supabase
        .from("availability")
        .update({ qty_booked: Number(qtyInput), note: noteInput || null })
        .eq("id", existing.id);
    } else {
      await supabase.from("availability").insert({
        product_id: selectedProduct.id,
        date: dateStr,
        qty_booked: Number(qtyInput),
        note: noteInput || null,
      });
    }

    setQtyInput("");
    setNoteInput("");
    setSelectedDate(undefined);
    await loadRows(selectedProduct.id);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("availability").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  // Sum qty_booked per date (across manual + inquiry-derived rows) before
  // colour-coding the calendar — multiple inquiries can stack on one date.
  const totalsByDate = rows.reduce<Map<string, number>>((acc, r) => {
    acc.set(r.date, (acc.get(r.date) ?? 0) + r.qty_booked);
    return acc;
  }, new Map());

  const stockQty = selectedProduct?.stock_qty ?? 1;
  const fullyBooked = Array.from(totalsByDate.entries())
    .filter(([, total]) => total >= stockQty)
    .map(([date]) => new Date(date + "T12:00:00"));
  const partiallyBooked = Array.from(totalsByDate.entries())
    .filter(([, total]) => total > 0 && total < stockQty)
    .map(([date]) => new Date(date + "T12:00:00"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Product selector */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Proizvodi</p>
        <div className="space-y-1">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedProduct?.id === p.id
                  ? "bg-brand-primary text-white font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p.name}
              <span className={`text-xs ml-1 ${selectedProduct?.id === p.id ? "text-white/70" : "text-gray-400"}`}>
                (qty: {p.stock_qty})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      {selectedProduct && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Calendar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-brand-text mb-3">
                Odaberite datum za blokiranje
              </p>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                modifiers={{ fullyBooked, partiallyBooked }}
                modifiersStyles={{
                  fullyBooked: { backgroundColor: "#fee2e2", color: "#ef4444", textDecoration: "line-through" },
                  partiallyBooked: { backgroundColor: "#fef9c3", color: "#ca8a04" },
                }}
                locale={hr}
                className="!m-0"
              />

              {selectedDate && (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-brand-text">
                    {format(selectedDate, "d. MMMM yyyy", { locale: hr })}
                  </p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Qty rezervirano (max {selectedProduct.stock_qty})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedProduct.stock_qty}
                      value={qtyInput}
                      onChange={(e) => setQtyInput(e.target.value)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Napomena (opcija)</label>
                    <input
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="Rezervirano za klijenta..."
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || !qtyInput}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 w-full justify-center"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Spremi
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming bookings list */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-brand-text mb-3">Nadolazeći unosi</p>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                </div>
              ) : rows.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nema unosa.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {rows.map((row) => {
                    const pct = row.qty_booked / selectedProduct.stock_qty;
                    const fromInquiry = row.source_inquiry_id !== null;
                    return (
                      <div key={row.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-text flex items-center gap-1.5">
                            {fromInquiry && <Lock className="h-3 w-3 text-gray-400" />}
                            {format(new Date(row.date + "T12:00:00"), "d. MMM yyyy", { locale: hr })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {row.qty_booked}/{selectedProduct.stock_qty} rezervirano
                            {row.note && (
                              fromInquiry && row.source_inquiry_id ? (
                                <>
                                  {" · "}
                                  <Link
                                    href={`/admin/upiti/${row.source_inquiry_id}`}
                                    className="text-brand-primary hover:underline"
                                  >
                                    {row.note}
                                  </Link>
                                </>
                              ) : (
                                ` · ${row.note}`
                              )
                            )}
                          </p>
                          <div className="mt-1 h-1.5 rounded-full bg-gray-100 w-full">
                            <div
                              className={`h-1.5 rounded-full ${pct >= 1 ? "bg-red-400" : "bg-yellow-400"}`}
                              style={{ width: `${Math.min(pct * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        {fromInquiry ? (
                          <span
                            className="text-gray-300 flex-shrink-0"
                            title="Iz potvrđenog upita — promijenite status upita za uklanjanje"
                          >
                            <Lock className="h-4 w-4" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-300" /> Potpuno rezervirano
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-yellow-300" /> Djelomično rezervirano
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
