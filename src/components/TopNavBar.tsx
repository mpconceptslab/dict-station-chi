import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTier } from '../utils/limits';
import { usePrefs } from '../context/PrefsContext';
import { useSound } from '../hooks/useSound';

/**
 * TopNavBar — a consistent top navigation bar rendered on every page.
 * Left: Previous, Next
 * Right: Tier badge
 * (Chinese-only app: no language toggle)
 */
export default function TopNavBar({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, t } = usePrefs();
  const { tap } = useSound();

  const [tier, setTierState] = useState(() => getTier());

  // Track the history stack index so we know when Prev/Next are available.
  const [navState, setNavState] = useState(() => {
    const idx = (window.history.state && window.history.state.idx) || 0;
    const storedMax = Number(sessionStorage.getItem('rr_max_idx') || 0);
    return { idx, maxIdx: Math.max(idx, storedMax) };
  });

  // Recompute Prev/Next availability on every navigation.
  useEffect(() => {
    const idx = (window.history.state && window.history.state.idx) || 0;
    setNavState(prev => {
      const maxIdx = Math.max(prev.maxIdx, idx);
      sessionStorage.setItem('rr_max_idx', String(maxIdx));
      return { idx, maxIdx };
    });
  }, [location]);

  // Refresh the tier badge when navigating
  useEffect(() => {
    setTierState(getTier());
  }, [location]);

  // Listen for tier changes (e.g. after unlocking Pro)
  useEffect(() => {
    const handleTierChange = () => setTierState(getTier());
    window.addEventListener('tier-changed', handleTierChange);
    return () => window.removeEventListener('tier-changed', handleTierChange);
  }, []);

  const canGoBack = navState.idx > 0;
  const canGoForward = navState.idx < navState.maxIdx;

  return (
    <div className="top-nav-bar">
      {/* Previous button */}
      <button
        className="btn btn-back"
        onClick={() => { tap(); if (onBack) onBack(); else navigate(-1); }}
        disabled={!onBack && !canGoBack}
        title={t('nav.prev')}
      >
        <span className="ico" data-word={t('nav.prevShort')}>←</span>
      </button>

      {/* Next button */}
      <button
        className="btn btn-next"
        onClick={() => { tap(); navigate(1); }}
        disabled={!canGoForward}
        title={t('nav.next')}
      >
        <span className="ico" data-word={t('nav.nextShort')}>→</span>
      </button>

      {/* Spacer to push right-side items */}
      <div className="nav-spacer"></div>

      {/* Theme toggle — light shows 🌙, dark shows the word 明亮 (words-only). */}
      <button
        className="btn btn-theme"
        onClick={() => { tap(); toggleTheme(); }}
        title={t('nav.theme')}
        aria-label={t('nav.theme')}
      >
        <span className="ico" data-word={t('nav.themeWord')}>🌙</span>
      </button>

      {/* Tier badge — tap to view / upgrade the plan */}
      <button
        className={`nav-tier-box ${tier === 'pro' ? 'pro' : ''}`}
        onClick={() => { tap(); navigate('/upgrade'); }}
        title={tier === 'pro' ? t('nav.proMember') : t('nav.upgradePro')}
      >
        <span className="nav-tier-icon ico">{tier === 'pro' ? '👑' : '⭐'}</span>
        <span className="nav-tier-label">{tier === 'pro' ? 'Pro' : t('nav.upgrade')}</span>
      </button>
    </div>
  );
}
