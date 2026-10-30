import { ChevronDown } from "lucide-react";
import { jsonLdSafe } from "@/lib/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Keep only well-formed entries; DB `faq` columns are untyped JSON. */
export function normalizeFaq(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (f): f is FaqItem =>
      !!f &&
      typeof f === "object" &&
      typeof (f as FaqItem).question === "string" &&
      typeof (f as FaqItem).answer === "string" &&
      (f as FaqItem).question.trim() !== "" &&
      (f as FaqItem).answer.trim() !== ""
  );
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * FAQ accordion plus its FAQPage JSON-LD, built from the same array so the
 * markup can never drift from what the visitor sees. Shared by product,
 * category and brand hub pages.
 */
export default function FaqAccordion({
  items,
  title = "Često postavljena pitanja",
  headingLevel = "h2",
}: {
  items: FaqItem[];
  title?: string;
  headingLevel?: "h2" | "h3";
}) {
  if (items.length === 0) return null;
  const Heading = headingLevel;
  return (
    <div className="space-y-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(buildFaqSchema(items)) }}
      />
      <Heading className="font-display font-bold text-lg text-brand-text">{title}</Heading>
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
        {items.map((item, i) => (
          <details key={i} className="group bg-white">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none font-medium text-brand-text text-sm hover:bg-gray-50 transition-colors">
              {item.question}
              <ChevronDown className="h-4 w-4 text-brand-muted flex-shrink-0 ml-2 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-sm text-brand-muted leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
