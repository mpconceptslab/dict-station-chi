import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../context/PrefsContext';

interface ImageCropperProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

type CropRect = { x: number; y: number; w: number; h: number }; // percentages (0-100)
type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se';

const MIN_SIZE = 8; // minimum crop size in %

export default function ImageCropper({ imageUrl, onCancel, onConfirm }: ImageCropperProps) {
  const { t } = usePrefs();
  const [crop, setCrop] = useState<CropRect>({ x: 4, y: 4, w: 92, h: 92 });
  const [ratio, setRatio] = useState<number | null>(null); // natural width / height
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ mode: DragMode; startX: number; startY: number; orig: CropRect } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Once the image loads, lock the wrapper to its aspect ratio so the
  // percentage-based crop rect maps exactly onto image pixels
  useEffect(() => {
    const img = new Image();
    img.onload = () => setRatio(img.naturalWidth / img.naturalHeight);
    img.src = imageUrl;
  }, [imageUrl]);

  function handlePointerDown(e: React.PointerEvent) {
    const target = e.target as HTMLElement;
    const modeAttr = target.getAttribute('data-mode');
    let mode: DragMode | null = null;
    if (modeAttr === 'nw' || modeAttr === 'ne' || modeAttr === 'sw' || modeAttr === 'se') {
      mode = modeAttr;
    } else if (target.closest('.cropper-rect')) {
      mode = 'move';
    }
    if (!mode) return; // tapped outside the crop rect — ignore
    dragRef.current = { mode, startX: e.clientX, startY: e.clientY, orig: { ...crop } };
    setIsDragging(true);
    wrapRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    const o = drag.orig;

    if (drag.mode === 'move') {
      const x = Math.min(100 - o.w, Math.max(0, o.x + dx));
      const y = Math.min(100 - o.h, Math.max(0, o.y + dy));
      setCrop({ ...o, x, y });
    } else {
      let { x, y, w, h } = o;
      if (drag.mode === 'se') {
        w = Math.min(100 - x, Math.max(MIN_SIZE, o.w + dx));
        h = Math.min(100 - y, Math.max(MIN_SIZE, o.h + dy));
      } else if (drag.mode === 'sw') {
        const newW = Math.min(o.x + o.w, Math.max(MIN_SIZE, o.w - dx));
        x = o.x + o.w - newW;
        w = newW;
        h = Math.min(100 - y, Math.max(MIN_SIZE, o.h + dy));
      } else if (drag.mode === 'ne') {
        w = Math.min(100 - x, Math.max(MIN_SIZE, o.w + dx));
        const newH = Math.min(o.y + o.h, Math.max(MIN_SIZE, o.h - dy));
        y = o.y + o.h - newH;
        h = newH;
      } else if (drag.mode === 'nw') {
        const newW = Math.min(o.x + o.w, Math.max(MIN_SIZE, o.w - dx));
        const newH = Math.min(o.y + o.h, Math.max(MIN_SIZE, o.h - dy));
        x = o.x + o.w - newW;
        y = o.y + o.h - newH;
        w = newW;
        h = newH;
      }
      setCrop({ x, y, w, h });
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    setIsDragging(false);
    try {
      wrapRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // pointer capture may already be released
    }
  }

  function handleConfirm() {
    const img = new Image();
    img.onload = () => {
      const natW = img.naturalWidth;
      const natH = img.naturalHeight;
      const sx = Math.round((crop.x / 100) * natW);
      const sy = Math.round((crop.y / 100) * natH);
      const sw = Math.max(1, Math.round((crop.w / 100) * natW));
      const sh = Math.max(1, Math.round((crop.h / 100) * natH));
      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onConfirm(imageUrl);
        return;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      onConfirm(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => {
      // Fall back to the original image if it cannot be loaded
      onConfirm(imageUrl);
    };
    img.src = imageUrl;
  }

  return (
    <div className="cropper-overlay">
      <div className="cropper-panel">
        <h3 className="cropper-title">{t('cropper.title')}</h3>
        <p className="cropper-hint">{t('cropper.hint')}</p>

        <div
          ref={wrapRef}
          className={`cropper-img-wrap ${isDragging ? 'dragging' : ''}`}
          style={ratio ? {
            aspectRatio: `${ratio}`,
            maxWidth: `calc(55vh * ${ratio})`,
            margin: '0 auto',
          } : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img src={imageUrl} alt={t('cropper.alt')} draggable={false} style={ratio ? { width: '100%', height: '100%', maxHeight: 'none' } : undefined} />
          {/* Dark mask around the crop rect */}
          <div
            className="cropper-rect"
            style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%` }}
          >
            <div className="cropper-grid-line cropper-grid-v" style={{ left: '33.33%' }} />
            <div className="cropper-grid-line cropper-grid-v" style={{ left: '66.66%' }} />
            <div className="cropper-grid-line cropper-grid-h" style={{ top: '33.33%' }} />
            <div className="cropper-grid-line cropper-grid-h" style={{ top: '66.66%' }} />
            <span data-mode="nw" className="cropper-handle handle-nw" />
            <span data-mode="ne" className="cropper-handle handle-ne" />
            <span data-mode="sw" className="cropper-handle handle-sw" />
            <span data-mode="se" className="cropper-handle handle-se" />
          </div>
        </div>

        <div className="cropper-buttons">
          <button className="btn cropper-btn-cancel" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary cropper-btn-confirm" onClick={handleConfirm}>
            <span className="ico">✅</span> {t('cropper.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
