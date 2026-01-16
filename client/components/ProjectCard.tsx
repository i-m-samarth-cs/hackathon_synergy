import { useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  compatibilityScore: number;
  techStack: string[];
  teamSize: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  features: string[];
  starterCode?: string;
  github?: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  onViewCode?: (project: Project) => void;
}

export function ProjectCard({ project, index = 0, onViewCode }: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div
      className="h-full animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Flip card container */}
      <div
        className="relative w-full h-full cursor-pointer transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full glassmorphism rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold gradient-text flex-1">{project.name}</h3>
              <span className="text-3xl">{project.id.charCodeAt(0) % 2 === 0 ? '⚛️' : '🐍'}</span>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
            
            {/* Social Impact Badge (if available) */}
            {project.features && project.features[0] && project.features[0].includes('Addresses') && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-green-300 font-medium">🌱 {project.features[0]}</p>
              </div>
            )}

            {/* Compatibility Score */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Compatibility</span>
                <span className={`font-bold text-lg ${getScoreColor(project.compatibilityScore)}`}>
                  {project.compatibilityScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${project.compatibilityScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Footer with tags and difficulty */}
          <div className="space-y-3">
            {/* Difficulty badge */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(project.difficulty)}`}>
                {project.difficulty} • {project.teamSize} people
              </span>
            </div>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-2 py-1 rounded-md text-xs bg-primary/20 text-primary border border-primary/30">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 rounded-md text-xs bg-primary/20 text-primary border border-primary/30">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>

            {/* Action hint */}
            <p className="text-xs text-muted-foreground/50 text-center">Click to flip for more details</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full glassmorphism rounded-2xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Header */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-4">Key Features</h4>

            {/* Features list */}
            <ul className="space-y-2 mb-4">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewCode?.(project);
              }}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              📝 View Starter Code
            </button>
            {project.github && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.github, '_blank');
                }}
                className="w-full px-4 py-2 rounded-lg border border-primary/50 text-primary font-medium hover:bg-primary/10 transition-colors"
              >
                🔗 GitHub Repository
              </button>
            )}
            <p className="text-xs text-muted-foreground/50 text-center mt-2">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProjectsGridProps {
  projects: Project[];
  onViewCode?: (project: Project) => void;
}

export function ProjectsGrid({ projects, onViewCode }: ProjectsGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Project Matches</h2>
        <p className="text-muted-foreground">
          Found {projects.length} perfect projects for your skills and interests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={project.id} style={{ minHeight: '400px' }}>
            <ProjectCard project={project} index={index} onViewCode={onViewCode} />
          </div>
        ))}
      </div>
    </div>
  );
}
