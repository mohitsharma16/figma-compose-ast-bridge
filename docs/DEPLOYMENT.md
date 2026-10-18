# Deployment Guide — Cloudflare Pages & GitHub Pages

## Option 1: Cloudflare Pages (Recommended)
1. Push this repository to GitHub.
2. Open **Cloudflare Dashboard → Workers & Pages → Create Application → Pages → Connect to Git**.
3. Configure build settings:
   - **Root directory**: `web`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20`

## Option 2: GitHub Pages
1. Push this repository to GitHub.
2. Go to **Repository Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow builds `web/` and deploys the static bundle automatically.
