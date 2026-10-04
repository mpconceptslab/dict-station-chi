import { useRef, useState } from 'react';
import WritingPad from './WritingPad';
import type { WritingPadHandle } from './WritingPad';
import type { HandwritingCell } from '../utils/storage';
import { usePrefs } from '../context/PrefsContext';

/** Stored/downscaled box size (px). Kept small so a whole syllabus stays a few hundred KB. */
const BOX_PX = 140;

/**
 * Downscale a captured writing-pad PNG to a fixed square so cell images stay tiny
 * in IndexedDB and composite cleanly onto the OCR sheet.
 */
function downscale(dataUrl: string, size = BOX_PX): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

interface HandwritingGridProps {
  /** One cell per writable target character. The grid never reveals `targetChar`. */
  cells: HandwritingCell[];
  /** Store (or clear, with `undefined`) the drawing for a single box. */
  onCellImage: (index: number, image: string | undefined) => void;
  disabled?: boolean;
}

/**
 * Positional handwriting input: a row of empty boxes, one per target character.
 * Tap a box to enlarge it into a writing modal; the drawing is stored per box so
 * "which stroke belongs to which target" is answered purely by position. No OCR
 * happens here — the whole syllabus is checked in one pass later.
 */
export default function HandwritingGrid({ cells, onCellImage, disabled }: HandwritingGridProps) {
  const { t } = usePrefs();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const padRef = useRef<WritingPadHandle>(null);

  async function handleSave() {
    if (activeIndex === null || !padRef.current) return;
    const raw = padRef.current.capture(); // returns a PNG dataURL and clears the pad
    setActiveIndex(null);
    if (!raw) return;
    const small = await downscale(raw);
    onCellImage(activeIndex, small);
  }

  return (
    <div className="hw-grid">
      <div className="hw-grid-boxes">
        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            className={`hw-cell${cell.image ? ' filled' : ''}`}
            disabled={disabled}
            onClick={() => setActiveIndex(i)}
            aria-label={t('hw.cellAria', { n: i + 1 })}
          >
            {cell.image ? (
              <img src={cell.image} alt="" />
            ) : (
              <span className="hw-cell-index">{i + 1}</span>
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="hw-modal-overlay" onClick={() => setActiveIndex(null)}>
          <div className="hw-modal" onClick={(e) => e.stopPropagation()}>
            <p className="hw-modal-title">{t('hw.modalTitle', { n: activeIndex + 1 })}</p>
            <div className="hw-modal-pad">
              <WritingPad ref={padRef} hideControls disabled={disabled} />
            </div>
            <div className="hw-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => padRef.current?.clear()}>
                {t('revision.clear')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveIndex(null)}>
                {t('common.cancel')}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                OK
              </button>
            </div>
            {cells[activeIndex]?.image && (
              <button
                type="button"
                className="hw-modal-clear-cell"
                onClick={() => {
                  onCellImage(activeIndex, undefined);
                  setActiveIndex(null);
                }}
              >
                {t('hw.clearCell')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
