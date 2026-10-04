import { useState, useEffect } from 'react';
import {
  getVoiceSpeed,
  cycleVoiceSpeed,
  speedLabel,
  READ_SPEED_STEPS,
} from '../utils/storage';
import { usePrefs } from '../context/PrefsContext';

/**
 * A touch-friendly button that cycles the reading (TTS) speed.
 * The chosen speed is persisted under the shared 'voice_speed' key, so it
 * applies to every language (廣東話 / 普通話 / English) and stays in sync with
 * the Settings page slider.
 */
export default function SpeedButton({ className = '' }: { className?: string }) {
  const { t } = usePrefs();
  const [speed, setSpeed] = useState<number>(() => getVoiceSpeed());

  useEffect(() => {
    const sync = () => setSpeed(getVoiceSpeed());
    window.addEventListener('voice-speed-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('voice-speed-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function handleClick() {
    setSpeed(cycleVoiceSpeed());
  }

  const stepIndex = Math.max(0, READ_SPEED_STEPS.findIndex(s => Math.abs(s - speed) < 0.001));

  return (
    <button
      type="button"
      className={`btn btn-outline speed-btn ${className}`}
      onClick={handleClick}
      title={t('speed.title')}
      aria-label={t('speed.aria', { label: speedLabel(speed) })}
    >
      <span className="ico">🔊</span> {t('speed.label', { label: speedLabel(speed) })}
      <span className="speed-dots" aria-hidden="true">
        {READ_SPEED_STEPS.map((s, i) => (
          <span key={s} className={`speed-dot${i <= stepIndex ? ' on' : ''}`} />
        ))}
      </span>
    </button>
  );
}
