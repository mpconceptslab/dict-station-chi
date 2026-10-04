import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import './styles/app-shell.css';

// Register the service worker (installable + offline PWA). autoUpdate strategy:
// new versions are activated automatically on the next load.
registerSW({ immediate: true });

// Dev-only convenience: opening the app with ?demo=1 seeds a throwaway profile
// so the home front page can be previewed without walking through first-run
// setup. Stripped from production builds by the import.meta.env.DEV guard.
if (
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('demo') === '1' &&
  !localStorage.getItem('current_session')
) {
  localStorage.setItem(
    'current_session',
    JSON.stringify({
      username: 'demo',
      kidName: 'Demo Kid',
      kidSchool: 'Demo School',
      kidGrade: '小一',
      createdAt: Date.now(),
      tier: 'free',
    })
  );
  localStorage.setItem('child_name', 'Demo Kid');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
