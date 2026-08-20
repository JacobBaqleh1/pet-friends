# Pet Friends built with Remix

Pet Friends helps people discover adoptable pets from Petfinder partner organizations.

## Petfinder Widget Setup

Petfinder retired their public API in December 2025. This app now embeds Petfinder's **Custom Pet List Widget**.

1. Sign in at [Petfinder's widget setup page](https://www.petfinder.com/tools-widgets/custom-pet-list/getting-started/)
2. Configure your organizations, animal types, and display options
3. Click **Generate Pet List Code** and copy the `organization` value from the snippet
4. Copy `.env.example` to `.env` and set `PETFINDER_ORGANIZATION_IDS`
5. Add the same environment variable in your Vercel project settings for production

Example:

```env
PETFINDER_ORGANIZATION_IDS=["NY123","CA456"]
```

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your Petfinder organization IDs
npm run dev
```

Open [http://localhost:3000/pets](http://localhost:3000/pets) to browse adoptable pets.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
