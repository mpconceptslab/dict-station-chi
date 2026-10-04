import { useNavigate, useLocation } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import { usePrefs } from '../context/PrefsContext';
import type { TKey } from '../i18n';
import homeIcon from '../assets/nav-icons/home.png';
import scanIcon from '../assets/nav-icons/scan.png';
import studyIcon from '../assets/nav-icons/study.png';
import recordsIcon from '../assets/nav-icons/records.png';

interface Tab {
  to: string;
  labelKey: TKey;
  icon: string;
  /** Path prefixes that should highlight this tab. */
  match: string[];
}

const TABS: Tab[] = [
  { to: '/home', labelKey: 'nav.tab.home', icon: homeIcon, match: ['/home'] },
  { to: '/import', labelKey: 'nav.tab.scan', icon: scanIcon, match: ['/import'] },
  { to: '/syllabus', labelKey: 'nav.tab.revise', icon: studyIcon, match: ['/syllabus', '/study', '/revision', '/word-lists'] },
  { to: '/records', labelKey: 'nav.tab.records', icon: recordsIcon, match: ['/records', '/marking', '/correction'] },
  { to: '/settings', labelKey: 'nav.tab.me', icon: '\u{1F464}', match: ['/settings', '/upgrade', '/profile'] },
];

/**
 * BottomNavBar — the primary fixed bottom tab bar. Navigation lives here; the
 * TopNavBar is trimmed to contextual actions (back/next, settings, points).
 */
export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tap } = useSound();
  const { t } = usePrefs();

  function isActive(tab: Tab): boolean {
    return tab.match.some((m) => location.pathname === m || location.pathname.startsWith(m + '/'));
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label={t('nav.mainAria')}>
      {TABS.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.to}
            className={`bottom-nav-tab ${active ? 'active' : ''}`}
            onClick={() => { tap(); if (!active) navigate(tab.to); }}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {tab.icon.startsWith('data:') || tab.icon.includes('/nav-icons/') ? (
                <img src={tab.icon} alt="" className="nav-icon-img" />
              ) : (
                <span className="ico">{tab.icon}</span>
              )}
            </span>
            <span className="bottom-nav-label">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
