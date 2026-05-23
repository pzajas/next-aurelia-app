import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

if (!fs.existsSync(nextDir)) {
  console.log("No .next directory to reset.");
  process.exit(0);
}

fs.rmSync(nextDir, { recursive: true, force: true });
console.log("Removed .next — next dev will rebuild from scratch.");
