"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO, isSameDay } from "date-fns";
import { hr } from "date-fns/locale";
import { Phone, Truck, Store, PackageCheck } from "lucide-react";
import { INQUIRY_STATUS_META, type InquiryStatus } from "@/lib/inquiry-status";
import { cn } from "@/lib/utils";

export interface RentalLine {
  /** Stable per (inquiry, product, start) so the local "returned" tick survives reloads. */
  key: string;
  inquiryId: string;
  inquiryNumber: string;
  status: InquiryStatus;
  customerName: string;
  customerPhone: string | null;
  deliveryType: "pickup" | "delivery";
  deliveryAddress: string | null;
  productName: string;
  productSlug: string;
  qty: number;
  rentalStart: string; // YYYY-MM-DD
  rentalEnd: string;   // YYYY-MM-DD
  days: number;
}

interface Props {
  lines: RentalLine[];
  today: string;
  horizon: number;
  horizons: number[];
  graceDays: number;
}

/**
 * Local-only "returned" ticks. Stored as { [lineKey]: rentalEnd } so entries
 * older than PRUNE_AFTER_DAYS can be dropped without knowing anything else.
 */
const STORAGE_KEY = "rentanje-admin-returned";
const PRUNE_AFTER_DAYS = 90;

function loadReturned(today: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const cutoff = format(
      new Date(parseISO(today).getTime() - PRUNE_AFTER_DAYS * 86400_000),
      "yyyy-MM-dd"
    );
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && v >= cutoff) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function saveReturned(map: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* private mode / quota: the tick just won't persist */
  }
}

function fmtDay(ymd: string, withYear = false) {
  return format(parseISO(ymd), withYear ? "EEE d. MMM yyyy" : "EEE d. MMM", { locale: hr });
}

function fmtRange(start: string, end: string) {
  const s = parseISO(start);
  const e = parseISO(end);
  if (isSameDay(s, e)) return fmtDay(start);
  return `${fmtDay(start)} do ${fmtDay(end)}`;
}

type Bucket = "ended" | "ongoing" | "upcoming";

function bucketOf(line: RentalLine, today: string): Bucket {
  if (line.rentalEnd < today) return "ended";
  if (line.rentalStart <= today) return "ongoing";
  return "upcoming";
}

const BUCKET_META: Record<Bucket, { title: string; hint: string; accent: string }> = {
  ongoing: {
    title: "Trenutno vani",
    hint: "Najam je u tijeku, oprema je kod kupca.",
    accent: "border-l-amber-400",
  },
  ended: {
    title: "Završeni, čekaju povrat",
    hint: "Termin je prošao. Označite kad je oprema vraćena.",
    accent: "border-l-red-400",
  },
  upcoming: {
    title: "Nadolazeći",
    hint: "Kreću u najam unutar odabranog razdoblja.",
    accent: "border-l-teal-400",
  },
};

export default function UpcomingRentals({ lines, today, horizon, horizons, graceDays }: Props) {
  const router = useRouter();
  const [returned, setReturned] = useState<Record<string, string>>({});
  const [hideReturned, setHideReturned] = useState(false);
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);

  useEffect(() => {
    setReturned(loadReturned(today));
  }, [today]);

  function toggleReturned(line: RentalLine) {
    setReturned((prev) => {
      const next = { ...prev };
      if (next[line.key]) delete next[line.key];
      else next[line.key] = line.rentalEnd;
      saveReturned(next);
      return next;
    });
  }

  const visible = useMemo(
    () =>
      lines.filter((l) => {
        if (onlyConfirmed && l.status !== "confirmed") return false;
        if (hideReturned && returned[l.key]) return false;
        return true;
      }),
    [lines, onlyConfirmed, hideReturned, returned]
  );

  const grouped: Record<Bucket, RentalLine[]> = { ongoing: [], ended: [], upcoming: [] };
  for (const l of visible) grouped[bucketOf(l, today)].push(l);

  const outstanding = lines.filter(
    (l) => bucketOf(l, today) !== "upcoming" && !returned[l.key]
  ).length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-brand-muted">Nadolazećih</span>
          <div className="flex overflow-hidden rounded-md border border-gray-200">
            {horizons.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => router.push(h === 30 ? "/admin/termini" : `/admin/termini?dani=${h}`)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  h === horizon
                    ? "bg-brand-primary text-white"
                    : "bg-white text-brand-text hover:bg-gray-50"
                )}
              >
                {h} dana
              </button>
            ))}
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-brand-text">
          <input
            type="checkbox"
            checked={onlyConfirmed}
            onChange={(e) => setOnlyConfirmed(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-brand-primary"
          />
          Samo potvrđeni
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-brand-text">
          <input
            type="checkbox"
            checked={hideReturned}
            onChange={(e) => setHideReturned(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-brand-primary"
          />
          Sakrij vraćeno
        </label>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-muted">
          <PackageCheck className="h-4 w-4" />
          Nije vraćeno: <strong className="text-brand-text">{outstanding}</strong>
        </span>
      </div>

      {lines.length === 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-sm text-brand-muted">
          Nema termina u zadnjih {graceDays} i sljedećih {horizon} dana.
        </div>
      )}

      {(["ongoing", "ended", "upcoming"] as Bucket[]).map((bucket) => {
        const rows = grouped[bucket];
        if (rows.length === 0) return null;
        const meta = BUCKET_META[bucket];
        const canTick = bucket !== "upcoming";
        return (
          <section key={bucket} className="rounded-xl border border-gray-100 bg-white">
            <header className="flex items-baseline justify-between gap-3 border-b border-gray-100 px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold text-brand-text">
                  {meta.title}{" "}
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-brand-muted">
                    {rows.length}
                  </span>
                </h2>
                <p className="text-xs text-brand-muted">{meta.hint}</p>
              </div>
            </header>
            <ul className="divide-y divide-gray-50">
              {rows.map((line, i) => {
                const isReturned = Boolean(returned[line.key]);
                const statusMeta = INQUIRY_STATUS_META[line.status] ?? INQUIRY_STATUS_META.new;
                // Date header once per start day keeps "this weekend" scannable.
                const newDay = i === 0 || rows[i - 1].rentalStart !== line.rentalStart;
                return (
                  <li key={line.key}>
                    {newDay && bucket === "upcoming" && (
                      <div className="bg-gray-50 px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                        {fmtDay(line.rentalStart, true)}
                        {line.rentalStart === today && " (danas)"}
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex flex-wrap items-start gap-x-4 gap-y-2 border-l-4 px-4 py-3 sm:flex-nowrap",
                        meta.accent,
                        isReturned && "opacity-50"
                      )}
                    >
                      {canTick && (
                        <label
                          className="flex shrink-0 cursor-pointer items-center gap-2 pt-0.5 text-xs text-brand-muted"
                          title="Samo lokalna oznaka, ne sprema se u bazu"
                        >
                          <input
                            type="checkbox"
                            checked={isReturned}
                            onChange={() => toggleReturned(line)}
                            className="h-5 w-5 rounded border-gray-300 accent-green-600"
                          />
                          <span className="sm:hidden">Vraćeno</span>
                        </label>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "font-medium text-brand-text",
                              isReturned && "line-through"
                            )}
                          >
                            {line.productName}
                          </span>
                          {line.qty > 1 && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-brand-text">
                              x{line.qty}
                            </span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-brand-muted">
                          {fmtRange(line.rentalStart, line.rentalEnd)}
                          <span className="mx-1.5">·</span>
                          {line.days} {line.days === 1 ? "dan" : "dana"}
                          {bucket === "ongoing" && line.rentalEnd === today && (
                            <span className="ml-2 font-semibold text-amber-700">vraća se danas</span>
                          )}
                          {bucket === "ongoing" && line.rentalEnd > today && (
                            <span className="ml-2">povrat {fmtDay(line.rentalEnd)}</span>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 text-sm sm:w-56">
                        <div className="truncate font-medium text-brand-text">{line.customerName}</div>
                        <div className="flex flex-wrap items-center gap-x-3 text-xs text-brand-muted">
                          {line.customerPhone && (
                            <a
                              href={`tel:${line.customerPhone}`}
                              className="flex items-center gap-1 hover:text-brand-primary"
                            >
                              <Phone className="h-3 w-3" />
                              {line.customerPhone}
                            </a>
                          )}
                          <span
                            className="flex items-center gap-1"
                            title={line.deliveryAddress ?? undefined}
                          >
                            {line.deliveryType === "delivery" ? (
                              <>
                                <Truck className="h-3 w-3" /> Dostava
                              </>
                            ) : (
                              <>
                                <Store className="h-3 w-3" /> Preuzimanje
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3 self-center text-xs">
                        {canTick && (
                          <span className="hidden text-brand-muted sm:inline">
                            {isReturned ? "Vraćeno" : ""}
                          </span>
                        )}
                        <Link
                          href={`/admin/upiti/${line.inquiryId}`}
                          className="font-mono text-brand-primary hover:underline"
                        >
                          {line.inquiryNumber}
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
