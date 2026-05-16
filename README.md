# Moots Forever Frame

An immersive Moots Bicycle vibe marketing campaign site focused on Bentonville, Austin, and Oklahoma City.

## Live Site

- https://mootsframe.com/

## Repository

This repository contains the source code for the Moots Forever Frame website.

## Tech Stack

- Vite
- React
- TypeScript
- GitHub Pages

## Deployment

This site deploys automatically with GitHub Actions when changes are pushed to the `main` branch.

GitHub Pages publishes the built frontend artifact from the repository workflow.

## Notes

- The production site is configured for the custom domain `mootsframe.com`.
- Static-site safeguards are enabled for GitHub Pages deployment.
- Interactive map features gracefully fall back when optional frontend environment variables are not present.

## Development

Install dependencies:

```bash
pnpm install
```

Run local development:

```bash
pnpm dev
```

Build the frontend:

```bash
pnpm exec vite build
```

## License

MIT
