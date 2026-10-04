import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getScanAllowance,
  getCheckAllowance,
  formatReset,
  type Allowance,
} from '../utils/limits';
import { redeemPromoCode } from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

const PRO_PROMO_CODES = ['DICTPRO', 'PRO2025', 'FAMILY'];

export default function UpgradePage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const { currentUser, setTier } = useAuth();
  const [scan, setScan] = useState<Allowance>(() => getScanAllowance());
  const [check, setCheck] = useState<Allowance>(() => getCheckAllowance());
  const [showPromo, setShowPromo] = useState(false);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<ReactNode>('');
  const [msgType, setMsgType] = useState<'success' | 'error' | ''>('');
  const [checkoutNote, setCheckoutNote] = useState('');

  const pro = currentUser?.tier === 'pro';

  function refresh() {
    setScan(getScanAllowance());
    setCheck(getCheckAllowance());
  }

  useEffect(() => {
    refresh();
    window.addEventListener('tier-changed', refresh);
    window.addEventListener('usage-changed', refresh);
    return () => {
      window.removeEventListener('tier-changed', refresh);
      window.removeEventListener('usage-changed', refresh);
    };
  }, []);

  function handleCheckout() {
    // Placeholder — real Stripe integration is deferred (see plan §G).
    setCheckoutNote(t('upgrade.checkoutNote'));
    setShowPromo(true);
  }

  function redeem() {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    // Check if it's a PRO code first
    if (PRO_PROMO_CODES.includes(trimmedCode.toUpperCase())) {
      setTier('pro');
      setMsg(<>{t('upgrade.unlocked')} <span className="ico">🎉</span></>);
      setMsgType('success');
      setCode('');
    } else {
      // Try credit promo codes (free10, free20, etc.)
      const result = redeemPromoCode(trimmedCode);
      if (result.success) {
        setMsg(result.message);
        setMsgType('success');
        setCode('');
        refresh(); // Update the scan/check counts
      } else {
        setMsg(t('upgrade.invalidCode'));
        setMsgType('error');
      }
    }
  }

  return (
    <div className="page upgrade-page">
      <TopNavBar onBack={() => navigate(-1)} />
      <h1>{t('upgrade.title')} <span className="ico">👑</span></h1>
      <p className="list-name">
        {t('upgrade.currentPlan')}<strong>{pro ? t('upgrade.planPro') : t('upgrade.planFree')}</strong>
      </p>

      {!pro && (
        <div className="usage-now">
          <div className="usage-row">
            <span>{t('upgrade.scanCount')}</span>
            <span>{t('upgrade.remaining', { remaining: scan.remaining, limit: scan.limit })}{scan.resetsInMs ? t('upgrade.resetSuffix', { reset: formatReset(scan.resetsInMs) }) : ''}</span>
          </div>
          <div className="usage-row">
            <span>{t('upgrade.aiCheck')}</span>
            <span>{t('upgrade.remaining', { remaining: check.remaining, limit: check.limit })}{check.resetsInMs ? t('upgrade.resetSuffix', { reset: formatReset(check.resetsInMs) }) : ''}</span>
          </div>
        </div>
      )}

      <div className="plan-compare plan-compare-page">
        <div className="plan-col plan-free">
          <h3>{t('upgrade.planFree')}</h3>
          <p className="plan-price">$0</p>
          <ul>
            <li>{t('upgrade.freeF1')}</li>
            <li>{t('upgrade.freeF2')}</li>
            <li>{t('upgrade.freeF3')}</li>
            <li>{t('upgrade.freeF4')}</li>
          </ul>
        </div>
        <div className={`plan-col plan-pro ${pro ? 'current' : ''}`}>
          <h3>{t('upgrade.planPro')}</h3>
          <p className="plan-price">$28<span>{t('upgrade.perMonth')}</span></p>
          <ul>
            <li>{t('upgrade.proF1')}</li>
            <li>{t('upgrade.proF2')}</li>
            <li>{t('upgrade.proF3')}</li>
            <li>{t('upgrade.proF4')}</li>
            <li>{t('upgrade.proF5')}</li>
          </ul>
        </div>
      </div>

      {pro ? (
        <div className="upgrade-actions">
          <p className="pro-thanks">{t('upgrade.proThanks')}<span className="ico">🎉</span></p>
          <button className="btn btn-outline" onClick={() => setTier('free')}>
            {t('upgrade.cancelPro')}
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>{t('pre.backHome')}</button>
        </div>
      ) : (
        <div className="upgrade-actions">
          <button className="btn btn-primary btn-large" onClick={handleCheckout}>
            <span className="ico">💳</span> {t('upgrade.upgradeNow')}
          </button>
          <button className="btn btn-outline" onClick={() => { setShowPromo(v => !v); setMsg(''); setMsgType(''); }}>
            <span className="ico">🎟️</span> {t('upgrade.enterPromo')}
          </button>
        </div>
      )}

      {checkoutNote && <p className="checkout-note">{checkoutNote}</p>}

      {showPromo && !pro && (
        <div className="promo-input-group promo-page">
          <input
            type="text"
            className="promo-input"
            placeholder={t('upgrade.promoPlaceholder')}
            value={code}
            onChange={(e) => { setCode(e.target.value); setMsg(''); setMsgType(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') redeem(); }}
          />
          <button className="promo-submit-btn" onClick={redeem}>{t('upgrade.confirmCode')}</button>
          {msg && <div className={`promo-message ${msgType}`}>{msg}</div>}
        </div>
      )}
    </div>
  );
}
