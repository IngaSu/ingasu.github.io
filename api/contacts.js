// Customers.ai contact_stored webhook receiver: POST /api/contacts
//
// Uses only the Web-standard Request/Response and Web Crypto APIs, so it runs as a
// Vercel function at /api/contacts (and, with a thin wrapper, on Cloudflare Workers,
// Netlify or Deno). GitHub Pages cannot run it: deploy it to one of those hosts.
//
// Env:
//   CAI_WEBHOOK_SECRET  the webhook's signing secret (shown once when the webhook is created)

const encoder = new TextEncoder();

// X-Message-Id values already handled. In-memory only, so it resets on cold starts:
// swap for a durable store (KV, Redis, a DB unique key) to make retries fully idempotent.
const seen = new Set();

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time string comparison.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// X-Signature is the hex HMAC-SHA256 of the raw request body, keyed with the webhook secret.
export async function verifySignature(rawBody, signature, secret) {
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, rawBody);
  return safeEqual(toHex(mac), signature.trim().toLowerCase());
}

async function saveContact(contact, meta) {
  // TODO: write to your CRM / database. Keep it fast: the sender times out and retries.
  console.log("contact_stored", meta.messageId, contact.id, contact.subaccountId);
}

export async function POST(request) {
  const secret = process.env.CAI_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  // Verify against the exact bytes received, before any parsing.
  const rawBody = await request.arrayBuffer();
  const ok = await verifySignature(rawBody, request.headers.get("X-Signature"), secret);
  if (!ok) return new Response("Invalid signature", { status: 401 });

  const messageId = request.headers.get("X-Message-Id");
  if (messageId && seen.has(messageId)) return new Response(null, { status: 200 }); // a retry

  let contact;
  try {
    contact = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  await saveContact(contact, {
    messageId,
    webhookId: request.headers.get("X-Webhook-Id"),
    eventTs: Number(request.headers.get("X-Event-TS")) || null,
    attempt: Number(request.headers.get("X-Attempt")) || 1,
  });
  if (messageId) seen.add(messageId);

  return new Response(null, { status: 200 });
}
