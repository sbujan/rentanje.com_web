"use client";

import { useState } from "react";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { format, differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { hr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface AvailabilityRecord {
  date: string;
  qty_booked: number;
}

interface Props {
  stockQty: number;
  availability: AvailabilityRecord[];
  minRentalDays: 1 | 3 | 7;
  onRangeChange?: (start: Date | null, end: Date | null, days: number) => void;
}

function getStatus(date: Date, availability: AvailabilityRecord[], stockQty: number) {
  const key = format(date, "yyyy-MM-dd");
  const booked = availability
    .filter((a) => a.date === key)
    .reduce((sum, a) => sum + a.qty_booked, 0);
  const available = stockQty - booked;
  if (available <= 0) return "unavailable";
  if (available / stockQty < 0.3) return "low";
  return "available";
}

export default function AvailabilityCalendar({
  stockQty,
  availability,
  minRentalDays,
  onRangeChange,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const today = new Date();

  function isUnavailable(date: Date) {
    return date >= today && getStatus(date, availability, stockQty) === "unavailable";
  }

  function handleSelect(r: DateRange | undefined) {
    if (r?.from && r?.to) {
      const blocked = eachDayOfInterval({ start: r.from, end: r.to }).find(isUnavailable);
      if (blocked) {
        setError(
          `Odabrani period uključuje nedostupan datum (${format(blocked, "d. MMM yyyy", { locale: hr })}). Molimo odaberite drugi raspon.`
        );
        setRange(undefined);
        onRangeChange?.(null, null, 0);
        return;
      }
    }
    setError(null);
    setRange(r);
    if (r?.from && r?.to) {
      const days = differenceInCalendarDays(r.to, r.from) + 1;
      onRangeChange?.(r.from, r.to, days);
    } else {
      onRangeChange?.(r?.from ?? null, null, 0);
    }
  }

  const disabled: Matcher[] = [{ before: today }, isUnavailable];

  const modifiers = {
    unavailable: (date: Date) =>
      date >= today && getStatus(date, availability, stockQty) === "unavailable",
    low: (date: Date) =>
      date >= today && getStatus(date, availability, stockQty) === "low",
  };

  const modifiersStyles = {
    unavailable: {
      backgroundColor: "#fee2e2",
      color: "#ef4444",
      textDecoration: "line-through",
      opacity: 1,
    },
    low: {
      backgroundColor: "#fef9c3",
      color: "#ca8a04",
    },
  };

  const days =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from) + 1
      : 0;

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-brand-text">Dostupnost</div>

      <div className="rounded-md border border-gray-100 overflow-hidden bg-white">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disabled}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          locale={hr}
          numberOfMonths={1}
          styles={{
            caption: { fontFamily: "var(--font-syne)", fontWeight: 700 },
          }}
          className="!m-0 p-3"
        />
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-brand-muted flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-green-500" /> Dostupno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-yellow-400" /> Ograničeno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" /> Nedostupno
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Selected range info */}
      {range?.from && (
        <div className="text-sm text-brand-muted bg-brand-light rounded-md px-3 py-2">
          {range.from && range.to ? (
            <>
              <span className="font-semibold text-brand-text">
                {format(range.from, "d. MMM", { locale: hr })} –{" "}
                {format(range.to, "d. MMM yyyy", { locale: hr })}
              </span>
              <span className="ml-2">
                ({days} {days === 1 ? "dan" : days < 5 ? "dana" : "dana"})
              </span>
            </>
          ) : (
            <span>
              Početak: {format(range.from, "d. MMM yyyy", { locale: hr })}
            </span>
          )}
        </div>
      )}

      {minRentalDays > 1 && (
        <p className="text-xs text-brand-muted">
          Minimalni period iznajmljivanja je{" "}
          <strong>{minRentalDays} dana</strong>.
        </p>
      )}
    </div>
  );
}
