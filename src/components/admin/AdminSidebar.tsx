"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  // Mobile drawer state. Ignored from `lg` up, where the aside is always in flow.
  const [open, setOpen] = useState(false);

  // Navigating on mobile should dismiss the drawer, otherwise it stays over
  // the page the user just asked for.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; body scroll is locked so the page behind doesn't scroll
  // under the drawer on iOS.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const logo = (
    <Image
      src="/rentanje-logo.svg"
      alt="rentanje.com"
      width={100}
      height={56}
      className="h-7 w-auto brightness-0 invert"
    />
  );

  return (
    <>
      {/* Mobile top bar — the only way in to the nav below `lg`. */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center gap-3 bg-brand-darkBg px-4 text-white">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Otvori izbornik"
          aria-expanded={open}
          aria-controls="admin-nav"
          className="-ml-2 rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          {logo}
          <span className="text-xs font-medium text-white/40">admin</span>
        </Link>
      </header>

      {/* Backdrop — click-to-dismiss for the drawer. */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-nav"
        className={cn(
          // Mobile: off-canvas drawer, full viewport height, own scroll area.
          "fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-brand-darkBg text-white",
          // `visibility` is transitioned alongside the slide so the closing
          // animation still plays, but a closed drawer stays out of the tab order.
          "transition-[transform,visibility] duration-200 ease-out",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
          // Desktop: back in the flow, sticky full-height column.
          "lg:visible lg:sticky lg:z-auto lg:w-60 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:transition-none"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            {logo}
            <span className="text-xs font-medium text-white/40">admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Zatvori izbornik"
            className="-mr-2 rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav — scrolls on its own when the list outgrows the viewport. */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-4">
          {visibleItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="shrink-0 space-y-2 border-t border-white/10 px-4 py-4">
          <div className="truncate text-xs text-white/50">{userName}</div>
          <div className="truncate text-xs text-white/30">{userEmail}</div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-2 text-white/60 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Odjavi se
          </Button>
        </div>
      </aside>
    </>
  );
}
