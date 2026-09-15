import { NextResponse } from "next/server";
import { MAX_ATTACHMENT_BYTES, sendMail, type Attachment } from "@/lib/mailer";

/**
 * Spontaneous application endpoint.
 *
 * Accepts multipart form data including a CV. Delivery provider is chosen in
 * src/lib/mailer.ts from whichever credentials the deployment has.
 *
 * Note on the size cap: Microsoft Graph's sendMail carries attachments inline
 * and caps the whole request at 4 MB, and base64 inflates bytes by about a
 * third. MAX_ATTACHMENT_BYTES is set accordingly and the form advertises the
 * same number.
 */

const TO = process.env.CAREERS_TO ?? process.env.CONTACT_TO ?? "info@diwa.tg";
const ALLOWED = new Set(["application/pdf"]);

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function toAttachment(file: File): Promise<Attachment> {
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    filename: file.name,
    content: buf.toString("base64"),
    contentType: file.type || "application/pdf",
  };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }

  // Honeypot: answer 200 so the bot believes it succeeded.
  if (String(form.get("company") ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const firstName = String(form.get("firstName") ?? "").trim();
  const lastName = String(form.get("lastName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const field = String(form.get("field") ?? "").trim();
  const level = String(form.get("level") ?? "").trim();
  const motivation = String(form.get("motivation") ?? "").trim();

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !motivation ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (motivation.length > 8000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  const files: File[] = [];
  let totalBytes = 0;

  for (const key of ["cv", "letter"]) {
    const file = form.get(key);
    if (file instanceof File && file.size > 0) {
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ error: "file_type" }, { status: 415 });
      }
      totalBytes += file.size;
      if (file.size > MAX_ATTACHMENT_BYTES || totalBytes > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json({ error: "file_too_large" }, { status: 413 });
      }
      files.push(file);
    }
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "cv_required" }, { status: 400 });
  }

  const result = await sendMail({
    to: TO,
    replyTo: email,
    subject: `[Candidature] ${firstName} ${lastName} — ${field || "spontanée"}`,
    text: [
      "Candidature spontanée / Spontaneous application",
      "",
      `Nom / Name      : ${firstName} ${lastName}`,
      `E-mail          : ${email}`,
      `Téléphone       : ${phone}`,
      `Domaine / Field : ${field}`,
      `Niveau / Level  : ${level}`,
      "",
      motivation,
    ].join("\n"),
    attachments: await Promise.all(files.map(toAttachment)),
  });

  if (!result.ok) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: result.delivered });
}
