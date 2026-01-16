import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface Project {
  id: string;
  name: string;
  description: string;
  compatibilityScore: number;
  techStack: string[];
  features: string[];
  starterCode: string;
}

function WebviewUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(['React Native', 'FastAPI']);
  const [hackathon, setHackathon] = useState('Smart India Hackathon');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detectedStack, setDetectedStack] = useState<string[]>([]);

  const vscode = (window as any).__vscode__;

  // Listen for messages from the extension
  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message = event.data;

      switch (message.command) {
        case 'stackDetected':
          setDetectedStack(message.stack);
          setSkills(message.stack);
          break;
        case 'startLoading':
          setIsLoading(true);
          break;
        case 'projectsGenerated':
          setProjects(message.projects);
          setIsLoading(false);
          break;
        case 'error':
          alert(message.message);
          setIsLoading(false);
          break;
        case 'noWorkspace':
          alert('Please open a workspace first');
          break;
      }
    };

    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  }, []);

  const handleGenerate = () => {
    vscode.postMessage({
      command: 'detectStackAndGenerate',
      skills,
      hackathon,
      location: 'Dhule, Maharashtra',
    });
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const copyCode = (code: string) => {
    vscode.postMessage({
      command: 'copyCode',
      code,
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>
          🚀 Hackathon Synergy Agent
        </h1>
        <p style={{ color: '#888', marginBottom: '4px' }}>
          Powered by Algolia Agent Studio
        </p>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Dhule, Maharashtra • India
        </p>
      </div>

      {/* Detected Stack */}
      {detectedStack.length > 0 && (
        <div
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
            Detected Stack:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {detectedStack.map((tech) => (
              <span
                key={tech}
                style={{
                  background: 'rgba(102, 126, 234, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Tech Stack
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
          {[
            'React Native',
            'FastAPI',
            'TypeScript',
            'Python',
            'Blockchain',
            'Web3',
            'AI/ML',
            'Node.js',
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: skills.includes(skill) ? '#667eea' : '#333',
                color: skills.includes(skill) ? '#fff' : '#999',
                fontSize: '12px',
                fontWeight: skills.includes(skill) ? 'bold' : 'normal',
              }}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathon Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Hackathon
        </label>
        <select
          value={hackathon}
          onChange={(e) => setHackathon(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #444',
            background: '#222',
            color: '#eee',
          }}
        >
          <option>Smart India Hackathon</option>
          <option>JHUB</option>
          <option>Sinhgad</option>
          <option>Flipkart GrO</option>
          <option>E-Cell IITB</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || skills.length === 0}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          border: 'none',
          background: isLoading ? '#666' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontWeight: 'bold',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {isLoading ? '⏳ Generating...' : '🚀 Generate Project Match'}
      </button>

      {/* Results */}
      {projects.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '12px', fontWeight: 'bold' }}>
            📌 Your Project Matches ({projects.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    'rgba(255, 255, 255, 0.12)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: 'bold' }}>{project.name}</h4>
                  <span style={{ color: '#4fa643', fontWeight: 'bold' }}>
                    {project.compatibilityScore}%
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '10px',
                        background: 'rgba(102, 126, 234, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Project Detail */}
      {selectedProject && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1a1a1f',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ✕
          </button>

          <h3 style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            {selectedProject.name}
          </h3>
          <p style={{ color: '#999', fontSize: '12px', marginBottom: '16px' }}>
            {selectedProject.description}
          </p>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Key Features:
            </p>
            <ul style={{ fontSize: '12px', lineHeight: '1.6', color: '#999' }}>
              {selectedProject.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => copyCode(selectedProject.starterCode)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #667eea',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            📋 Copy Starter Code
          </button>

          <button
            onClick={() => setSelectedProject(null)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              background: '#333',
              color: '#eee',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// Mount the app
const root = createRoot(document.getElementById('root')!);
root.render(<WebviewUI />);
