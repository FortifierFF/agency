"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ParticleNetworkProps {
  particleCount?: number;
  connectionDistance?: number;
  particleSpeed?: number;
}

export function ParticleNetwork({ 
  particleCount = 20, 
  connectionDistance = 100,
  particleSpeed = 0.5 
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get computed primary color from CSS
    const getPrimaryColor = () => {
      const root = document.documentElement;
      const primaryHsl = getComputedStyle(root).getPropertyValue('--primary').trim();
      return `hsl(${primaryHsl})`;
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: 2,
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = getPrimaryColor();
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            const primaryColor = getPrimaryColor();
            // Extract HSL values - format is "221 83% 53%" (space-separated)
            const hslMatch = primaryColor.match(/hsl\((\d+(?:\.\d+)?)\s+([\d.]+)%\s+([\d.]+)%\)/);
            if (hslMatch) {
              const [, h, s, l] = hslMatch;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              // Increase opacity for better visibility
              ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${opacity * 0.7})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            } else {
              // Fallback if regex doesn't match - use the color directly with opacity
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = primaryColor.replace('hsl', 'hsla').replace(')', `, ${opacity * 0.7})`);
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, connectionDistance, particleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
