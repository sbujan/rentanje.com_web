"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Tag,
  Gift,
  Percent,
  MessageSquare,
  FileText,
  Search,
  Star,
  Calendar,
  Settings,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: Array<"owner" | "manager" | "editor">;
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Nadzorna ploča",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/admin/products",
    label: "Proizvodi",
    icon: <Package className="h-4 w-4" />,
  },
  {
    href: "/admin/categories",
    label: "Kategorije",
    icon: <FolderOpen className="h-4 w-4" />,
  },
  { href: "/admin/tags", label: "Oznake", icon: <Tag className="h-4 w-4" /> },
  {
    href: "/admin/bundles",
    label: "Paketi",
    icon: <Gift className="h-4 w-4" />,
    roles: ["owner", "manager"],
  },
  {
    href: "/admin/promotions",
    label: "Promocije",
    icon: <Percent className="h-4 w-4" />,
    roles: ["owner", "manager"],
  },
  {
    href: "/admin/upiti",
    label: "Upiti",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    href: "/admin/seo-pages",
    label: "SEO stranice",
    icon: <Search className="h-4 w-4" />,
    roles: ["owner", "manager"],
  },
  {
    href: "/admin/testimonials",
    label: "Recenzije",
    icon: <Star className="h-4 w-4" />,
    roles: ["owner", "manager"],
  },
  {
    href: "/admin/availability",
    label: "Dostupnost",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["owner", "manager"],
  },
  {
    href: "/admin/settings",
    label: "Postavke",
    icon: <Settings className="h-4 w-4" />,
    roles: ["owner"],
  },
  {
    href: "/admin/users",
    label: "Korisnici",
    icon: <Users className="h-4 w-4" />,
    roles: ["owner"],
  },
];

interface Props {
  userEmail: string;
  userName: string;
  userRole: "owner" | "manager" | "editor";
}

export default function AdminSidebar({ userEmail, userName, userRole }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="w-60 shrink-0 bg-brand-darkBg text-white flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-brand-primary">
            rentanje.com
          </span>
          <span className="text-xs text-white/40">admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <div className="text-xs text-white/50 truncate">{userName}</div>
        <div className="text-xs text-white/30 truncate">{userEmail}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 px-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Odjavi se
        </Button>
      </div>
    </aside>
  );
}
