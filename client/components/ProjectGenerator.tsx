import { useState } from 'react';
import { DualRingLoader } from './LottieAnimations';

interface ProjectGeneratorProps {
  onGenerate?: (data: GenerateData) => void;
  isLoading?: boolean;
}

export interface GenerateData {
  skills: string[];
  hackathon: string;
  location: string;
}

const SKILLS = [
  'React Native',
  'FastAPI',
  'TypeScript',
  'Python',
  'Blockchain',
  'Web3',
  'AI/ML',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
];

const HACKATHONS = [
  'Smart India Hackathon',
  'JHUB',
  'Sinhgad',
  'Flipkart GrO',
  'E-Cell IITB',
  'HackCMU',
  'AngelHack',
];

export function ProjectGenerator({ onGenerate, isLoading = false }: ProjectGeneratorProps) {
  const [skills, setSkills] = useState<string[]>(['React Native', 'FastAPI']);
  const [hackathon, setHackathon] = useState('Smart India Hackathon');
  const [location, setLocation] = useState('');

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleGenerate = () => {
    onGenerate?.({
      skills,
      hackathon,
      location,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Card with glassmorphism */}
      <div className="glassmorphism rounded-2xl p-8 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Find Your Project Match</h3>
          <p className="text-muted-foreground">
            Select your tech stack and target hackathon to discover the perfect collaboration opportunity
          </p>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-foreground">
            Your Tech Stack
          </label>
          <p className="text-sm text-muted-foreground mb-4">
            Select all the technologies you're proficient in
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  skills.includes(skill)
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                    : 'bg-card border border-border hover:border-primary/50 text-foreground hover:bg-card/80'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Hackathon Selector */}
        <div className="space-y-4">
          <label htmlFor="hackathon" className="block text-lg font-semibold text-foreground">
            Target Hackathon
          </label>

          <select
            id="hackathon"
            value={hackathon}
            onChange={(e) => setHackathon(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            {HACKATHONS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="space-y-4">
          <label htmlFor="location" className="block text-lg font-semibold text-foreground">
            Your Location
          </label>
          <div className="flex items-center gap-2">
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mumbai, India or New York, USA"
              className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your city and country to find local opportunities
          </p>
        </div>

        {/* Selected Skills Display */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Selected ({skills.length}): {skills.join(', ')}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || skills.length === 0 || !location.trim()}
          className="w-full gradient-button px-6 py-4 rounded-lg text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5">
                <div className="dual-ring-outer absolute inset-0 rounded-full border-2 border-transparent border-t-white"></div>
              </div>
              <span>Generating...</span>
            </div>
          ) : (
            <>
              🚀 Generate Project Match
            </>
          )}
        </button>

        {isLoading && (
          <div className="flex justify-center py-4">
            <DualRingLoader size="md" text="Querying Algolia Agent Studio..." />
          </div>
        )}
      </div>
    </div>
  );
}
