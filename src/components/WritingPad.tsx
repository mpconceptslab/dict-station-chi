import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { usePrefs } from '../context/PrefsContext';

export interface WritingPadHandle {
  capture: () => string | null;
  clear: () => void;
  hasDrawn: () => boolean;
}

interface WritingPadProps {
  onCapture?: (imageData: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  hideControls?: boolean;
}

const WritingPad = forwardRef<WritingPadHandle, WritingPadProps>(function WritingPad({ onCapture, onClear, disabled, hideControls }, ref) {
  const { t } = usePrefs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnState, setHasDrawn] = useState(false);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    capture: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const imageData = canvas.toDataURL('image/png');
      clearCanvas();
      return imageData;
    },
    clear: clearCanvas,
    hasDrawn: () => hasDrawnState,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with 2x scale for better OCR accuracy
    const scale = 2;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Prevent default touch behaviors (scrolling, zooming) on the canvas
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });
    canvas.addEventListener('touchend', preventDefault, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
      canvas.removeEventListener('touchend', preventDefault);
    };
  }, []);

  const getPos = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onClear?.();
  }, [onClear]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    onCapture?.(imageData);
    clearCanvas();
  };

  return (
    <div className="writing-pad-container">
      <canvas
        ref={canvasRef}
        className="writing-pad-canvas"
        style={{ touchAction: 'none' }}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      {!hideControls && (
        <div className="writing-pad-controls">
          <button
            className="btn btn-outline"
            onClick={clearCanvas}
            disabled={!hasDrawnState || disabled}
          >
            {t('revision.clear')}
          </button>
          <button
            className="btn btn-primary"
            onClick={captureImage}
            disabled={!hasDrawnState || disabled}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
});

export default WritingPad;
