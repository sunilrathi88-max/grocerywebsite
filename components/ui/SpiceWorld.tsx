import React, { useRef, useEffect } from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { gsap } from 'gsap';

export default function SpiceWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let width = canvas.width = 600;
    let height = canvas.height = 600;

    // 3 layers of parallax particles (representing spices around the orb)
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 3, // Layer 0 to 3
      size: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 250 + 50,
      orbitSpeed: (Math.random() - 0.5) * 0.005,
      col: ['#c89518', '#e07830', '#a07818', '#7a2010', '#f2e8d0'][Math.floor(Math.random() * 5)]
    }));

    // GSAP entrance entrance for canvas
    gsap.from(canvas, { scale: 0.8, opacity: 0, duration: 2, ease: "power3.out", delay: 2.2 });

    const cx = width / 2;
    const cy = height / 2;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Central Orb (Golden Hour Lighting)
      const gradient = ctx.createRadialGradient(cx - 50, cy - 50, 20, cx, cy, 250);
      gradient.addColorStop(0, '#e07830'); // saffron core
      gradient.addColorStop(0.4, '#c45e1a'); // ember mid
      gradient.addColorStop(0.8, '#1e1408'); // char rim
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Atmospheric glow
      const glow = ctx.createRadialGradient(cx, cy, 180, cx, cy, 300);
      glow.addColorStop(0, 'rgba(224, 120, 48, 0.2)');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 300, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Particles orbiting
      particles.forEach(p => {
        p.angle += p.orbitSpeed;
        
        // Parallax scaling
        const scale = 1 + (p.z * 0.3);
        const x = cx + Math.cos(p.angle) * p.orbitRadius * scale;
        // Tilt the orbit slightly for 3D effect
        const y = cy + Math.sin(p.angle) * p.orbitRadius * scale * 0.4;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = 0.4 + (p.z * 0.2); // Further particles are dimmer
        
        ctx.beginPath();
        ctx.arc(0, 0, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
        
        // Add tiny trail to fast particles
        if (Math.abs(p.orbitSpeed) > 0.003) {
           ctx.beginPath();
           ctx.moveTo(0, 0);
           ctx.lineTo(-Math.cos(p.angle) * 10 * scale, -Math.sin(p.angle) * 4 * scale);
           ctx.strokeStyle = p.col;
           ctx.lineWidth = 1;
           ctx.globalAlpha = 0.2;
           ctx.stroke();
        }
        
        ctx.restore();
      });

      animationFrame = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center pointer-events-none">
      <canvas 
        ref={canvasRef} 
        width="600" 
        height="600"
        className="max-w-full h-auto drop-shadow-2xl"
      />
    </div>
  );
}
