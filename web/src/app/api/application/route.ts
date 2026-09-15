import { NextResponse } from "next/server";

/**
 * Spontaneous application endpoint.
 *
 * Accepts multipart form data including a CV. Like the contact endpoint,
 * delivery is pluggable: with RESEND_API_KEY set the application is emailed
 * with the CV attached, without it the submission is logged and accepted so
 * the form works on preview deployments with no credentials.
 */

const TO = process.env.CAREERS_TO ?? process.env.CONTACT_TO ?? "info@diwa.tg";
const FROM = process.env.CONTACT_FROM ?? "Diwa Industries <onboarding@resend.dev>";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
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

async function toAttachment(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  return { filename: file.name, content: buf.toString("base64") };
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
  for (const key of ["cv", "letter"]) {
    const file = form.get(key);
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "file_too_large" }, { status: 413 });
      }
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ error: "file_type" }, { status: 415 });
      }
      files.push(file);
    }
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "cv_required" }, { status: 400 });
  }

  const text = [
    `Candidature spontanée / Spontaneous application`,
    ``,
    `Nom / Name      : ${firstName} ${lastName}`,
    `E-mail          : ${email}`,
    `Téléphone       : ${phone}`,
    `Domaine / Field : ${field}`,
    `Niveau / Level  : ${level}`,
    ``,
    motivation,
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(
      `[application] no RESEND_API_KEY set — not delivered. ` +
        `${files.length} file(s): ${files.map((f) => f.name).join(", ")}\n${text}`,
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const attachments = await Promise.all(files.map(toAttachment));

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `[Candidature] ${firstName} ${lastName} — ${field || "spontanée"}`,
      text,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error("[application] resend failed", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
