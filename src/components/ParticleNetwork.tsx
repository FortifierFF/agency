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
  const displaySizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: false,
      willReadFrequently: false
    });
    if (!ctx) return;
    
    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Get computed primary color from CSS
    const getPrimaryColor = () => {
      const root = document.documentElement;
      const primaryHsl = getComputedStyle(root).getPropertyValue('--primary').trim();
      return `hsl(${primaryHsl})`;
    };

    // Set canvas size with device pixel ratio for sharp rendering
    // Use minimum DPR of 2 to match mobile sharpness (mobile typically has DPR 2-3)
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      
      // Store display size for consistent boundary checking
      displaySizeRef.current = {
        width: rect.width,
        height: rect.height,
      };
      
      // Set actual size in memory (scaled for device pixel ratio)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set display size (CSS pixels)
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Reset transform and scale context to match device pixel ratio
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      // Re-enable high-quality rendering after scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };
    
    // Initialize particles with random positions and velocities
    const initParticles = () => {
      const { width, height } = displaySizeRef.current;
      if (width === 0 || height === 0) {
        const rect = canvas.getBoundingClientRect();
        displaySizeRef.current = { width: rect.width, height: rect.height };
      }
      
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * displaySizeRef.current.width,
          y: Math.random() * displaySizeRef.current.height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: 2,
        });
      }
    };
    
    resizeCanvas();
    initParticles();
    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    // Animation loop - optimized for smooth 60fps performance
    const animate = () => {
      const particles = particlesRef.current;
      const { width, height } = displaySizeRef.current;
      
      // Clear canvas (context is already scaled by DPR)
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = getPrimaryColor();
        ctx.fill();
      }

      // Draw connections between nearby particles
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
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            if (hslMatch) {
              const [, h, s, l] = hslMatch;
              ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${opacity * 0.7})`;
            } else {
              // Fallback if regex doesn't match
              ctx.strokeStyle = primaryColor.replace('hsl', 'hsla').replace(')', `, ${opacity * 0.7})`);
            }
            
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
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
