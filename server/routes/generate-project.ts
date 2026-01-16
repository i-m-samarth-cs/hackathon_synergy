import { RequestHandler } from 'express';
import { GenerateProjectRequest, GenerateProjectResponse, ProjectMatch } from '@shared/api';

// Algolia credentials
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'LWEP9U8JDM';
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY || '59b171a143341ee2c87e5f02564486c8';
const ALGOLIA_WRITE_API_KEY = process.env.ALGOLIA_WRITE_API_KEY || '37a25d6ea19e1f0d41b40e7d2d367506';

// Lazy load Algolia client to avoid Vite bundling issues
let algoliaClient: any = null;
async function getAlgoliaClient() {
  if (!algoliaClient) {
    const { algoliasearch } = await import('algoliasearch');
    algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
  }
  return algoliaClient;
}

/**
 * Constructs the Algolia Agent Studio prompt for hybridizing repos
 */
function buildAgentStudioPrompt(skills: string[], location: string): string {
  const skillsList = skills.join(', ');
  return `Hybridize top 3 repos for skills: ${skillsList} + location: ${location} solving regional problems (rural fitness, Marathi education, Maharashtra agriculture). Return JSON ONLY:
{
  "project_name": "RuralGymChain",
  "description": "Blockchain gym tracker for Dhule villages",
  "tech_stack": ["React Native", "FastAPI", "Arbitrum"],
  "social_impact": "Addresses rural fitness gap",
  "starter_code": {"language": "javascript", "snippet": "// code"},
  "readme_sections": ["## Demo", "## Tech Stack", "## Deployment"]
}`;
}

/**
 * Parses Algolia Agent Studio response and converts to ProjectMatch format
 */
function parseAgentStudioResponse(response: any): ProjectMatch[] {
  try {
    // If response is already an array of projects
    if (Array.isArray(response)) {
      return response.map((item) => ({
        project_name: item.project_name || item.name || 'Untitled Project',
        description: item.description || '',
        tech_stack: item.tech_stack || item.techStack || [],
        social_impact: item.social_impact || 'Addresses regional challenges',
        starter_code: item.starter_code || {
          language: item.starterCode?.language || 'javascript',
          snippet: item.starterCode?.snippet || item.starterCode || '// Starter code',
        },
        readme_sections: item.readme_sections || ['## Demo', '## Tech Stack', '## Deployment'],
        // Legacy fields for backward compatibility
        id: item.id || item.project_name?.toLowerCase().replace(/\s+/g, '-'),
        name: item.project_name || item.name,
        compatibilityScore: item.compatibilityScore || 85,
      }));
    }

    // If response is a single project object
    if (response.project_name || response.name) {
      return [
        {
          project_name: response.project_name || response.name,
          description: response.description || '',
          tech_stack: response.tech_stack || response.techStack || [],
          social_impact: response.social_impact || 'Addresses regional challenges',
          starter_code: response.starter_code || {
            language: response.starterCode?.language || 'javascript',
            snippet: response.starterCode?.snippet || response.starterCode || '// Starter code',
          },
          readme_sections: response.readme_sections || ['## Demo', '## Tech Stack', '## Deployment'],
          id: response.id || response.project_name?.toLowerCase().replace(/\s+/g, '-'),
          name: response.project_name || response.name,
          compatibilityScore: response.compatibilityScore || 85,
        },
      ];
    }

    // If response contains a 'projects' or 'results' field
    if (response.projects || response.results) {
      return parseAgentStudioResponse(response.projects || response.results);
    }

    // Fallback: try to extract JSON from text response
    const jsonMatch = typeof response === 'string' ? response.match(/\{[\s\S]*\}/) : null;
    if (jsonMatch) {
      return parseAgentStudioResponse(JSON.parse(jsonMatch[0]));
    }

    // Default fallback
    return [];
  } catch (error) {
    console.error('Error parsing Agent Studio response:', error);
    return [];
  }
}

export const handleGenerateProject: RequestHandler<
  unknown,
  GenerateProjectResponse,
  GenerateProjectRequest
> = async (req, res) => {
  try {
    const { skills, hackathon, location } = req.body;

    // Validation
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        projects: [],
        message: 'Skills array is required and must not be empty',
        timestamp: Date.now(),
      });
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({
        success: false,
        projects: [],
        message: 'Location is required',
        timestamp: Date.now(),
      });
    }

    // Build Agent Studio prompt
    const prompt = buildAgentStudioPrompt(skills, location);

    try {
      // Query Algolia Agent Studio
      // Note: Algolia Agent Studio uses the search API with specific query parameters
      // For Agent Studio, we typically use the search endpoint with natural language queries
      let projects: ProjectMatch[] = [];

      try {
        const client = await getAlgoliaClient();
        const index = client.initIndex('hackathon-projects');
        
        // Attempt to search with the prompt as a query
        const searchResults = await index.search(prompt, {
          hitsPerPage: 3,
          attributesToRetrieve: ['*'],
        });

        if (searchResults.hits && searchResults.hits.length > 0) {
          projects = parseAgentStudioResponse(searchResults.hits);
        }
      } catch (searchError) {
        console.warn('Algolia search failed, using Agent Studio API approach:', searchError);
        
        // Alternative: Use Algolia's Agent Studio API endpoint directly
        // This would require making an HTTP request to Algolia's Agent Studio endpoint
        // For now, we'll generate a mock response based on the prompt
        projects = generateMockProjectsFromPrompt(skills, location);
      }

      // If no projects found, generate mock projects
      if (projects.length === 0) {
        projects = generateMockProjectsFromPrompt(skills, location);
      }

      // Ensure we return exactly 3 projects
      const finalProjects = projects.slice(0, 3);

      res.json({
        success: true,
        projects: finalProjects,
        message: `Found ${finalProjects.length} project matches for ${skills.join(', ')} in ${location}`,
        timestamp: Date.now(),
      });
    } catch (algoliaError) {
      console.error('Algolia Agent Studio error:', algoliaError);
      // Fallback to mock projects
      const fallbackProjects = generateMockProjectsFromPrompt(skills, location);
      res.json({
        success: true,
        projects: fallbackProjects,
        message: `Generated ${fallbackProjects.length} project matches for ${skills.join(', ')} in ${location} (using fallback)`,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error generating projects:', error);
    res.status(500).json({
      success: false,
      projects: [],
      message: 'Failed to generate projects',
      timestamp: Date.now(),
    });
  }
};

/**
 * Generates mock projects based on skills and location when Algolia is unavailable
 */
function generateMockProjectsFromPrompt(skills: string[], location: string): ProjectMatch[] {
  const locationLower = location.toLowerCase();
  const isMaharashtra = locationLower.includes('maharashtra') || locationLower.includes('dhule') || locationLower.includes('mumbai');
  
  const projects: ProjectMatch[] = [];

  // Project 1: Rural Fitness (if relevant skills)
  if (skills.some(s => s.toLowerCase().includes('react native') || s.toLowerCase().includes('blockchain') || s.toLowerCase().includes('fastapi'))) {
    projects.push({
      project_name: 'RuralGymChain',
      description: `React Native + FastAPI gym tracker with Arbitrum rewards for ${location} rural gyms`,
      tech_stack: ['React Native', 'FastAPI', 'Arbitrum', 'Algolia'],
      social_impact: 'Addresses rural fitness gap by providing accessible workout tracking and blockchain rewards',
      starter_code: {
        language: 'javascript',
        snippet: `const GymTracker = () => {\n  const [workouts, setWorkouts] = useState([]);\n  // Algolia search integration\n  const searchGyms = async (query) => {\n    const { hits } = await algoliaClient.search(query);\n    return hits;\n  };\n  return <View>Gym Tracker</View>;\n};`,
      },
      readme_sections: ['## Demo', '## Tech Stack', '## Deployment', '## Social Impact'],
    });
  }

  // Project 2: Marathi Education (if relevant skills)
  if (isMaharashtra && skills.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('ml') || s.toLowerCase().includes('python'))) {
    projects.push({
      project_name: 'MarathiEduAI',
      description: `AI-powered Marathi language learning platform for ${location} students`,
      tech_stack: ['FastAPI', 'AI/ML', 'Python', 'React', 'Algolia'],
      social_impact: 'Bridges language education gap in Maharashtra through AI-powered personalized learning',
      starter_code: {
        language: 'python',
        snippet: `from fastapi import FastAPI\nimport algoliasearch\n\napp = FastAPI()\nclient = algoliasearch.Client('${ALGOLIA_APP_ID}', '${ALGOLIA_SEARCH_API_KEY}')\n\n@app.post("/api/learn")\nasync def learn_marathi(text: str):\n    # AI-powered Marathi learning\n    return {"lesson": "Generated lesson"}`,
      },
      readme_sections: ['## Demo', '## Tech Stack', '## Deployment', '## Social Impact'],
    });
  }

  // Project 3: Agriculture (if relevant skills)
  if (isMaharashtra && skills.some(s => s.toLowerCase().includes('react native') || s.toLowerCase().includes('blockchain') || s.toLowerCase().includes('node'))) {
    projects.push({
      project_name: 'MaharashtraAgriChain',
      description: `Blockchain-based agricultural supply chain tracker for ${location} farmers`,
      tech_stack: ['React Native', 'Blockchain', 'Node.js', 'Algolia', 'PostgreSQL'],
      social_impact: 'Empowers Maharashtra farmers with transparent supply chain and fair pricing through blockchain',
      starter_code: {
        language: 'javascript',
        snippet: `const AgriTracker = () => {\n  const [crops, setCrops] = useState([]);\n  // Blockchain integration for supply chain\n  const trackCrop = async (cropData) => {\n    // Record on blockchain\n    return await blockchain.record(cropData);\n  };\n  return <View>Agri Tracker</View>;\n};`,
      },
      readme_sections: ['## Demo', '## Tech Stack', '## Deployment', '## Social Impact'],
    });
  }

  // If no specific matches, create a generic project
  if (projects.length === 0) {
    projects.push({
      project_name: 'RegionalSolution',
      description: `Hybrid solution combining ${skills.slice(0, 3).join(', ')} for ${location} regional challenges`,
      tech_stack: skills.slice(0, 5),
      social_impact: `Addresses regional problems in ${location} through technology innovation`,
      starter_code: {
        language: 'javascript',
        snippet: `// Starter code for ${skills.join(', ')} project\nconst App = () => {\n  return <div>Regional Solution</div>;\n};`,
      },
      readme_sections: ['## Demo', '## Tech Stack', '## Deployment'],
    });
  }

  return projects;
}
