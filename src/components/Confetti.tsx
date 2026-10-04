import { useEffect, useRef } from 'react';

interface ConfettiEventDetail {
  count?: number;
}

/**
 * Fire a celebratory confetti burst from anywhere (same event pattern as Toast).
 * Usage: fireConfetti();
 */
export function fireConfetti(count = 150) {
  window.dispatchEvent(
    new CustomEvent<ConfettiEventDetail>('app-confetti', { detail: { count } })
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  round: boolean;
}

const COLORS = ['#FF5A5F', '#FF9F1C', '#FFD93D', '#2EC4B6', '#3A86FF', '#8338EC', '#FF6B9D'];

/**
 * Single confetti surface mounted once in App.tsx. Listens for `app-confetti`
 * events and animates a short (~1.6s) burst on a fixed, click-through canvas.
 * Hidden in dark mode via CSS ([data-theme="dark"] .confetti-canvas).
 */
export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function step() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.vy += 0.28; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y - p.size > canvas.height) {
          ps.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }
      if (ps.length > 0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function onFire(e: Event) {
      const detail = (e as CustomEvent<ConfettiEventDetail>).detail;
      const count = detail?.count ?? 150;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 11;
        particlesRef.current.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.4,
          y: h * 0.34 + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          size: 6 + Math.random() * 8,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.35,
          round: Math.random() < 0.5,
        });
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(step);
    }

    window.addEventListener('app-confetti', onFire);
    return () => {
      window.removeEventListener('app-confetti', onFire);
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
