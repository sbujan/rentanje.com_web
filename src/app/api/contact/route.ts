import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(5).max(2000),
});

// Simple in-memory rate limiter: max 5 requests per IP per minute
const rateLimitMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const max = 5;
  const hits = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < window);
  if (hits.length >= max) return true;
  hits.push(now);
  rateLimitMap.set(ip, hits);
  return false;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { name, email, message } = parsed.data;
  const fromEmail = process.env.FROM_EMAIL ?? "mail@list360.agency";
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@rentanje.com";
  const resend = new Resend(process.env.RESEND_API_KEY);

  const safeName = esc(name);
  const safeEmail = esc(email);
  const safeMessage = esc(message).replace(/\n/g, "<br/>");

  try {
    await resend.emails.send({
      from: `rentanje.com <${fromEmail}>`,
      to: adminEmail,
      subject: `Kontakt poruka od ${safeName}`,
      html: `<p><strong>Ime:</strong> ${safeName}</p><p><strong>E-mail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p><p><strong>Poruka:</strong></p><p>${safeMessage}</p>`,
      replyTo: email,
    });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
