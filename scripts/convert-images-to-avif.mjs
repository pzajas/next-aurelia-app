/**
 * One-off / repeatable: convert project PNGs to AVIF and remove sources.
 * Usage: node scripts/convert-images-to-avif.mjs
 */
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");

const IMAGE_DIRS = [
  path.join(ROOT, "public", "assets"),
  path.join(ROOT, "public", "images"),
];

const AVIF_OPTIONS = {
  quality: 55,
  effort: 6,
  chromaSubsampling: "4:2:0",
};

async function convertDir(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    console.warn(`Skip missing dir: ${dir}`);
    return [];
  }

  const converted = [];

  for (const name of entries) {
    if (!name.toLowerCase().endsWith(".png")) continue;

    const input = path.join(dir, name);
    const output = path.join(dir, name.replace(/\.png$/i, ".avif"));

    await sharp(input).avif(AVIF_OPTIONS).toFile(output);

    const inStat = await sharp(input).metadata();
    const outStat = await sharp(output).metadata();
    const inSize = (await import("node:fs/promises")).stat(input).then((s) => s.size);
    const outSize = (await import("node:fs/promises")).stat(output).then((s) => s.size);
    const [inBytes, outBytes] = await Promise.all([inSize, outSize]);

    await unlink(input);
    converted.push({
      file: path.relative(ROOT, output),
      fromKb: Math.round(inBytes / 1024),
      toKb: Math.round(outBytes / 1024),
      width: outStat.width,
      height: outStat.height,
    });
  }

  return converted;
}

const all = [];
for (const dir of IMAGE_DIRS) {
  all.push(...(await convertDir(dir)));
}

if (all.length === 0) {
  console.log("No PNG files found to convert.");
  process.exit(0);
}

console.log(`Converted ${all.length} image(s) to AVIF:\n`);
for (const row of all) {
  const saved = row.fromKb - row.toKb;
  const pct = row.fromKb ? Math.round((saved / row.fromKb) * 100) : 0;
  console.log(
    `  ${row.file}  ${row.fromKb}KB → ${row.toKb}KB (−${pct}%)  ${row.width}×${row.height}`
  );
}
