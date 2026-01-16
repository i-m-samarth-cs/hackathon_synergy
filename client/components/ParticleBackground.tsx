import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  icon: string;
  opacity: number;
  pulsePhase: number;
}

const techIcons = ['⚛️', '🐍', '⛓️', '🔍', '💻', '🤖', '🚀', '✨'];
const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Initialize particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(30, Math.floor(window.innerWidth / 50));

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 15 + Math.random() * 25,
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: techIcons[Math.floor(Math.random() * techIcons.length)],
          opacity: 0.3 + Math.random() * 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };
    createParticles();

    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
          particle.vy *= -1;
        }

        // Clamp position
        particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
        particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));

        // Update pulse phase
        particle.pulsePhase += 0.02;

        // Draw glow
        const glowSize = particle.radius * (1.5 + Math.sin(particle.pulsePhase) * 0.5);
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize);
        gradient.addColorStop(0, particle.color + '40');
        gradient.addColorStop(0.7, particle.color + '20');
        gradient.addColorStop(1, particle.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle circle
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = particle.opacity * (0.8 + Math.sin(particle.pulsePhase) * 0.2);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw icon
        ctx.font = `${particle.radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = particle.opacity * 0.9;
        ctx.fillText(particle.icon, particle.x, particle.y);
        ctx.globalAlpha = 1;

        // Draw connections to nearby particles
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 150) * 0.1;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
