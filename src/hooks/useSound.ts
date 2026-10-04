import { useCallback, useRef } from 'react';
import { usePrefs } from '../context/PrefsContext';

type SoundName = 'tap' | 'correct' | 'wrong' | 'celebrate';

// One shared AudioContext for the whole app, created lazily on first gesture.
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const AC = w.AudioContext || w.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) {
    try {
      audioCtx = new AC();
    } catch {
      return null;
    }
  }
  // Browsers start the context suspended until a user gesture; resume it.
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

/** Schedule a single enveloped oscillator note. */
function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  peak: number
) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function playTone(name: SoundName) {
  const ctx = getCtx();
  if (!ctx) return;
  switch (name) {
    case 'tap':
      tone(ctx, 520, 0, 0.08, 'triangle', 0.14);
      break;
    case 'correct':
      tone(ctx, 660, 0, 0.12, 'sine', 0.2);
      tone(ctx, 880, 0.1, 0.14, 'sine', 0.2);
      break;
    case 'wrong':
      tone(ctx, 196, 0, 0.2, 'sawtooth', 0.12);
      break;
    case 'celebrate':
      tone(ctx, 523, 0, 0.14, 'triangle', 0.2);
      tone(ctx, 659, 0.12, 0.14, 'triangle', 0.2);
      tone(ctx, 784, 0.24, 0.16, 'triangle', 0.2);
      tone(ctx, 1047, 0.38, 0.26, 'triangle', 0.2);
      break;
  }
}

/**
 * useSound — WebAudio-synthesized sound effects + haptics, with no audio
 * assets. All feedback is gated by the persisted "音效" preference (soundOn),
 * so turning sound off also silences vibration. The AudioContext is created and
 * resumed lazily on the first user gesture to satisfy autoplay policies.
 */
export function useSound() {
  const { soundOn } = usePrefs();
  const soundOnRef = useRef(soundOn);
  soundOnRef.current = soundOn;

  const play = useCallback((name: SoundName) => {
    if (!soundOnRef.current) return;
    playTone(name);
  }, []);

  const haptic = useCallback((pattern: number | number[] = 12) => {
    if (!soundOnRef.current) return;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* vibration unsupported or blocked — ignore */
      }
    }
  }, []);

  const tap = useCallback(() => {
    play('tap');
    haptic(10);
  }, [play, haptic]);

  const correct = useCallback(() => {
    play('correct');
    haptic(15);
  }, [play, haptic]);

  const wrong = useCallback(() => {
    play('wrong');
    haptic([0, 30, 40, 30]);
  }, [play, haptic]);

  const celebrate = useCallback(() => {
    play('celebrate');
    haptic([0, 40, 60, 40, 60, 90]);
  }, [play, haptic]);

  return { tap, correct, wrong, celebrate, play, haptic };
}
