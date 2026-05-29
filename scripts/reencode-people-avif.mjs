/**
 * Re-encode atelier portrait AVIFs from PNG masters (higher quality than bulk convert).
 * Usage: node scripts/reencode-people-avif.mjs
 */
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGES = path.join(ROOT, "public", "images");

const PEOPLE_PNG = [
  "founder-ok",
  "founder-margaux",
  "founder-elias",
  "founder-amelie",
];

const AVIF_OPTIONS = {
  quality: 92,
  effort: 7,
  chromaSubsampling: "4:4:4",
};

for (const base of PEOPLE_PNG) {
  const input = path.join(IMAGES, `${base}.png`);
  const output = path.join(IMAGES, `${base}.avif`);
  const meta = await sharp(input).metadata();
  await sharp(input).avif(AVIF_OPTIONS).toFile(output);
  const { size } = await import("node:fs/promises").then((fs) =>
    fs.stat(output)
  );
  console.log(
    `${base}.avif  ${meta.width}×${meta.height}  ${Math.round(size / 1024)}KB`
  );
}
