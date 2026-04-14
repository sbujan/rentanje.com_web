import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  href?: string;
  label: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  /** Primary gradient color (hex) */
  color: string;
  /** Dark end of the gradient — defaults to brand darkBg */
  colorTo?: string;
  imageUrl?: string;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  color,
  colorTo = "#1A1A2E",
  imageUrl,
}: PageHeroProps) {
  return (
    <section className="relative text-white py-12 px-4 overflow-hidden">
      {/* Background image (optional) */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? `linear-gradient(135deg, ${color}CC 0%, ${colorTo}F0 100%)`
            : `linear-gradient(135deg, ${color} 0%, ${colorTo} 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-white/60 mb-4">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-white/80 text-lg max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
