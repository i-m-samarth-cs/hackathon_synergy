import { useState, useRef } from 'react';
import { Hero } from '../components/Hero';
import { ParticleBackground } from '../components/ParticleBackground';
import { ProjectGenerator, GenerateData } from '../components/ProjectGenerator';
import { ProjectsGrid, Project } from '../components/ProjectCard';
import { CodePreviewModal } from '../components/CodePreview';
import { RocketLaunch, ConfettiBurst } from '../components/LottieAnimations';
import type { GenerateProjectResponse, ProjectMatch } from '@shared/api';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (data: GenerateData) => {
    setIsLoading(true);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: data.skills,
          hackathon: data.hackathon,
          location: data.location,
        }),
      });

      const result: GenerateProjectResponse = await response.json();

      if (result.success && result.projects.length > 0) {
        // Transform ProjectMatch to Project (handles both new and legacy formats)
        const transformedProjects: Project[] = result.projects.map((pm: ProjectMatch) => ({
          id: pm.id || pm.project_name?.toLowerCase().replace(/\s+/g, '-') || `project-${Math.random()}`,
          name: pm.project_name || pm.name || 'Untitled Project',
          description: pm.description || '',
          compatibilityScore: pm.compatibilityScore || 85,
          techStack: pm.tech_stack || pm.techStack || [],
          teamSize: pm.teamSize || 4,
          difficulty: pm.difficulty || 'Medium',
          features: pm.features || [
            pm.social_impact || 'Addresses regional challenges',
            ...(pm.readme_sections || []).slice(0, 3),
          ],
          starterCode: pm.starter_code?.snippet || pm.starterCode || '// Starter code',
          github: pm.github,
        }));

        setProjects(transformedProjects);
        setShowSuccess(true);

        // Scroll to results
        setTimeout(() => {
          projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);

        // Hide success animation after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error generating projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Particle background */}
      <ParticleBackground />

      {/* Confetti burst for success */}
      <ConfettiBurst trigger={showSuccess} />

      {/* Hero Section */}
      <Hero />

      {/* Success animation overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="scale-75 sm:scale-100">
            <RocketLaunch size={100} />
          </div>
        </div>
      )}

      {/* Project Generator Section */}
      <section className="relative z-20 bg-gradient-to-b from-background via-background/80 to-background py-8">
        <div className="container mx-auto">
          <ProjectGenerator onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      </section>

      {/* Projects Results Section */}
      {projects.length > 0 && (
        <section
          ref={projectsRef}
          className="relative z-20 bg-gradient-to-b from-background to-background/60 py-8"
        >
          <div className="container mx-auto">
            <ProjectsGrid
              projects={projects}
              onViewCode={(project) => setSelectedProject(project)}
            />
          </div>
        </section>
      )}

      {/* Code Preview Modal */}
      <CodePreviewModal
        isOpen={!!selectedProject}
        code={selectedProject?.starterCode || ''}
        language={selectedProject?.starterCode?.includes('from fastapi') ? 'python' : 
                  selectedProject?.starterCode?.includes('const') || selectedProject?.starterCode?.includes('import React') ? 'javascript' : 
                  'typescript'}
        title={`${selectedProject?.name || ''} - Starter Code`}
        onClose={() => setSelectedProject(null)}
      />

      {/* Info Section */}
      <section className="relative z-20 bg-card/30 py-12 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold gradient-text">
              🚀 Find Your Perfect Hackathon Match
            </h2>
            <p className="text-muted-foreground text-lg">
              Hackathon Synergy Agent uses cutting-edge AI powered by Algolia Agent Studio to match
              your skills with the perfect hackathon projects.
            </p>

            {/* Tech Stack Icons */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg glassmorphism flex items-center justify-center text-3xl hover:shadow-lg hover:shadow-primary/50 transition-shadow">
                  ⚛️
                </div>
                <span className="text-sm text-muted-foreground">React Native</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg glassmorphism flex items-center justify-center text-3xl hover:shadow-lg hover:shadow-primary/50 transition-shadow">
                  🐍
                </div>
                <span className="text-sm text-muted-foreground">FastAPI</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg glassmorphism flex items-center justify-center text-3xl hover:shadow-lg hover:shadow-primary/50 transition-shadow">
                  ⛓️
                </div>
                <span className="text-sm text-muted-foreground">Blockchain</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg glassmorphism flex items-center justify-center text-3xl hover:shadow-lg hover:shadow-primary/50 transition-shadow">
                  🔍
                </div>
                <span className="text-sm text-muted-foreground">Algolia</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg glassmorphism flex items-center justify-center text-3xl hover:shadow-lg hover:shadow-primary/50 transition-shadow">
                  🤖
                </div>
                <span className="text-sm text-muted-foreground">AI/ML</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mt-8 text-left">
              <div className="glassmorphism rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">⚡ Fast Matching</h4>
                <p className="text-sm text-muted-foreground">
                  Get matched with projects in seconds using AI-powered analysis
                </p>
              </div>
              <div className="glassmorphism rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">🎯 Precise Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Projects tailored to your exact skill set and hackathon preferences
                </p>
              </div>
              <div className="glassmorphism rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">📚 Starter Code</h4>
                <p className="text-sm text-muted-foreground">
                  Get production-ready boilerplate code to jumpstart your project
                </p>
              </div>
              <div className="glassmorphism rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">🌍 Location-Based</h4>
                <p className="text-sm text-muted-foreground">
                  Discover opportunities in your city, country, or globally
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-border bg-card/20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            Built by Samarth | Powered by Algolia Agent Studio
          </p>
          <p className="text-xs mt-2 text-muted-foreground/50">
            Global Hackathon Synergy • 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
