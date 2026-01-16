# Hackathon Synergy Agent VSCode Extension

A powerful VSCode extension that automatically detects your tech stack and matches you with the perfect hackathon projects using Algolia Agent Studio.

## Features

✨ **Auto Tech Stack Detection**: Scans your project files for React Native, FastAPI, Blockchain, and more
🎯 **Intelligent Project Matching**: Uses Algolia Agent Studio AI to find projects tailored to your skills
🚀 **One-Click Code Generation**: Get production-ready starter code in seconds
📍 **Location-Based**: Find opportunities in your region globally
⌨️ **Quick Activation**: Press `Ctrl+Shift+H` (or `Cmd+Shift+H` on Mac) to launch

## Installation

### From Source

1. **Prerequisites**
   - Node.js v18+
   - npm or pnpm
   - VSCode v1.75+

2. **Clone & Install**
   ```bash
   cd extension
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Package for VSCode**
   ```bash
   npm install -g vsce
   vsce package
   ```

5. **Install in VSCode**
   - Open VSCode
   - Go to Extensions (Ctrl+Shift+X)
   - Click "Install from VSIX"
   - Select `hackathon-synergy-0.1.0.vsix`

### From Extension Marketplace
*(Coming soon - once published)*

## Usage

### Trigger the Extension

**Method 1: Keyboard Shortcut**
```
Windows/Linux: Ctrl + Shift + H
Mac: Cmd + Shift + H
```

**Method 2: Command Palette**
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
- Type "Hackathon Synergy: Generate"
- Press Enter

**Method 3: Context Menu**
- Right-click in editor
- Select "Hackathon Synergy: Generate Project Match"

### Generate Project Match

1. **Open a Project**: Open your hackathon project folder in VSCode
2. **Trigger Extension**: Press `Ctrl+Shift+H`
3. **Review Detected Stack**: See your auto-detected technologies
4. **Refine Selection**: Add/remove skills as needed
5. **Select Hackathon**: Choose your target hackathon
6. **Generate**: Click "Generate Project Match"
7. **View Results**: Browse project cards with compatibility scores
8. **Copy Code**: Click a project and copy its starter code

## Configuration

### Environment Variables

Create an `.env` file in the extension root:

```env
BACKEND_URL=http://localhost:5173
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
```

### Settings in VSCode

Go to Extensions → Hackathon Synergy → Extension Settings

- **Location**: Set your geographic location (default: Dhule, Maharashtra)
- **Hackathons**: Configure preferred hackathons
- **Auto-detect**: Enable/disable automatic tech stack detection

## Development

### Project Structure

```
extension/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── webview-ui.tsx        # Webview UI component
│   └── constants.ts          # Configuration constants
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript configuration
```

### Development Setup

1. **Install Dependencies**
   ```bash
   cd extension
   npm install
   ```

2. **Watch Mode**
   ```bash
   npm run watch
   ```

3. **Debug in VSCode**
   - Press `F5` to launch extension in debug mode
   - Extension opens in new VSCode window
   - Set breakpoints and debug normally

### Building

```bash
# Development build
npm run build

# Watch for changes
npm run watch

# Lint code
npm run lint

# Package for distribution
vsce package
```

## API Integration

The extension communicates with the backend via REST API:

### POST `/api/generate-project`

**Request**
```json
{
  "skills": ["React Native", "FastAPI"],
  "hackathon": "Smart India Hackathon",
  "location": "Your City, Your Country"
}
```

**Response**
```json
{
  "success": true,
  "projects": [
    {
      "id": "rural-gym-chain",
      "name": "RuralGymChain",
      "description": "A blockchain-based fitness tracking system",
      "compatibilityScore": 95,
      "techStack": ["React Native", "FastAPI", "Blockchain"],
      "features": ["..."],
      "starterCode": "import React from 'react'..."
    }
  ],
  "message": "Found 3 project matches",
  "timestamp": 1234567890
}
```

## Algolia Agent Studio Integration

The extension uses Algolia Agent Studio for non-conversational AI project matching:

1. **Initialize Algolia Client** (in extension backend)
   ```typescript
   import algoliasearch from 'algoliasearch';
   const client = algoliasearch(APP_ID, API_KEY);
   const index = client.initIndex('hackathon-projects');
   ```

2. **Query with Filters**
   ```typescript
   const results = await index.search('hackathon project', {
     filters: `skills:"React Native" OR skills:"FastAPI"`,
     ruleContexts: ['engineering', 'india'],
   });
   ```

3. **Rank by Compatibility**
   - Tech stack alignment
   - Difficulty level match
   - Hackathon relevance
   - Geographic proximity (user-specified location)

## Tech Stack Detection

The extension automatically detects:

- **Node.js Projects**: Reads `package.json` dependencies
  - React Native → `react-native`
  - Express → `express`
  - Web3 → `web3`, `ethers`

- **Python Projects**: Reads `requirements.txt` or `pyproject.toml`
  - FastAPI → `fastapi`
  - Django → `django`
  - ML Frameworks → `tensorflow`, `torch`

- **Blockchain**: Scans source code
  - Arbitrum imports
  - Web3 libraries
  - Smart contract files

## Troubleshooting

### Extension not activating

- Ensure VSCode is at least v1.75.0
- Check VSCode logs: `Help → Toggle Developer Tools`
- Try reinstalling: `code --uninstall-extension builder-io.hackathon-synergy`

### Cannot detect tech stack

- Make sure you've opened a folder in VSCode (not single files)
- Check that `package.json` or `requirements.txt` exists
- Look at VSCode's Extension Development Host console for errors

### Projects not generating

- Verify backend server is running (`npm run dev`)
- Check BACKEND_URL in `.env`
- Ensure Algolia credentials are set (if using real API)
- Check network tab in DevTools

### Webview not showing

- Try reloading VSCode
- Check for errors in DevTools
- Ensure all extensions are enabled in Extension Settings

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT © Builder.io

## Support

- 📖 [Documentation](https://www.builder.io/c/docs)
- 🐛 [Report Issues](https://github.com/builder-io/hackathon-synergy/issues)
- 💬 [Community Discord](https://discord.gg/builder)
- 📧 [Email Support](mailto:support@builder.io)

## Roadmap

- [ ] Publish to VSCode Marketplace
- [ ] Offline tech stack detection
- [ ] Project template generation
- [ ] GitHub integration for code review
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native) support
- [ ] Custom hackathon definitions

---

**Built with ❤️ for the global hackathon community** 🌍
2024
