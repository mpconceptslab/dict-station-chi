import type { HandwritingCell } from '../utils/storage';

/** One drawn box placed on a composite sheet, with its pixel rectangle. */
export interface SheetCellRect {
  itemIndex: number;
  charIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Sheet {
  index: number;
  /** PNG data URL of the whole sheet (handwriting only — no printed answers). */
  dataUrl: string;
  width: number;
  height: number;
  /** Layout map: only cells that actually contain a drawing. */
  cells: SheetCellRect[];
}

/** One dictated item and its per-character cells. */
export interface SheetItem {
  itemIndex: number;
  cells: HandwritingCell[];
}

/**
 * Cost/accuracy budget: at most this many characters per composite image.
 * ~80 keeps each character ~110px tall (very high handwriting accuracy) while
 * collapsing a 10-keyword + 10-sentence syllabus into roughly 2 scans.
 */
export const MAX_CHARS_PER_SHEET = 80;

const CELL = 120;   // px per box on the sheet
const GAP = 14;     // px between boxes (keeps the OCR from merging neighbours)
const MARGIN = 28;  // px sheet margin
const COLS = 10;    // boxes per row

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('failed to load cell image'));
    img.src = src;
  });
}

/**
 * Composite every drawn cell (across all items) into high-resolution sheets of at
 * most MAX_CHARS_PER_SHEET characters each. Cells are packed in order and may
 * split across sheets freely — the returned layout map records each cell's
 * sheet position, so results map back by coordinate regardless of packing.
 */
export async function buildSheets(items: SheetItem[]): Promise<Sheet[]> {
  const drawn: { itemIndex: number; cell: HandwritingCell }[] = [];
  for (const it of items) {
    for (const c of it.cells) {
      if (c.image) drawn.push({ itemIndex: it.itemIndex, cell: c });
    }
  }
  if (drawn.length === 0) return [];

  const imgs = await Promise.all(drawn.map((d) => loadImage(d.cell.image as string)));

  const sheets: Sheet[] = [];
  let sheetIndex = 0;
  for (let start = 0; start < drawn.length; start += MAX_CHARS_PER_SHEET, sheetIndex++) {
    const chunk = drawn.slice(start, start + MAX_CHARS_PER_SHEET);
    const chunkImgs = imgs.slice(start, start + MAX_CHARS_PER_SHEET);

    const rows = Math.max(1, Math.ceil(chunk.length / COLS));
    const width = MARGIN * 2 + COLS * CELL + (COLS - 1) * GAP;
    const height = MARGIN * 2 + rows * CELL + Math.max(0, rows - 1) * GAP;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const rects: SheetCellRect[] = [];
    chunk.forEach((d, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = MARGIN + col * (CELL + GAP);
      const y = MARGIN + row * (CELL + GAP);

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);

      const inset = 6;
      ctx.drawImage(chunkImgs[i], x + inset, y + inset, CELL - inset * 2, CELL - inset * 2);

      rects.push({ itemIndex: d.itemIndex, charIndex: d.cell.charIndex, x, y, w: CELL, h: CELL });
    });

    sheets.push({ index: sheetIndex, dataUrl: canvas.toDataURL('image/png'), width, height, cells: rects });
  }
  return sheets;
}
