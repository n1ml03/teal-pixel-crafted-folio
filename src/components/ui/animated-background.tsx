import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'dots' | 'waves' | 'gradient';
  color1?: string;
  color2?: string;
  speed?: number;
}

/**
 * AnimatedBackground component that creates various animated background effects
 */
export const AnimatedBackground = ({
  children,
  className = '',
  variant = 'dots',
  color1 = 'rgba(20, 184, 166, 0.1)',
  color2 = 'rgba(56, 189, 248, 0.1)',
  speed = 20
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dots animation
  useEffect(() => {
    if (variant !== 'dots' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Create dots
    const dots: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];
    const dotCount = Math.floor((canvas.width * canvas.height) / 10000);

    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update dots
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();

        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, color1]);

  // Render different background variants
  if (variant === 'dots') {
    return (
      <div className={`relative ${className}`}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full -z-10"
        />
        {children}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              `linear-gradient(45deg, ${color1} 0%, ${color2} 100%)`,
              `linear-gradient(225deg, ${color1} 0%, ${color2} 100%)`,
              `linear-gradient(45deg, ${color1} 0%, ${color2} 100%)`
            ]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {children}
      </div>
    );
  }

  // Default to waves
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <motion.path
            fill={color1}
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,181.3C96,203,192,245,288,240C384,235,480,181,576,181.3C672,181,768,235,864,245.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
      {children}
    </div>
  );
};
