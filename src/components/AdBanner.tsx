import { useState, useEffect } from 'react';
import { isPro } from '../utils/limits';
import { usePrefs } from '../context/PrefsContext';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-3716389310971009';
// A real responsive ad-unit slot must be provided; the old `data-ad-slot="auto"`
// value was invalid and never served. When unset we render no ad unit at all.
const AD_SLOT = import.meta.env.VITE_ADSENSE_SLOT || '';

/**
 * AdBanner — a fixed, safe-area-aware bar pinned to the bottom of the app shell
 * (above the bottom nav). Hidden entirely for Pro users and when no valid ad
 * slot is configured.
 */
export default function AdBanner() {
  const { t } = usePrefs();
  const [closed, setClosed] = useState(false);
  const [pro, setPro] = useState(() => isPro());

  useEffect(() => {
    const onTier = () => setPro(isPro());
    window.addEventListener('tier-changed', onTier);
    return () => window.removeEventListener('tier-changed', onTier);
  }, []);

  useEffect(() => {
    if (pro || closed || !AD_SLOT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [pro, closed]);

  // No ad for Pro users, when dismissed, or without a valid slot.
  if (pro || closed || !AD_SLOT) return null;

  return (
    <div className="ad-banner ad-banner-bottom">
      <button className="ad-close-btn" onClick={() => setClosed(true)} title={t('ad.closeTitle')}><span className="ico" data-word={t('common.close')}>✕</span></button>
      <div className="ad-content">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '50px' }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
