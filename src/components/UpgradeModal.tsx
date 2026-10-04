import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTier, isPro } from '../utils/limits';
import { usePrefs } from '../context/PrefsContext';

const PRO_PROMO_CODES = ['DICTPRO', 'PRO2025', 'FAMILY'];

interface UpgradeModalProps {
  onClose: () => void;
  /** Optional context line explaining why the prompt appeared. */
  reason?: string;
}

/**
 * UpgradeModal — the Pro upsell surface shown when a free allowance is exhausted.
 * Offers a plan comparison, a (placeholder) checkout, and a promo-code unlock.
 */
export default function UpgradeModal({ onClose, reason }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const [showPromo, setShowPromo] = useState(false);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<ReactNode>('');
  const [msgType, setMsgType] = useState<'success' | 'error' | ''>('');
  const pro = isPro();

  function redeem() {
    const ok = PRO_PROMO_CODES.includes(code.trim().toUpperCase());
    if (ok) {
      setTier('pro');
      setMsg(<>{t('upgrade.unlocked')} <span className="ico">🎉</span></>);
      setMsgType('success');
      setTimeout(() => onClose(), 1500);
    } else {
      setMsg(t('upgrade.invalidCode'));
      setMsgType('error');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><span className="ico" data-word={t('common.close')}>✕</span></button>

        {pro ? (
          <>
            <h2 className="modal-title">{t('upgradeModal.proTitle')} <span className="ico">👑</span></h2>
            <p className="modal-subtitle">{t('upgradeModal.proSubtitle')}</p>
            <button className="btn btn-primary btn-large" onClick={onClose}>{t('upgradeModal.ok')}</button>
          </>
        ) : showPromo ? (
          <>
            <h2 className="modal-title">{t('upgrade.enterPromo')}</h2>
            <p className="modal-subtitle">{t('upgradeModal.promoSubtitle')}</p>
            <div className="promo-input-group">
              <input
                type="text"
                className="promo-input"
                placeholder={t('upgrade.promoPlaceholder')}
                value={code}
                onChange={(e) => { setCode(e.target.value); setMsg(''); setMsgType(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') redeem(); }}
                autoFocus
              />
              <button className="promo-submit-btn" onClick={redeem}>{t('upgrade.confirmCode')}</button>
            </div>
            {msg && <div className={`promo-message ${msgType}`}>{msg}</div>}
            <button className="back-link" onClick={() => { setShowPromo(false); setMsg(''); setMsgType(''); setCode(''); }}>
              <span className="ico">←</span> {t('common.back')}
            </button>
          </>
        ) : (
          <>
            <h2 className="modal-title">{t('upgrade.title')} <span className="ico">👑</span></h2>
            <p className="modal-subtitle">{reason || t('upgradeModal.defaultReason')}</p>

            <div className="plan-compare">
              <div className="plan-col plan-free">
                <h3>{t('upgrade.planFree')}</h3>
                <ul>
                  <li>{t('upgrade.freeF1')}</li>
                  <li>{t('upgrade.freeF2')}</li>
                  <li>{t('upgrade.freeF4')}</li>
                </ul>
              </div>
              <div className="plan-col plan-pro">
                <h3>{t('upgrade.planPro')}</h3>
                <ul>
                  <li>{t('upgrade.proF1')}</li>
                  <li>{t('upgrade.proF2')}</li>
                  <li>{t('upgrade.proF3')}</li>
                  <li>{t('upgrade.proF4')}</li>
                  <li>{t('upgrade.proF5')}</li>
                </ul>
              </div>
            </div>

            <div className="upgrade-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => { navigate('/upgrade'); onClose(); }}
              >
                <span className="ico">💳</span> {t('upgrade.title')}
              </button>
              <button className="btn btn-outline" onClick={() => setShowPromo(true)}>
                <span className="ico">🎟️</span> {t('upgrade.enterPromo')}
              </button>
              <button className="btn btn-plain" onClick={onClose}>{t('upgradeModal.later')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
