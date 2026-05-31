# Homepage Image Emergency Fix — 2026-05-31

Issue: `client/src/pages/Home.tsx` still contains CloudFront/AI homepage imagery.

Required replacements:

```ts
const HERO_IMG = "https://moots.com/cdn/shop/files/RouttRSLStanley01.jpg";
const BADGE_IMG = "https://moots.com/cdn/shop/files/Untitled-8-01.jpg?v=1775151937&width=750";
```

Territory image values:

```ts
// Bentonville
img: "https://cdn.shopify.com/s/files/1/0049/1612/files/Screenshot2025-10-16at3.32.05PM.png?v=1760650375",

// Austin
img: "https://moots.com/cdn/shop/files/VaMootsRCSAPEX01.jpg",

// Oklahoma City
img: "https://cdn.shopify.com/s/files/1/0049/1612/files/YBB_UDH.jpg?v=1762966604",
```

Do not add Playwright, crawlers, `package.json` changes, or `pnpm-lock.yaml` changes.

Do not touch PR #27 or PR #55.
