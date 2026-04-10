import React, { useEffect, useRef } from 'react';
import { WeatherCondition } from '../types';

interface Props {
  condition: WeatherCondition;
}

export const WeatherAnimation: React.FC<Props> = ({ condition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resize);

    const initParticles = () => {
      particles = [];
      if (condition === 'Rain') {
        const count = 100;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 60 + 60,
            speed: Math.random() * 15 + 15,
            opacity: 0.6,
          });
        }
      } else if (condition === 'Snow') {
        const count = 80;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 7 + 3,
            speed: Math.random() * 1 + 0.5,
            drift: Math.random() * 2 - 1,
            offset: Math.random() * Math.PI * 2,
          });
        }
      } else if (condition === 'Storm') {
        const count = 150;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 60 + 60,
            speed: Math.random() * 25 + 20,
            opacity: 0.6,
          });
        }
      } else if (condition === 'Fog') {
        const count = 5;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            w: Math.random() * 400 + 800,
            h: Math.random() * 40 + 80,
            speed: Math.random() * 0.2 + 0.1,
            opacity: Math.random() * 0.03 + 0.04,
            offset: Math.random() * Math.PI * 2,
          });
        }
      } else if (condition === 'Clear') {
        const count = 8;
        for (let i = 0; i < count; i++) {
          particles.push({
            angle: (i / count) * Math.PI * 2,
            width: 0.1,
            speed: 0.001,
          });
        }
      } else if (condition === 'Cloudy') {
        const count = 4;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            w: Math.random() * 400 + 400,
            h: Math.random() * 200 + 200,
            speed: Math.random() * 0.1 + 0.05,
          });
        }
      }
    };

    let flashOpacity = 0;
    let lastFlash = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (condition === 'Rain' || condition === 'Storm') {
        ctx.strokeStyle = 'rgba(68, 153, 204, 0.6)';
        ctx.lineWidth = 2;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (condition === 'Storm' ? 10 : 5), p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x += (condition === 'Storm' ? 2 : 1);
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });

        if (condition === 'Storm') {
          const now = Date.now();
          if (now - lastFlash > 4000 + Math.random() * 5000) {
            flashOpacity = 0.15;
            lastFlash = now;
            setTimeout(() => { flashOpacity = 0.08; }, 80);
            setTimeout(() => { flashOpacity = 0; }, 280);
          }
          if (flashOpacity > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
            ctx.fillRect(0, 0, width, height);
          }
        }
      } else if (condition === 'Snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speed;
          p.x += Math.sin(Date.now() * 0.001 + p.offset) * p.drift;
          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        });
      } else if (condition === 'Fog') {
        particles.forEach((p) => {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.w);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, p.h / p.w);
          ctx.beginPath();
          ctx.arc(0, 0, p.w, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += Math.sin(Date.now() * 0.0005 + p.offset) * p.speed;
        });
      } else if (condition === 'Clear') {
        const centerX = width * 0.9;
        const centerY = height * 0.1;
        
        // Sun glow
        const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.6);
        sunGlow.addColorStop(0, 'rgba(255, 165, 0, 0.15)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, width, height);

        // Rays
        ctx.save();
        ctx.translate(centerX, centerY);
        particles.forEach((p) => {
          p.angle += p.speed;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(p.angle) * width, Math.sin(p.angle) * width);
          ctx.lineTo(Math.cos(p.angle + p.width) * width, Math.sin(p.angle + p.width) * width);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
          ctx.fill();
        });
        ctx.restore();
      } else if (condition === 'Cloudy') {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.2)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.w, p.h, 0, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.speed;
          if (p.x - p.w > width) p.x = -p.w;
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };


    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ filter: 'blur(1px)' }}
    />
  );
};
