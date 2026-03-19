import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  rot: number;
  rotV: number;
  rx: number;
  ry: number;
  col: string;
}

export default function SeedTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  const colors = ['#c89518', '#e07830', '#a07818', '#b86820', '#d4a030'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeFrame: number;
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const lx = lastMouseRef.current.x || cx;
      const ly = lastMouseRef.current.y || cy;

      const moveDX = cx - lx;
      const moveDY = cy - ly;
      const speed = Math.sqrt(moveDX * moveDX + moveDY * moveDY);

      // Spawn particles only if mouse is moving fast enough
      if (speed > 3) {
        // Spawn 1-2 seeds per tick based on velocity
        const maxSpawn = Math.min(Math.floor(speed / 10) + 1, 3);

        for (let i = 0; i < maxSpawn; i++) {
          particlesRef.current.push({
            x: cx,
            y: cy,
            vx: moveDX * 0.4 + random(-0.6, 0.6),
            vy: moveDY * 0.4 + random(-0.6, 0.6) - 0.5, // slight upward bias
            life: 1.0,
            decay: 0.022 + random(0, 0.02),
            rot: random(0, Math.PI * 2),
            rotV: random(-0.12, 0.12), // rotation speed
            rx: 3 + random(0, 3), // ellipse x radius (seed length)
            ry: 1.2 + random(0, 1.5), // ellipse y radius (seed width)
            col: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      lastMouseRef.current = { x: cx, y: cy };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const render = () => {
      // Clear the canvas explicitly
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pArr = particlesRef.current;
      for (let i = pArr.length - 1; i >= 0; i--) {
        const p = pArr[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.97; // air friction
        p.vy *= 0.97;
        p.rot += p.rotV;
        p.life -= p.decay;

        if (p.life <= 0) {
          pArr.splice(i, 1);
          continue;
        }

        // Draw rotated ellipse (coriander seed shape)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9990]"
    />
  );
}
