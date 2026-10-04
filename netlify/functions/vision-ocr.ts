// Netlify Function: Google Cloud Vision proxy.
// Keeps GOOGLE_VISION_API_KEY on the server (never shipped to the browser) and
// returns a flattened, normalised list of recognised symbols so the client can map
// them back onto its known grid cells. One call per composite sheet.

// Netlify provides `process.env` at runtime; declare it locally so this function
// type-checks without pulling @types/node into the browser app's build.
declare const process: { env: Record<string, string | undefined> };

interface SymbolOut {
  text: string;
  cx: number;
  cy: number;
}

const VISION_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

// Minimal in-memory per-IP rate limit (best effort; resets when the instance cools).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

export default async function handler(req: Request, context: { ip?: string }) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Basic abuse guard: require the app token header and rate-limit per IP.
  if (!req.headers.get('x-app-token')) return json({ error: 'Missing token' }, 401);
  const ip = context?.ip || req.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimited(ip)) return json({ error: 'Rate limited' }, 429);

  const key = process.env.GOOGLE_VISION_API_KEY;
  if (!key) return json({ error: 'Server missing GOOGLE_VISION_API_KEY' }, 500);

  let body: { image?: string; width?: number; height?: number; langHints?: string[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  if (!body.image) return json({ error: 'Missing image' }, 400);

  const visionBody = {
    requests: [
      {
        image: { content: body.image },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        imageContext: { languageHints: body.langHints || ['zh-HK', 'zh-TW', 'en'] },
      },
    ],
  };

  let data: any;
  try {
    const r = await fetch(`${VISION_ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visionBody),
    });
    data = await r.json();
    if (!r.ok) {
      const msg = data?.error?.message || `Vision ${r.status}`;
      return json({ error: msg }, 502);
    }
  } catch (e) {
    return json({ error: `Vision request failed: ${(e as Error).message}` }, 502);
  }

  const resp = data?.responses?.[0];
  const symbols: SymbolOut[] = [];
  const imgW = body.width || 1;
  const imgH = body.height || 1;

  // Preferred path: per-symbol bounding boxes (normalised 0..1).
  const pages = resp?.fullTextAnnotation?.pages || [];
  for (const page of pages) {
    for (const block of page.blocks || []) {
      for (const para of block.paragraphs || []) {
        for (const word of para.words || []) {
          for (const sym of word.symbols || []) {
            const v = sym.boundingBox?.vertices;
            if (v && v.length === 4) {
              symbols.push({
                text: sym.text || '',
                cx: (v[0].x + v[2].x) / 2 / imgW,
                cy: (v[0].y + v[2].y) / 2 / imgH,
              });
            }
          }
        }
      }
    }
  }

  // Fallback: whole-token boxes (pixel coords) normalised with the client's dims.
  if (symbols.length === 0 && Array.isArray(resp?.textAnnotations) && resp.textAnnotations.length > 1) {
    const w = body.width || 1;
    const h = body.height || 1;
    for (let i = 1; i < resp.textAnnotations.length; i++) {
      const ta = resp.textAnnotations[i];
      const v = ta.boundingPoly?.vertices;
      if (v && v.length === 4) {
        symbols.push({
          text: (ta.description || '').trim(),
          cx: (v[0].x + v[2].x) / 2 / w,
          cy: (v[0].y + v[2].y) / 2 / h,
        });
      }
    }
  }

  return json({ symbols });
}
