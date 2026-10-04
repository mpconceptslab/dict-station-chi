/**
 * Tier + rolling-window usage limits.
 *
 * The free tier gives a small weekly allowance; the Pro tier gives a much larger
 * monthly allowance and unlocks AI dictation checking. Counters are stored as
 * timestamp logs in localStorage, scoped to the current profile, and pruned to a
 * rolling window each read. This is a client-side MVP (see the plan's hardening
 * note about moving enforcement server-side later).
 */

export type Tier = 'free' | 'pro';

import { translate } from '../i18n';

/* ── Allowance configuration ─────────────────────────────────────────────── */
const FREE_SCAN_LIMIT = 3;    // syllabus scans per rolling 7 days
const FREE_CHECK_LIMIT = 1;   // AI dictation checks per rolling 7 days
const PRO_SCAN_LIMIT = 50;    // syllabus scans per rolling 30 days
const PRO_CHECK_LIMIT = 200;  // AI dictation checks per rolling 30 days (safety cap)

const WEEK = 7 * 24 * 60 * 60 * 1000;
const MONTH = 30 * 24 * 60 * 60 * 1000;

/* ── Profile scoping (mirrors storage.ts getUserId) ──────────────────────── */
function getUserId(): string {
  const s = localStorage.getItem('current_session');
  if (s) {
    try {
      const u = JSON.parse(s);
      if (u && u.username) return `user_${u.username}`;
    } catch {
      /* ignore */
    }
  }
  return 'default';
}
function scopedKey(k: string): string {
  return `${getUserId()}_${k}`;
}

/* ── Tier ────────────────────────────────────────────────────────────────── */
export function getTier(): Tier {
  const s = localStorage.getItem('current_session');
  if (s) {
    try {
      const u = JSON.parse(s);
      if (u && u.tier === 'pro') return 'pro';
    } catch {
      /* ignore */
    }
  }
  return 'free';
}

export function setTier(tier: Tier): void {
  const s = localStorage.getItem('current_session');
  if (!s) return;
  try {
    const u = JSON.parse(s);
    u.tier = tier;
    localStorage.setItem('current_session', JSON.stringify(u));
    window.dispatchEvent(new Event('tier-changed'));
  } catch {
    /* ignore */
  }
}

export function isPro(): boolean {
  return getTier() === 'pro';
}

/* ── Rolling-window logs ─────────────────────────────────────────────────── */
function readLog(k: string): number[] {
  const raw = localStorage.getItem(scopedKey(k));
  if (!raw) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}
function writeLog(k: string, log: number[]): void {
  localStorage.setItem(scopedKey(k), JSON.stringify(log));
}
function prune(log: number[], windowMs: number): number[] {
  const cutoff = Date.now() - windowMs;
  return log.filter((t) => t >= cutoff);
}

export interface Allowance {
  used: number;
  limit: number;
  remaining: number;
  tier: Tier;
  /** ms until the oldest entry in the window expires (0 if none). */
  resetsInMs: number;
}

function buildAllowance(logKey: string, freeLimit: number, proLimit: number): Allowance {
  const tier = getTier();
  const windowMs = tier === 'pro' ? MONTH : WEEK;
  const limit = tier === 'pro' ? proLimit : freeLimit;
  const log = prune(readLog(logKey), windowMs);
  const used = log.length;
  const oldest = log.length ? Math.min(...log) : 0;
  const resetsInMs = oldest ? Math.max(0, oldest + windowMs - Date.now()) : 0;
  return { used, limit, remaining: Math.max(0, limit - used), tier, resetsInMs };
}

function recordEvent(logKey: string): void {
  const tier = getTier();
  const windowMs = tier === 'pro' ? MONTH : WEEK;
  const log = prune(readLog(logKey), windowMs);
  log.push(Date.now());
  writeLog(logKey, log);
  window.dispatchEvent(new Event('usage-changed'));
}

/* ── Bonus allowance (from promo codes) ─────────────────────────────────── */
function getBonus(logKey: string): number {
  const raw = localStorage.getItem(scopedKey(`${logKey}_bonus`));
  return raw ? parseInt(raw, 10) : 0;
}
function addBonus(logKey: string, amount: number): void {
  const current = getBonus(logKey);
  localStorage.setItem(scopedKey(`${logKey}_bonus`), (current + amount).toString());
  window.dispatchEvent(new Event('usage-changed'));
}

/* ── Syllabus scanning allowance ─────────────────────────────────────────── */
export function getScanAllowance(): Allowance {
  const base = buildAllowance('scan_log', FREE_SCAN_LIMIT, PRO_SCAN_LIMIT);
  const bonus = getBonus('scan_log');
  return { ...base, limit: base.limit + bonus, remaining: Math.max(0, base.limit + bonus - base.used) };
}
export function canScan(): boolean {
  return getScanAllowance().remaining > 0;
}
export function recordScan(): void {
  recordEvent('scan_log');
}
export function addBonusScans(amount: number): void {
  addBonus('scan_log', amount);
}

/* ── AI dictation checking allowance ─────────────────────────────────────── */
export function getCheckAllowance(): Allowance {
  const base = buildAllowance('check_log', FREE_CHECK_LIMIT, PRO_CHECK_LIMIT);
  const bonus = getBonus('check_log');
  return { ...base, limit: base.limit + bonus, remaining: Math.max(0, base.limit + bonus - base.used) };
}
export function canCheck(): boolean {
  return getCheckAllowance().remaining > 0;
}
export function recordCheck(): void {
  recordEvent('check_log');
}
export function addBonusChecks(amount: number): void {
  addBonus('check_log', amount);
}

/* ── Presentation helpers ────────────────────────────────────────────────── */
export function formatReset(ms: number): string {
  if (ms <= 0) return '';
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return translate('limits.days', { n: days });
  if (hours > 0) return translate('limits.hours', { n: hours });
  return translate('limits.underHour');
}
