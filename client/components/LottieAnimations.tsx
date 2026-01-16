import React from 'react';

interface DualRingLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

interface RocketLaunchProps {
  size?: number;
}

interface ConfettiProps {
  trigger?: boolean;
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

// Dual ring spinner with code compiling animation
export function DualRingLoader({ size = 'md', text = 'Scanning hackathon repos...' }: DualRingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes dual-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dual-ring-inner {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .dual-ring-outer {
          animation: dual-ring 2s linear infinite;
        }
        .dual-ring-inner {
          animation: dual-ring-inner 1.5s linear infinite;
        }
      `}</style>

      <div className={`relative ${sizeMap[size]}`}>
        {/* Outer ring */}
        <div className="dual-ring-outer absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary"></div>

        {/* Inner ring */}
        <div className="dual-ring-inner absolute inset-2 rounded-full border-4 border-transparent border-b-accent border-l-primary"></div>

        {/* Center glow */}
        <div className="absolute inset-4 rounded-full bg-primary/20 blur-lg"></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">⚙️</span>
        </div>
      </div>

      {/* Typewriter text */}
      {text && (
        <div className="text-center">
          <div className="inline-block">
            <div className="typewriter text-sm text-muted-foreground">{text}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Rocket launch success animation
export function RocketLaunch({ size = 80 }: RocketLaunchProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes rocket-launch {
          0% {
            transform: translateY(0) rotate(90deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(90deg);
            opacity: 0;
          }
        }
        @keyframes rocket-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5), inset 0 0 10px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.8), inset 0 0 20px rgba(102, 126, 234, 0.5);
          }
        }
        .rocket-container {
          animation: rocket-launch 2s ease-in forwards;
        }
        .rocket-glow {
          animation: rocket-glow 1s ease-in-out infinite;
        }
        @keyframes trail {
          0% {
            opacity: 1;
            transform: translateY(20px);
          }
          100% {
            opacity: 0;
            transform: translateY(0);
          }
        }
        .trail {
          animation: trail 1s ease-out forwards;
        }
      `}</style>

      {/* Flame trails */}
      {[0, 100, 200].map((delay) => (
        <div
          key={delay}
          className="trail absolute w-4 h-8 bottom-0"
          style={{
            animationDelay: `${delay}ms`,
            background: 'linear-gradient(to top, #764ba2, transparent)',
            filter: 'blur(2px)',
          }}
        ></div>
      ))}

      {/* Rocket */}
      <div className="rocket-container rocket-glow relative w-20 h-20 bg-gradient-to-b from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-4xl">🚀</span>
      </div>

      {/* Success text */}
      <div className="text-center mt-4">
        <h3 className="text-2xl font-bold gradient-text mb-2">Hackathon Ready!</h3>
        <p className="text-muted-foreground">Your perfect project match has been generated</p>
      </div>
    </div>
  );
}

// Confetti burst animation
export function ConfettiBurst({ trigger = true }: ConfettiProps) {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
        .confetti {
          animation: confetti-fall forwards;
          position: fixed;
          pointer-events: none;
        }
      `}</style>

      {trigger &&
        confetti.map((particle) => (
          <div
            key={particle.id}
            className="confetti"
            style={{
              left: `${particle.left}%`,
              top: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][
                particle.id % 5
              ],
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        ))}
    </>
  );
}

// Loading spinner - minimal version
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={sizeMap[size]}>
      <div className="dual-ring-outer absolute inset-0 rounded-full border-4 border-transparent border-t-primary"></div>
    </div>
  );
}

// Pulse animation wrapper
export function PulseGlow({ children, intensity = 'normal' }: { children: React.ReactNode; intensity?: 'light' | 'normal' | 'intense' }) {
  const intensityMap = {
    light: 'shadow-lg shadow-primary/30',
    normal: 'shadow-xl shadow-primary/50',
    intense: 'shadow-2xl shadow-primary/70',
  };

  return (
    <div className={`animate-glow-pulse ${intensityMap[intensity]}`}>
      {children}
    </div>
  );
}
