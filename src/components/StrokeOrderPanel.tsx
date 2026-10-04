import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import HanziGlyph from './HanziGlyph';
import { usePrefs } from '../context/PrefsContext';
import type { TKey } from '../i18n';

interface Props {
  /** The current keyword (e.g. 身體) shown on the word card */
  word: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** e.g. "第 3 / 12" shown in the panel header (keyword position) */
  positionLabel: string;
  onClose: () => void;
}

const HANZI_RE = /\p{Script=Han}/u;

/** Keep only the Chinese characters of a keyword (stroke order only exists for hanzi). */
function extractHanzi(word: string): string[] {
  return [...word].filter((ch) => HANZI_RE.test(ch));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Writer = any;

/* Animation-speed presets for how fast the strokes are drawn (not voice speed). */
const STROKE_PRESETS: { labelKey: TKey; speed: number; delay: number }[] = [
  { labelKey: 'stroke.speedSlow', speed: 0.5, delay: 700 },
  { labelKey: 'stroke.speedNormal', speed: 1, delay: 320 },
  { labelKey: 'stroke.speedFast', speed: 1.9, delay: 140 },
];
const STROKE_SPEED_KEY = 'stroke_speed';

function loadStrokeSpeedIdx(): number {
  const raw = Number(localStorage.getItem(STROKE_SPEED_KEY));
  return Number.isInteger(raw) && raw >= 0 && raw < STROKE_PRESETS.length ? raw : 1;
}

/**
 * Shows the 筆順 (stroke order) of ONE character at a time. The child taps
 * 下一個字 to move through each character of the keyword (e.g. 身 → 體); once
 * the last character is reached the button becomes 下一個詞 and steps to the
 * next keyword on the card (and vice-versa with the back button).
 */
export default function StrokeOrderPanel({
  word,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  positionLabel,
  onClose,
}: Props) {
  const { t } = usePrefs();
  const chars = extractHanzi(word);
  const [charIndex, setCharIndex] = useState(0);
  const [speedIdx, setSpeedIdx] = useState<number>(() => loadStrokeSpeedIdx());
  const boxRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<Writer>(undefined);
  const [count, setCount] = useState<number | undefined>(undefined);
  const [boxSize, setBoxSize] = useState(240);

  // Keep the drawing exactly as large as the box by measuring the container.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) setBoxSize(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset to the first character whenever the keyword changes.
  useEffect(() => {
    setCharIndex(0);
  }, [word]);

  const safeIndex = Math.min(charIndex, Math.max(0, chars.length - 1));
  const activeChar = chars[safeIndex] ?? '';
  const isFirstChar = safeIndex === 0;
  const isLastChar = safeIndex >= chars.length - 1;

  // Build a writer for the active character and animate its strokes in order.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !activeChar) return;
    const preset = STROKE_PRESETS[speedIdx] ?? STROKE_PRESETS[1];
    el.innerHTML = '';
    const writer = HanziWriter.create(el, activeChar, {
      width: boxSize,
      height: boxSize,
      padding: 0, // no inner padding so the character fills the whole box
      showCharacter: false, // only the faint outline guide is shown...
      showOutline: true,
      strokeColor: '#6C63FF', // ...and the coloured strokes are drawn by the animation
      outlineColor: 'rgba(108, 99, 255, 0.22)',
      strokeWidth: 2,
      delayBetweenStrokes: preset.delay,
      strokeAnimationSpeed: preset.speed,
    });
    writerRef.current = writer;
    const t = setTimeout(() => writer.animateCharacter(), 250);
    return () => clearTimeout(t);
  }, [activeChar, speedIdx, boxSize]);

  function chooseSpeed(idx: number) {
    setSpeedIdx(idx);
    localStorage.setItem(STROKE_SPEED_KEY, String(idx));
  }

  // Stroke count for the active character (medians length = number of strokes).
  useEffect(() => {
    setCount(undefined);
    if (!activeChar) return;
    HanziWriter.loadCharacterData(activeChar)
      .then((data: any) => {
        if (data && Array.isArray(data.medians)) setCount(data.medians.length);
      })
      .catch(() => {});
  }, [activeChar]);

  function handlePrev() {
    if (!isFirstChar) setCharIndex((i) => i - 1);
    else onPrev();
  }

  function handleNext() {
    if (!isLastChar) setCharIndex((i) => i + 1);
    else onNext();
  }

  const prevDisabled = isFirstChar && !hasPrev;
  const nextDisabled = isLastChar && !hasNext;

  return (
    <div className="stroke-panel">
      <div className="stroke-panel-head">
        <span className="stroke-panel-title"><span className="ico">✍️</span> {t('stroke.title')} · {positionLabel}</span>
        <button className="btn btn-outline stroke-close" onClick={onClose}>
          <span className="ico">✕</span> {t('wordlist.collapse')}
        </button>
      </div>

      {chars.length > 0 ? (
        <>
          {/* Animation-speed selector (how fast the strokes are drawn) */}
          <div className="stroke-speed">
            <span className="stroke-speed-label">{t('stroke.speedLabel')}</span>
            {STROKE_PRESETS.map((p, i) => (
              <button
                key={p.labelKey}
                type="button"
                className={`stroke-speed-btn${i === speedIdx ? ' on' : ''}`}
                onClick={() => chooseSpeed(i)}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>

          {/* Keyword strip, highlighting the character currently being shown.
              For long sentences/paragraphs the strip stays as plain text (glyph
              rendering is only used for short words to avoid heavy per-char SVGs). */}
          <div className="stroke-word-strip">
            {(() => {
              const useGlyphStrip = chars.length <= 12;
              let hanziSeen = -1;
              return [...word].map((ch, i) => {
                const isHanzi = HANZI_RE.test(ch);
                if (isHanzi) hanziSeen += 1;
                const isActive = isHanzi && hanziSeen === safeIndex;
                return (
                  <span
                    key={i}
                    className={`stroke-word-char${isActive ? ' active' : ''}${!isHanzi ? ' other' : ''}`}
                  >
                    {isHanzi && useGlyphStrip ? <HanziGlyph key={`${i}-${isActive}`} char={ch} /> : ch}
                  </span>
                );
              });
            })()}
          </div>

          <div className="stroke-single">
            <div className="stroke-single-label"><HanziGlyph char={activeChar} /></div>
            <div className="stroke-box" ref={(el) => { boxRef.current = el; }} />
            <div className="stroke-char-meta">
              <span className="stroke-pos">{t('stroke.charPos', { current: safeIndex + 1, total: chars.length })}</span>
              {count ? <span>{t('stroke.strokes', { n: count })}</span> : null}
              <button
                className="btn btn-outline stroke-replay"
                onClick={() => writerRef.current?.animateCharacter()}
              >
                <span className="ico">▶</span> {t('speech.replay')}
              </button>
            </div>
          </div>

          <div className="stroke-nav">
            <button className="btn btn-outline" onClick={handlePrev} disabled={prevDisabled}>
              {isFirstChar ? <><span className="ico">←</span> {t('stroke.prevWord')}</> : <><span className="ico">←</span> {t('stroke.prevChar')}</>}
            </button>
            <button className="btn btn-outline" onClick={handleNext} disabled={nextDisabled}>
              {isLastChar ? <>{t('stroke.nextWord')} <span className="ico">→</span></> : <>{t('stroke.nextChar')} <span className="ico">→</span></>}
            </button>
          </div>
        </>
      ) : (
        <p className="stroke-empty">{t('stroke.empty')}</p>
      )}
    </div>
  );
}
