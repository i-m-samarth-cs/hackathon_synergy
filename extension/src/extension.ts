import * as vscode from 'vscode';
import { WebviewPanel } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let currentPanel: WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Hackathon Synergy Agent extension is now active!');

  // Register the main command
  const disposable = vscode.commands.registerCommand(
    'hackathon-synergy.generate',
    () => {
      generateProjectMatch(context);
    }
  );

  context.subscriptions.push(disposable);

  // Register keyboard shortcut handler (Ctrl+Shift+H)
  const shortcutCommand = vscode.commands.registerCommand(
    'hackathon-synergy.shortcut',
    () => {
      generateProjectMatch(context);
    }
  );

  context.subscriptions.push(shortcutCommand);
}

function generateProjectMatch(context: vscode.ExtensionContext) {
  // Create or show the webview panel
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'hackathonSynergy',
    '🚀 Hackathon Synergy Agent',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))],
    }
  );

  // Set the webview content
  currentPanel.webview.html = getWebviewContent(context, currentPanel.webview);

  // Handle messages from the webview
  currentPanel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case 'detectStackAndGenerate':
          handleDetectStackAndGenerate(context, message, currentPanel!);
          break;
        case 'copyCode':
          vscode.env.clipboard.writeText(message.code);
          vscode.window.showInformationMessage('Code copied to clipboard!');
          break;
        case 'generateReadme':
          generateReadme(message.projectName, message.readme);
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  // Handle panel closed
  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  });

  // Auto-detect tech stack when panel opens
  detectTechStack(context, currentPanel);
}

function detectTechStack(context: vscode.ExtensionContext, panel: WebviewPanel) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    panel.webview.postMessage({ command: 'noWorkspace' });
    return;
  }

  const detectedStack: string[] = [];
  const rootPath = workspaceFolder.uri.fsPath;

  // Check package.json for dependencies
  const packageJsonPath = path.join(rootPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Check for tech stack indicators
      if (allDeps['react-native']) detectedStack.push('React Native');
      if (allDeps['fastapi']) detectedStack.push('FastAPI');
      if (allDeps['express']) detectedStack.push('Express');
      if (allDeps['web3'] || allDeps['ethers']) detectedStack.push('Web3');
    } catch (error) {
      console.error('Error reading package.json:', error);
    }
  }

  // Check for Python dependencies (requirements.txt or pyproject.toml)
  const requirementsPath = path.join(rootPath, 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    try {
      const requirements = fs.readFileSync(requirementsPath, 'utf8');
      if (requirements.includes('fastapi')) detectedStack.push('FastAPI');
      if (requirements.includes('django')) detectedStack.push('Django');
      if (requirements.includes('tensorflow') || requirements.includes('torch')) {
        detectedStack.push('AI/ML');
      }
    } catch (error) {
      console.error('Error reading requirements.txt:', error);
    }
  }

  // Check for blockchain imports
  const files = vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,py}');
  files.then((uris) => {
    let hasBlockchain = false;
    uris.slice(0, 10).forEach((uri) => {
      try {
        const content = fs.readFileSync(uri.fsPath, 'utf8');
        if (content.includes('arbitrum') || content.includes('web3')) {
          hasBlockchain = true;
        }
      } catch {
        // Ignore errors
      }
    });

    if (hasBlockchain) {
      detectedStack.push('Blockchain');
    }

    // Remove duplicates
    const uniqueStack = [...new Set(detectedStack)];

    // Send detected stack to webview
    panel.webview.postMessage({
      command: 'stackDetected',
      stack: uniqueStack.length > 0 ? uniqueStack : ['React Native', 'FastAPI'],
      location: { latitude: null, longitude: null },
      locationName: '',
    });
  });
}

async function handleDetectStackAndGenerate(
  context: vscode.ExtensionContext,
  message: any,
  panel: WebviewPanel
) {
  // Show progress
  vscode.window.showInformationMessage(
    'Scanning your project... Querying Algolia Agent Studio...'
  );

  panel.webview.postMessage({ command: 'startLoading' });

  try {
    // Fetch from the backend server
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5173';
    const response = await fetch(`${backendUrl}/api/generate-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: message.skills,
        hackathon: message.hackathon,
        location: message.location,
      }),
    });

    const result = await response.json();

    panel.webview.postMessage({
      command: 'projectsGenerated',
      projects: result.projects,
      message: result.message,
    });
  } catch (error) {
    console.error('Error generating projects:', error);
    panel.webview.postMessage({
      command: 'error',
      message: 'Failed to generate projects. Make sure the backend server is running.',
    });
  }
}

function generateReadme(projectName: string, readme: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  const readmePath = path.join(workspaceFolder.uri.fsPath, `${projectName.toLowerCase()}-README.md`);

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(readmePath),
    Buffer.from(readme, 'utf8')
  );

  vscode.window.showInformationMessage(
    `Generated README for ${projectName}. Check your workspace!`
  );
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUri = isDevelopment
    ? 'http://localhost:5173'
    : webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist')));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hackathon Synergy Agent</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: #0a0a0f;
      color: #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
    }
    
    #root {
      width: 100%;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    const vscode = acquireVsCodeApi();
    window.__vscode__ = vscode;
  </script>
  ${isDevelopment 
    ? `<script type="module" src="${baseUri}/@vite/client"></script>
       <script type="module" src="${baseUri}/extension-client.tsx"></script>`
    : `<script src="${baseUri}/extension-client.js"><\/script>`
  }
</body>
</html>
`;
}

export function deactivate() {
  console.log('Hackathon Synergy Agent extension deactivated');
}
