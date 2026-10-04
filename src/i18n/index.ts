import { zh } from './zh';
import { en } from './en';
import type { TKey } from './en';

export type Lang = 'zh' | 'en';
export type { TKey };
export type TVars = Record<string, string | number>;

const LANG_KEY = 'lang';
const dictionaries: Record<Lang, Record<TKey, string>> = { zh, en };

/** Chinese-only app: always return 'zh'. */
export function detectLang(): Lang {
  return 'zh';
}

/** Chinese-only app: always return 'zh'. */
export function getStoredLang(): Lang {
  return 'zh';
}

/** Persist the chosen language so it is remembered across launches. */
export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

/**
 * Translate a key for a language, interpolating `{placeholder}` tokens.
 * Standalone (no React) so non-component modules (limits, services) can localize.
 */
export function translate(
  key: TKey,
  vars?: TVars,
  lang: Lang = getStoredLang(),
): string {
  const table = dictionaries[lang] || dictionaries.zh;
  const template = table[key] ?? dictionaries.zh[key] ?? String(key);
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
}
