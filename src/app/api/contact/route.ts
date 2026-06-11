import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(5).max(2000),
});

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { limited } = await checkRateLimit(ip, {
    endpoint: "contact",
    windowSeconds: 60,
    max: 5,
  });
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { name, email, message } = parsed.data;
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) {
    console.error("FROM_EMAIL not configured — contact email skipped");
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@rentanje.com";
  const resend = new Resend(process.env.RESEND_API_KEY);

  const safeName = esc(name);
  const safeEmail = esc(email);
  const safeMessage = esc(message).replace(/\n/g, "<br/>");
  // Subject is a header: no newlines, no HTML escaping needed.
  const subjectName = name.replace(/[\r\n]+/g, " ").trim();

  try {
    await resend.emails.send({
      from: `rentanje.com <${fromEmail}>`,
      to: adminEmail,
      subject: `Kontakt poruka od ${subjectName}`,
      html: `<p><strong>Ime:</strong> ${safeName}</p><p><strong>E-mail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p><p><strong>Poruka:</strong></p><p>${safeMessage}</p>`,
      replyTo: email.replace(/[\r\n]/g, ""),
    });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
