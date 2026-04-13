import { createClient } from "@/lib/supabase/server";
import { Package, FolderOpen, Tag, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: categoryCount },
    { count: tagCount },
    { count: inquiryCount },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const stats = [
    {
      label: "Aktivni proizvodi",
      value: productCount ?? 0,
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      color: "text-brand-primary",
      bg: "bg-brand-light",
    },
    {
      label: "Kategorije",
      value: categoryCount ?? 0,
      icon: <FolderOpen className="h-5 w-5" />,
      href: "/admin/categories",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Oznake",
      value: tagCount ?? 0,
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/tags",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Novi upiti",
      value: inquiryCount ?? 0,
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/upiti",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Nadzorna ploča
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-card p-5 hover:shadow-md transition-shadow"
          >
            <div
              className={`inline-flex p-2 rounded-md ${stat.bg} ${stat.color} mb-3`}
            >
              {stat.icon}
            </div>
            <div className="font-display text-2xl font-bold text-brand-text">
              {stat.value}
            </div>
            <div className="text-sm text-brand-muted">{stat.label}</div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-card p-6">
        <h2 className="font-display text-lg font-semibold text-brand-text mb-2">
          Dobrodošli u admin panel
        </h2>
        <p className="text-brand-muted text-sm">
          Upravljajte proizvodima, kategorijama, oznakama i upitima putem
          bočnog izbornika.
        </p>
      </div>
    </div>
  );
}
