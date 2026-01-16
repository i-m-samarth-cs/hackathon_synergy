import { useEffect, useState } from 'react';

interface OrbitingRepo {
  id: number;
  name: string;
  icon: string;
  angle: number;
}

const repos: OrbitingRepo[] = [
  { id: 1, name: 'React Native', icon: '⚛️', angle: 0 },
  { id: 2, name: 'FastAPI', icon: '🐍', angle: 120 },
  { id: 3, name: 'Blockchain', icon: '⛓️', angle: 240 },
  { id: 4, name: 'Algolia', icon: '🔍', angle: 60 },
  { id: 5, name: 'VSCode', icon: '💻', angle: 180 },
  { id: 6, name: 'AI/ML', icon: '🤖', angle: 300 },
];

export function Hero() {
  const [typewriter, setTypewriter] = useState('');
  const text = 'Discover your perfect hackathon project match';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypewriter(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-background overflow-hidden">
      {/* Animated gradient orb background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Heading with gradient */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4">
            <span className="gradient-text">🚀 Hackathon Synergy</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground neon-glow mb-8">
            Agent
          </h2>
        </div>

        {/* Central map pin with orbiting repos */}
        <div className="relative w-80 h-80 mx-auto mb-12">
          {/* Orbit circles */}
          <div className="absolute inset-0 rounded-full border border-primary/20"></div>
          <div className="absolute inset-4 rounded-full border border-primary/10"></div>
          <div className="absolute inset-8 rounded-full border border-primary/5"></div>

          {/* Central Dhule pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-full w-20 h-20 bg-primary/30 blur-xl animate-glow-pulse"></div>
              
              {/* Pin container */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                <span className="text-3xl">📍</span>
              </div>

              {/* Center label */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="text-sm font-semibold text-primary">Your Location</div>
                <div className="text-xs text-muted-foreground text-center">Set below</div>
              </div>
            </div>
          </div>

          {/* Orbiting repos */}
          {repos.map((repo, index) => (
            <div
              key={repo.id}
              className="absolute w-full h-full"
              style={{
                animation: `orbit 20s linear infinite`,
                animationDelay: `${-index * 3.33}s`,
              }}
            >
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transformOrigin: '0 160px',
                }}
              >
                {/* Orbiting badge */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full w-12 h-12 bg-primary/20 blur-md"></div>
                  <div className="relative w-12 h-12 rounded-full bg-card glassmorphism flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-card/80 transition-all cursor-pointer group">
                    <span className="text-lg group-hover:scale-125 transition-transform">
                      {repo.icon}
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-card glassmorphism px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {repo.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Typewriter subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 h-8">
            <span className="typewriter">{typewriter}</span>
          </p>
          <p className="text-sm sm:text-base text-muted-foreground/70">
            Built for Indian engineering students. Powered by Algolia Agent Studio.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button className="gradient-button px-8 py-4 rounded-lg text-white font-semibold shadow-lg">
            Generate Project Match
          </button>
          <button className="px-8 py-4 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-colors">
            View Hackathons
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-primary/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
