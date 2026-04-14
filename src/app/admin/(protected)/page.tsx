import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  MessageSquare, Package, BookOpen, CalendarCheck,
  TrendingUp, Euro, Plus, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  new:        { label: "Novi",        color: "text-amber-700",  bg: "bg-amber-100"  },
  read:       { label: "Pročitan",    color: "text-blue-700",   bg: "bg-blue-100"   },
  replied:    { label: "Odgovoreno",  color: "text-violet-700", bg: "bg-violet-100" },
  confirmed:  { label: "Potvrđen",    color: "text-green-700",  bg: "bg-green-100"  },
  cancelled:  { label: "Otkazan",     color: "text-gray-500",   bg: "bg-gray-100"   },
};

function fmt(n: number) {
  return n.toLocaleString("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const today = new Date().toISOString().split("T")[0];
  const in30 = new Date(Date.now() + 30 * 86400_000).toISOString().split("T")[0];

  const [
    { data: inquiryData },
    { count: totalInquiries },
    { data: recentInquiries },
    { count: productCount },
    { data: blogData },
    { count: upcomingAvail },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from("inquiries").select("status, total_estimate"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("inquiries")
      .select("id, inquiry_number, customer_name, status, total_estimate, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("blog_posts").select("is_published"),
    adminSupabase.from("availability")
      .select("*", { count: "exact", head: true })
      .gte("date", today)
      .lte("date", in30),
    supabase.from("products")
      .select("id, name, slug, view_count")
      .eq("is_active", true)
      .order("view_count", { ascending: false })
      .limit(6),
  ]);

  // Derived values
  const newInquiries = inquiryData?.filter((i) => i.status === "new").length ?? 0;
  const confirmedRevenue = inquiryData
    ?.filter((i) => i.status === "confirmed")
    .reduce((sum, i) => sum + (i.total_estimate ?? 0), 0) ?? 0;

  const statusCounts: Record<string, number> = {};
  for (const i of inquiryData ?? []) {
    statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1;
  }

  const publishedPosts = blogData?.filter((p) => p.is_published).length ?? 0;
  const draftPosts = (blogData?.length ?? 0) - publishedPosts;

  const maxViews = Math.max(...(topProducts?.map((p) => p.view_count ?? 0) ?? [0]), 1);

  const statCards = [
    {
      label: "Novi upiti",
      value: newInquiries,
      sub: newInquiries > 0 ? "Čekaju odgovor" : "Nema novih",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/upiti",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: newInquiries > 0 ? "border-amber-300" : "border-gray-100",
      pulse: newInquiries > 0,
    },
    {
      label: "Ukupno upita",
      value: totalInquiries ?? 0,
      sub: "Svi upiti",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/admin/upiti",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-gray-100",
      pulse: false,
    },
    {
      label: "Potvrđeni prihod",
      value: fmt(confirmedRevenue),
      sub: "Potvrđeni upiti",
      icon: <Euro className="h-5 w-5" />,
      href: "/admin/upiti",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-gray-100",
      pulse: false,
    },
    {
      label: "Aktivni proizvodi",
      value: productCount ?? 0,
      sub: "Na platformi",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      color: "text-brand-primary",
      bg: "bg-brand-light",
      border: "border-gray-100",
      pulse: false,
    },
    {
      label: "Blog objave",
      value: publishedPosts,
      sub: draftPosts > 0 ? `${draftPosts} skica` : "Sve objavljeno",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/admin/blog",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-gray-100",
      pulse: false,
    },
    {
      label: "Rezervacije (30d)",
      value: upcomingAvail ?? 0,
      sub: "Nadolazeći unosi",
      icon: <CalendarCheck className="h-5 w-5" />,
      href: "/admin/availability",
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-gray-100",
      pulse: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-brand-text">Nadzorna ploča</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`bg-white rounded-xl border ${s.border} p-4 hover:shadow-md transition-shadow relative overflow-hidden`}
          >
            {s.pulse && (
              <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            )}
            <div className={`inline-flex p-2 rounded-lg ${s.bg} ${s.color} mb-3`}>
              {s.icon}
            </div>
            <div className="font-display text-xl font-bold text-brand-text leading-tight">
              {s.value}
            </div>
            <div className="text-xs font-medium text-brand-text mt-0.5">{s.label}</div>
            <div className="text-xs text-brand-muted mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Status breakdown */}
      {(inquiryData?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-brand-text mb-4">Upiti po statusu</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_META).map(([key, meta]) => {
              const count = statusCounts[key] ?? 0;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${meta.bg}`}
                >
                  <span className={`text-sm font-bold ${meta.color}`}>{count}</span>
                  <span className={`text-xs ${meta.color}`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
          {/* Visual bar */}
          <div className="mt-4 flex h-2.5 rounded-full overflow-hidden gap-0.5">
            {Object.entries(STATUS_META).map(([key, meta]) => {
              const count = statusCounts[key] ?? 0;
              const pct = totalInquiries ? (count / totalInquiries) * 100 : 0;
              if (pct === 0) return null;
              const barColor: Record<string, string> = {
                new: "bg-amber-400", read: "bg-blue-400", replied: "bg-violet-400",
                confirmed: "bg-green-400", cancelled: "bg-gray-300",
              };
              return (
                <div
                  key={key}
                  className={`${barColor[key]} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${meta.label}: ${count}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent inquiries + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Recent inquiries */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-brand-text">Zadnji upiti</h2>
            <Link href="/admin/upiti" className="text-xs text-brand-primary hover:underline flex items-center gap-1">
              Svi upiti <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {(recentInquiries?.length ?? 0) === 0 ? (
            <p className="text-sm text-brand-muted text-center py-8">Nema upita.</p>
          ) : (
            <div className="space-y-1">
              {recentInquiries?.map((inq) => {
                const meta = STATUS_META[inq.status] ?? STATUS_META.new;
                return (
                  <Link
                    key={inq.id}
                    href={`/admin/upiti/${inq.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-mono text-brand-muted w-24 flex-shrink-0 truncate">
                      {inq.inquiry_number}
                    </span>
                    <span className="text-sm text-brand-text font-medium flex-1 truncate">
                      {inq.customer_name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold text-brand-text flex-shrink-0 w-20 text-right">
                      {inq.total_estimate ? fmt(inq.total_estimate) : "—"}
                    </span>
                    <span className="text-xs text-brand-muted flex-shrink-0 w-20 text-right">
                      {format(new Date(inq.created_at), "d. MMM", { locale: hr })}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Top viewed products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-brand-text">Najpregledavaniji</h2>
            <Link href="/admin/products" className="text-xs text-brand-primary hover:underline">
              Svi proizvodi
            </Link>
          </div>
          {maxViews <= 1 ? (
            <div className="text-center py-6">
              <p className="text-xs text-brand-muted">Praćenje pregleda počinje od sada.</p>
              <p className="text-xs text-brand-muted mt-1">Podaci će se pojaviti kada korisnici posjete stranice proizvoda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((p) => {
                const views = p.view_count ?? 0;
                const pct = Math.round((views / maxViews) * 100);
                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-brand-text font-medium truncate max-w-[70%]">{p.name}</span>
                      <span className="text-brand-muted">{views} pregleda</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Brze akcije</p>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 text-sm text-brand-text hover:text-brand-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Novi proizvod
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 text-sm text-brand-text hover:text-brand-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Novi blog post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
