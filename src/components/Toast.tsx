import { useEffect, useState } from 'react';

export type ToastKind = 'info' | 'success' | 'error';

interface ToastEventDetail {
  message: string;
  kind?: ToastKind;
  duration?: number;
}

/**
 * Fire an in-app toast from anywhere (replaces window.alert).
 * Usage: showToast('請選擇考試日期', 'error');
 */
export function showToast(message: string, kind: ToastKind = 'info', duration = 2600) {
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>('app-toast', { detail: { message, kind, duration } })
  );
}

/**
 * Single toast surface mounted once in App.tsx. Listens for `app-toast`
 * events and renders a transient pill above the bottom dock.
 */
export default function Toast() {
  const [state, setState] = useState<{ message: string; kind: ToastKind } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: number | undefined;
    let clearTimer: number | undefined;

    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastEventDetail>).detail;
      if (!detail?.message) return;
      if (hideTimer) window.clearTimeout(hideTimer);
      if (clearTimer) window.clearTimeout(clearTimer);
      setState({ message: detail.message, kind: detail.kind || 'info' });
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), detail.duration || 2600);
      clearTimer = window.setTimeout(() => setState(null), (detail.duration || 2600) + 250);
    }

    window.addEventListener('app-toast', onToast);
    return () => {
      window.removeEventListener('app-toast', onToast);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (clearTimer) window.clearTimeout(clearTimer);
    };
  }, []);

  if (!state) return null;
  return (
    <div className={`app-toast ${state.kind}${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {state.message}
    </div>
  );
}
