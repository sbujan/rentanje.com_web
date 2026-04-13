import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 422 });

  const { name, email, message } = parsed.data;
  const fromEmail = process.env.FROM_EMAIL ?? "mail@list360.agency";
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@rentanje.com";
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: `rentanje.com <${fromEmail}>`,
      to: adminEmail,
      subject: `Kontakt poruka od ${name}`,
      html: `<p><strong>Ime:</strong> ${name}</p><p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Poruka:</strong></p><p>${message.replace(/\n/g, "<br/>")}</p>`,
      replyTo: email,
    });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
