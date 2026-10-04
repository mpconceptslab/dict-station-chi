import type { Sheet } from '../utils/sheetBuilder';

/**
 * Single-pass AI check against the Google Cloud Vision proxy.
 *
 * The whole syllabus is composited into a small number of sheets (<=80 chars each)
 * and each sheet is annotated ONCE. Recognised symbols carry normalised bounding
 * boxes; we map each symbol to the nearest known cell (we generated the grid, so
 * every cell's pixel rect is known) — position is identity.
 */

const ENDPOINT = import.meta.env.VITE_VISION_ENDPOINT || '/.netlify/functions/vision-ocr';

interface ProxySymbol {
  text: string;
  cx: number; // normalised 0..1
  cy: number; // normalised 0..1
}
interface ProxyResponse {
  symbols?: ProxySymbol[];
  error?: string;
}

/** Map of `"itemIndex:charIndex"` -> recognised text for that box. */
export type RecognizedMap = Map<string, string>;

export function cellKey(itemIndex: number, charIndex: number): string {
  return `${itemIndex}:${charIndex}`;
}

/**
 * Send every sheet to the proxy and fold the recognised symbols back onto cells.
 * Throws on network/proxy failure so the caller can fall back to manual marking.
 */
export async function recognizeSheets(sheets: Sheet[], token: string): Promise<RecognizedMap> {
  const result: RecognizedMap = new Map();

  for (const sheet of sheets) {
    const base64 = sheet.dataUrl.split(',')[1] || '';
    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-app-token': token },
      body: JSON.stringify({
        image: base64,
        width: sheet.width,
        height: sheet.height,
        langHints: ['zh-HK', 'zh-TW', 'en'],
      }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      throw new Error(`vision proxy ${resp.status}: ${detail}`);
    }
    const data = (await resp.json()) as ProxyResponse;
    if (data.error) throw new Error(data.error);

    // Nearest-cell assignment. Cells are CELL=120px on a pitch of ~134px, so the
    // correct cell is essentially always the closest centre; reject far strays.
    const maxDist = 120;
    for (const sym of data.symbols || []) {
      if (!sym.text || !sym.text.trim()) continue;
      const px = sym.cx * sheet.width;
      const py = sym.cy * sheet.height;
      let best: Sheet['cells'][number] | null = null;
      let bestD = Infinity;
      for (const c of sheet.cells) {
        const ccx = c.x + c.w / 2;
        const ccy = c.y + c.h / 2;
        const d = Math.hypot(px - ccx, py - ccy);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (best && bestD <= maxDist) {
        const key = cellKey(best.itemIndex, best.charIndex);
        result.set(key, (result.get(key) || '') + sym.text.trim());
      }
    }
  }

  return result;
}

/* ── Scoring helpers ─────────────────────────────────────────────────────── */

export function normalizeChar(s: string): string {
  return (s || '').replace(/\s+/g, '').trim();
}

/** True when the recognised text matches the target character (lenient on extras). */
export function isCharCorrect(recognized: string | undefined, target: string): boolean {
  const r = normalizeChar(recognized || '');
  const t = normalizeChar(target);
  if (!r || !t) return false;
  if (r === t) return true;
  return r.includes(t) || t.includes(r);
}
