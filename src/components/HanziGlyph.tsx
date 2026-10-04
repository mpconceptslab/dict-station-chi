import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

const HANZI_RE = /\p{Script=Han}/u;

interface Props {
  char: string;
  className?: string;
  /** Optional explicit stroke colour (hex/rgb). Defaults to the element's inherited `color`. */
  color?: string;
}

/**
 * Renders a single Chinese character as a filled, non-animated hanzi-writer
 * glyph, so plain "word" text looks exactly like the 筆順 stroke rendering.
 * The glyph self-measures: its pixel size comes from the surrounding font-size
 * and its colour from the inherited CSS `color`, so it adapts to each context
 * (word card, panel label, keyword strip, active/inactive, light/dark theme).
 */
export default function HanziGlyph({ char, className = '', color }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [tick, setTick] = useState(0);

  // Re-measure on viewport changes (root font-size changes at breakpoints).
  useEffect(() => {
    const onResize = () => setTick((t) => t + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!HANZI_RE.test(char)) return;
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const px = Math.round(parseFloat(getComputedStyle(el).fontSize)) || 28;
    const stroke = color || getComputedStyle(el).color;
    try {
      HanziWriter.create(el, char, {
        width: px,
        height: px,
        padding: 0,
        showCharacter: true, // draw the completed, filled character
        showOutline: false,
        strokeColor: stroke,
        strokeWidth: 2,
      });
    } catch {
      el.textContent = char; // graceful fallback
    }
  }, [char, color, tick]);

  if (!HANZI_RE.test(char)) {
    return <span className={className}>{char}</span>;
  }
  return <span ref={ref} className={`hanzi-glyph ${className}`.trim()} role="img" aria-label={char} />;
}
