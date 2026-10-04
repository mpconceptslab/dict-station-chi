import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { translate, getStoredLang, storeLang } from '../i18n';
import type { Lang, TKey, TVars } from '../i18n';

export type Theme = 'light' | 'dark';
export type FontScale = 'small' | 'medium' | 'large';

interface PrefsContextType {
  theme: Theme;
  fontScale: FontScale;
  soundOn: boolean;
  lang: Lang;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFontScale: (fontScale: FontScale) => void;
  setSoundOn: (on: boolean) => void;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** Translate a key in the active language, interpolating {vars}. */
  t: (key: TKey, vars?: TVars) => string;
}

const THEME_KEY = 'theme';
const FONT_KEY = 'font_scale';
const SOUND_KEY = 'sound_on';

function readTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function readFontScale(): FontScale {
  const v = localStorage.getItem(FONT_KEY);
  return v === 'small' || v === 'large' ? v : 'medium';
}

function readSound(): boolean {
  // Default ON unless explicitly turned off.
  return localStorage.getItem(SOUND_KEY) !== 'false';
}

/** Reflect the theme onto <html> + the PWA theme-color meta (no flash). */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B1E3A' : '#6C63FF');
  window.dispatchEvent(new Event('theme-changed'));
}

/** Reflect the font scale onto <html data-font> so the root font-size rules apply. */
function applyFontScale(fontScale: FontScale) {
  document.documentElement.setAttribute('data-font', fontScale);
}

/** Reflect the language onto <html lang>/<html data-lang> + the document title. */
function applyLang(lang: Lang) {
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-HK' : 'en');
  document.documentElement.setAttribute('data-lang', lang);
  document.title = translate('app.title', undefined, lang);
}

const PrefsContext = createContext<PrefsContextType | undefined>(undefined);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [fontScale, setFontScaleState] = useState<FontScale>(readFontScale);
  const [soundOn, setSoundOnState] = useState<boolean>(readSound);
  const [lang, setLangState] = useState<Lang>(getStoredLang);

  // The inline boot script already applied these before first paint; re-apply on
  // mount so React state and the DOM attributes are guaranteed to agree.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font', fontScale);
    // Remember the auto-detected language on first run so it persists afterwards.
    storeLang(lang);
    applyLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  function setFontScale(next: FontScale) {
    setFontScaleState(next);
    localStorage.setItem(FONT_KEY, next);
    applyFontScale(next);
  }

  function setSoundOn(on: boolean) {
    setSoundOnState(on);
    localStorage.setItem(SOUND_KEY, String(on));
  }

  function setLang(next: Lang) {
    setLangState(next);
    storeLang(next);
    applyLang(next);
  }

  function toggleLang() {
    setLang(lang === 'zh' ? 'en' : 'zh');
  }

  const t = useCallback(
    (key: TKey, vars?: TVars) => translate(key, vars, lang),
    [lang],
  );

  return (
    <PrefsContext.Provider
      value={{
        theme,
        fontScale,
        soundOn,
        lang,
        setTheme,
        toggleTheme,
        setFontScale,
        setSoundOn,
        setLang,
        toggleLang,
        t,
      }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs(): PrefsContextType {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within a PrefsProvider');
  return ctx;
}
