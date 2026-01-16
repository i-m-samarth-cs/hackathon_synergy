# Vercel Deployment Guide

This guide will help you deploy the Hackathon Synergy Agent to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Algolia credentials (already configured in the code)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (for first deployment)
   - Project name: `hackathon-synergy-agent` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings? **No**

4. **Set Environment Variables**:
   ```bash
   vercel env add ALGOLIA_APP_ID
   vercel env add ALGOLIA_SEARCH_API_KEY
   vercel env add ALGOLIA_WRITE_API_KEY
   ```
   
   Or set them in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `ALGOLIA_APP_ID` = `LWEP9U8JDM`
     - `ALGOLIA_SEARCH_API_KEY` = `59b171a143341ee2c87e5f02564486c8`
     - `ALGOLIA_WRITE_API_KEY` = `37a25d6ea19e1f0d41b40e7d2d367506`

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to Git**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the settings from `vercel.json`

3. **Configure Environment Variables**:
   - In project settings → Environment Variables
   - Add the Algolia credentials:
     - `ALGOLIA_APP_ID`
     - `ALGOLIA_SEARCH_API_KEY`
     - `ALGOLIA_WRITE_API_KEY`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

## Project Structure for Vercel

```
.
├── api/
│   └── index.ts          # Vercel serverless function (wraps Express)
├── client/               # React frontend
├── server/               # Express backend (used by api/index.ts)
├── shared/               # Shared types
├── vercel.json           # Vercel configuration
└── .vercelignore         # Files to ignore during deployment
```

## How It Works

1. **Frontend**: Built with Vite and served as static files from `dist/spa`
2. **Backend**: Express server wrapped in `serverless-http` and deployed as a Vercel serverless function
3. **Routing**: 
   - API routes (`/api/*`) → `api/index.ts` serverless function
   - All other routes → `index.html` (SPA routing)

## Build Process

Vercel will:
1. Run `pnpm install` to install dependencies
2. Run `pnpm build:client` to build the React frontend
3. Deploy the `dist/spa` folder as static files
4. Deploy `api/index.ts` as a serverless function

## Environment Variables

Make sure to set these in Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `ALGOLIA_APP_ID` | `LWEP9U8JDM` | Algolia Application ID |
| `ALGOLIA_SEARCH_API_KEY` | `59b171a143341ee2c87e5f02564486c8` | Algolia Search API Key |
| `ALGOLIA_WRITE_API_KEY` | `37a25d6ea19e1f0d41b40e7d2d367506` | Algolia Write API Key (optional) |

## Custom Domain

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that `pnpm` is available (Vercel auto-detects package manager)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### API Routes Not Working

- Verify `api/index.ts` exists and exports default handler
- Check that `serverless-http` is installed
- Review serverless function logs in Vercel dashboard

### SPA Routing Issues

- Ensure `vercel.json` has the catch-all rewrite rule
- Check that `dist/spa/index.html` is generated correctly

### Algolia Errors

- Verify environment variables are set correctly
- Check Algolia API key permissions
- Review function logs for detailed error messages

## Post-Deployment

After successful deployment:
1. Test the API endpoints: `https://your-project.vercel.app/api/ping`
2. Test project generation: Use the frontend form
3. Monitor function logs in Vercel dashboard
4. Set up custom domain (optional)

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. For other branches, it creates preview deployments.

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
