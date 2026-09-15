import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * Delivery is intentionally pluggable: set RESEND_API_KEY and mail goes out
 * through Resend. Without it the submission is logged and accepted, so the
 * form works in development and on preview deployments without credentials.
 */

const TO = process.env.CONTACT_TO ?? "info@diwa.tg";
const FROM = process.env.CONTACT_FROM ?? "Diwa Industries <onboarding@resend.dev>";

// Crude in-memory rate limit: enough to stop casual abuse on a single
// instance. Put a real limiter in front if the form ever gets hammered.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Honeypot: a real person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (message.length > 5000 || name.length > 200) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  const text = [
    `Nom / Name: ${name}`,
    `E-mail: ${email}`,
    `Objet / Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] no RESEND_API_KEY set — submission not delivered:\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

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
      subject: `[diwaindustries.tg] ${subject || "Message"} — ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
