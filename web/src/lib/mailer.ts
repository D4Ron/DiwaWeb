/**
 * Outbound mail, with the provider chosen by whichever credentials exist.
 *
 * The deploying organisation runs Microsoft Entra ID, so Microsoft Graph is
 * the primary path: mail leaves from a real mailbox in their own tenant, and
 * with federated credentials there is no long-lived secret to store anywhere.
 * Resend remains as a fallback for anyone deploying outside that tenant, and
 * a console provider keeps the forms working on previews with no credentials
 * at all.
 *
 * Selection order:
 *   1. graph   — AZURE_TENANT_ID + AZURE_CLIENT_ID + (federated or secret)
 *   2. resend  — RESEND_API_KEY
 *   3. console — neither; logs and reports "not delivered"
 *
 * No secret is ever read from a file in the repo. Whoever deploys owns them.
 */

export type Attachment = {
  filename: string;
  /** base64, no data: prefix */
  content: string;
  contentType: string;
};

export type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
};

export type SendResult = {
  ok: boolean;
  provider: "graph" | "resend" | "console";
  delivered: boolean;
  error?: string;
};

/**
 * Graph's sendMail action carries the message inline, and the whole request
 * is capped at 4 MB. Base64 inflates bytes by about a third, so the usable
 * attachment budget is well under that. 3 MB of raw file is the safe ceiling
 * and is what the forms advertise.
 */
export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

function providerName(): SendResult["provider"] {
  if (process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_ID) return "graph";
  if (process.env.RESEND_API_KEY) return "resend";
  return "console";
}

/**
 * Entra access token for Graph.
 *
 * Prefers a federated credential: on Vercel, VERCEL_OIDC_TOKEN is exchanged
 * for an Entra token via client assertion, so nothing secret is stored in the
 * project at all. Falls back to a client secret where federation is not set
 * up — on Azure compute, use a managed identity instead of either.
 */
async function graphToken(): Promise<string> {
  const tenant = process.env.AZURE_TENANT_ID!;
  const clientId = process.env.AZURE_CLIENT_ID!;
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: clientId,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const federated = process.env.VERCEL_OIDC_TOKEN;
  if (federated) {
    body.set(
      "client_assertion_type",
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    );
    body.set("client_assertion", federated);
  } else if (process.env.AZURE_CLIENT_SECRET) {
    body.set("client_secret", process.env.AZURE_CLIENT_SECRET);
  } else {
    throw new Error(
      "Graph selected but neither VERCEL_OIDC_TOKEN nor AZURE_CLIENT_SECRET is available",
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Entra token request failed: ${res.status} ${await res.text()}`);
  }
  return ((await res.json()) as { access_token: string }).access_token;
}

async function sendViaGraph(mail: Mail): Promise<SendResult> {
  // The mailbox the message is sent from. Must be a real mailbox in the
  // tenant, and must be the one the app is scoped to — see README.
  const sender = process.env.GRAPH_SENDER;
  if (!sender) {
    return {
      ok: false,
      provider: "graph",
      delivered: false,
      error: "GRAPH_SENDER is not set",
    };
  }

  const token = await graphToken();

  const message: Record<string, unknown> = {
    subject: mail.subject,
    body: { contentType: "Text", content: mail.text },
    toRecipients: [{ emailAddress: { address: mail.to } }],
  };

  if (mail.replyTo) {
    message.replyTo = [{ emailAddress: { address: mail.replyTo } }];
  }

  if (mail.attachments?.length) {
    message.attachments = mail.attachments.map((a) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: a.filename,
      contentType: a.contentType,
      contentBytes: a.content,
    }));
  }

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );

  // sendMail answers 202 Accepted with no body.
  if (res.status !== 202) {
    return {
      ok: false,
      provider: "graph",
      delivered: false,
      error: `Graph sendMail failed: ${res.status} ${await res.text()}`,
    };
  }

  return { ok: true, provider: "graph", delivered: true };
}

async function sendViaResend(mail: Mail): Promise<SendResult> {
  const from = process.env.CONTACT_FROM ?? "Diwa Industries <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      attachments: mail.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    }),
  });

  if (!res.ok) {
    return {
      ok: false,
      provider: "resend",
      delivered: false,
      error: `Resend failed: ${res.status} ${await res.text()}`,
    };
  }
  return { ok: true, provider: "resend", delivered: true };
}

/**
 * Send, or log and report honestly that nothing was delivered.
 * Never throws — callers decide what the visitor sees.
 */
export async function sendMail(mail: Mail): Promise<SendResult> {
  const provider = providerName();

  if (provider === "console") {
    console.info(
      `[mail] no provider configured — not delivered\n` +
        `to: ${mail.to}\nsubject: ${mail.subject}\n` +
        (mail.attachments?.length
          ? `attachments: ${mail.attachments.map((a) => a.filename).join(", ")}\n`
          : "") +
        mail.text,
    );
    return { ok: true, provider: "console", delivered: false };
  }

  try {
    return provider === "graph"
      ? await sendViaGraph(mail)
      : await sendViaResend(mail);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[mail] ${provider} threw: ${error}`);
    return { ok: false, provider, delivered: false, error };
  }
}
