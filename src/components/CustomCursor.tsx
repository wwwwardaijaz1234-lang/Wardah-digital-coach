import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device or reduced motion
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    // Dust particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable or 3D element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [data-cursor-label], [data-cursor-hover]');
        if (interactive) {
          setIsHovered(true);
          const label = interactive.getAttribute('data-cursor-label');
          setCursorText(label || null);
        } else {
          setIsHovered(false);
          setCursorText(null);
        }
      }

      // Emit particle on move
      if (Math.random() > 0.4 && particles.length < 35) {
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.3,
          size: Math.random() * 2.5 + 1,
          alpha: 0.8,
          color: Math.random() > 0.5 ? '#AA78EF' : '#C3D7AE',
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      animId = requestAnimationFrame(render);

      // Ring spring damping
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      // Draw particle trail
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.025;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        aria-hidden="true"
      />

      {/* Center Glowing Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-[#AA78EF] shadow-[0_0_12px_#AA78EF] pointer-events-none z-[9999] transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      />

      {/* Outer Spring Ring with dynamic label */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] transition-all duration-200 flex items-center justify-center ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovered
            ? '-ml-8 -mt-8 w-16 h-16 border border-[#C3D7AE] bg-[#AA78EF]/15 backdrop-blur-[2px] rounded-full shadow-[0_0_20px_rgba(195,215,174,0.35)]'
            : '-ml-5 -mt-5 w-10 h-10 border border-[#AA78EF]/50 rounded-full'
        }`}
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        {cursorText && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-white select-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
