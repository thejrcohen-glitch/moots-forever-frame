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
- Manus (production hosting)

## Deployment

Production is hosted on Manus (`mootsframe.com`).
GitHub remains the source of truth for code, pull requests, history, and security workflows.
GitHub Pages publishes a static artifact from repository workflows for non-production hosting scenarios.

## Notes

- DNS for `mootsframe.com` is managed in GoDaddy.
- Transactional email delivery uses Resend.
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
