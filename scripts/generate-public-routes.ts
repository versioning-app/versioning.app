#!/usr/bin/env node
// @ts-nocheck
/*
 * Generates a JSON file listing all public marketing routes.
 * Run with: yarn setup:public-routes
 */
const fs = require("fs");
const path = require("path");

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const marketingDir = path.join(
    repoRoot,
    "apps",
    "web",
    "src",
    "app",
    "(marketing)"
  );
  const navigationPath = path.join(
    repoRoot,
    "apps",
    "web",
    "src",
    "config",
    "navigation.ts"
  );

  let routes: string[] = [];
  try {
    const entries = fs.readdirSync(marketingDir, { withFileTypes: true });
    routes = entries
      .filter((e) => e.isDirectory())
      .map((e) => "/" + e.name)
      .sort();
  } catch (err) {
    console.error(
      `[setup:public-routes] Failed to read marketing directory: ${err}`
    );
  }

  // Build TypeScript object string
  const objectEntries = routes
    .map((route) => {
      const key = route
        .substring(1) // remove leading '/'
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .toUpperCase();
      return `  ${key}: '${route}',`;
    })
    .join("\n");

  const publicRoutesBlock = `export const PUBLIC_ROUTES = {\n${objectEntries}\n} as const;`;

  // Read navigation.ts and replace existing PUBLIC_ROUTES block (if any) or insert at top
  let navigationSrc = fs.readFileSync(navigationPath, "utf8");

  if (/export const PUBLIC_ROUTES[\s\S]*?} as const;/.test(navigationSrc)) {
    navigationSrc = navigationSrc.replace(
      /export const PUBLIC_ROUTES[\s\S]*?} as const;/,
      publicRoutesBlock
    );
  } else {
    // Insert after first line (to keep existing exports intact)
    const lines = navigationSrc.split(/\r?\n/);
    lines.splice(0, 0, publicRoutesBlock, "");
    navigationSrc = lines.join("\n");
  }

  fs.writeFileSync(navigationPath, navigationSrc);
  console.log(
    `[setup:public-routes] Wrote ${routes.length} routes into navigation.ts -> PUBLIC_ROUTES`
  );
}

main();
