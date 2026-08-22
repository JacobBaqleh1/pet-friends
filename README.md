# Pet Friends built with Remix

Pet Friends helps people discover adoptable pets near them using Petfinder data.

## How search works

Petfinder retired their public OAuth API in December 2025. Their official **Custom Pet List Widget** only supports a fixed list of organization IDs and sends clicks to Petfinder.com.

This app restores a stay-on-site discovery flow:

1. Geocode the user's zipcode or `"City, ST"` (Zippopotam.us)
2. Query Petfinder's public GraphQL endpoint with a `point` + distance filter
3. Show results and pet detail pages on Pet Friends
4. Send only the final **Contact / Adopt** step to Petfinder (or the org website when available)

The optional `/pets` page still embeds Petfinder's official widget for featured shelters.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) and search by zipcode or town.

## Optional widget config

Generate a widget at [Petfinder's setup page](https://www.petfinder.com/tools-widgets/custom-pet-list/getting-started/) if you want `/pets` to feature specific organizations:

```env
PETFINDER_ORGANIZATION_IDS=["NY123","CA456"]
PETFINDER_LIMIT=12
PETFINDER_HIDE_BREED=true
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
