"use client";

import { useState } from "react";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { format, differenceInCalendarDays, eachDayOfInterval, startOfDay } from "date-fns";
import { hr } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import type { AvailabilityRecord } from "@/lib/availability";

interface Props {
  stockQty: number;
  availability: AvailabilityRecord[];
  /**
   * Fires on every change: (start, null, 0) after the first click,
   * (start, end, days) once the range is complete, (null, null, 0) when cleared.
   */
  onRangeChange?: (start: Date | null, end: Date | null, days: number) => void;
  /**
   * A picked range that contains a booked day is rejected: the message says
   * which day, null clears it. The parent shows it next to the booking button,
   * which stays on screen, while this calendar may be scrolled away.
   */
  onError?: (message: string | null) => void;
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

export default function AvailabilityCalendar({ stockQty, availability, onRangeChange, onError }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  // startOfDay: calendar days are midnight-local, so a plain `new Date()`
  // (with time-of-day) makes `date >= today` false for *today* — today's
  // bookings would never block.
  const today = startOfDay(new Date());

  function isUnavailable(date: Date) {
    return date >= today && getStatus(date, availability, stockQty) === "unavailable";
  }

  // Skip the green "available" tint on selected days so the inline modifier
  // style doesn't override the range-selection styling.
  function isInSelectedRange(date: Date) {
    if (!range?.from) return false;
    const end = range.to ?? range.from;
    return date >= range.from && date <= end;
  }

  function handleSelect(r: DateRange | undefined) {
    if (r?.from && r?.to) {
      const blocked = eachDayOfInterval({ start: r.from, end: r.to }).find(isUnavailable);
      if (blocked) {
        setRange(undefined);
        onRangeChange?.(null, null, 0);
        onError?.(
          `Odabrani period uključuje nedostupan datum (${format(blocked, "d. MMM yyyy", { locale: hr })}). Odaberite drugi raspon.`
        );
        return;
      }
    }
    onError?.(null);
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
    available: (date: Date) =>
      date >= today &&
      !isInSelectedRange(date) &&
      getStatus(date, availability, stockQty) === "available",
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
    // Subtle green so the legend's "Dostupno" actually matches the calendar.
    available: {
      backgroundColor: "#f0fdf4",
      color: "#15803d",
    },
  };

  return (
    <div className="space-y-2">
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
          className="booking-calendar !m-0 p-3"
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
    </div>
  );
}
