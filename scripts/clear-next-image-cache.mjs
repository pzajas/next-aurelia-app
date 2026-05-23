import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageCache = path.join(root, ".next", "cache", "images");

if (!fs.existsSync(imageCache)) {
  console.log("No Next.js image cache found (.next/cache/images).");
  process.exit(0);
}

fs.rmSync(imageCache, { recursive: true, force: true });
console.log("Cleared Next.js image cache.");
