/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for project generation
 */
export interface GenerateProjectRequest {
  skills: string[];
  hackathon: string;
  location: string;
}

/**
 * Project match response (Algolia Agent Studio format)
 */
export interface ProjectMatch {
  project_name: string;
  description: string;
  tech_stack: string[];
  social_impact: string;
  starter_code: {
    language: string;
    snippet: string;
  };
  readme_sections?: string[];
  // Legacy fields for backward compatibility
  id?: string;
  name?: string;
  compatibilityScore?: number;
  teamSize?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  features?: string[];
  starterCode?: string;
  github?: string;
}

/**
 * Response type for /api/generate-project
 */
export interface GenerateProjectResponse {
  success: boolean;
  projects: ProjectMatch[];
  message: string;
  timestamp: number;
}
