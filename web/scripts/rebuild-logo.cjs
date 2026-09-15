/**
 * Rebuilds the Diwa logo assets from the original on diwaindustries.tg.
 *
 * The source (1020x637 PNG) ships with no alpha channel — the white
 * background is baked into the pixels. That is why the footer had to filter
 * it to pure white to hide the box. This script:
 *
 *   1. Removes the white background properly, recovering per-pixel alpha
 *      from the anti-aliased edges rather than hard-thresholding them.
 *   2. Trims the leftover transparent margin so the mark fills its box.
 *   3. Emits a colour version for light grounds and a white version for the
 *      navy footer, plus a square favicon source cropped to the droplet.
 *
 *   node scripts/rebuild-logo.cjs
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
const OUT = path.join(__dirname, "..", "public", "images", "brand");

/**
 * Un-composite a logo that was flattened onto white.
 *
 * For a pixel that was `src` over white at coverage `a`:
 *   observed = src*a + 255*(1-a)
 * The darkest channel gives the coverage, and the colour is recovered by
 * reversing the blend. This keeps anti-aliased edges smooth instead of
 * leaving the jagged fringe a simple threshold would.
 */
function removeWhite(data, width, height) {
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const alpha = 255 - Math.min(r, g, b);

    if (alpha <= 2) {
      out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      continue;
    }

    const k = 255 / alpha;
    out[o] = Math.max(0, Math.min(255, Math.round((r - (255 - alpha)) * k)));
    out[o + 1] = Math.max(0, Math.min(255, Math.round((g - (255 - alpha)) * k)));
    out[o + 2] = Math.max(0, Math.min(255, Math.round((b - (255 - alpha)) * k)));
    out[o + 3] = alpha;
  }
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const source = fs.readFileSync(SRC);
  const meta = await sharp(source).metadata();
  const { data, info } = await sharp(source)
    .toColorspace("srgb")
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = removeWhite(data, info.width, info.height);

  const base = sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).trim({ threshold: 1 });

  const trimmed = await base.png().toBuffer();
  const trimMeta = await sharp(trimmed).metadata();

  // Colour version, 2x the largest rendered size (44px tall) for retina.
  await sharp(trimmed)
    .resize({ height: 220, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "diwa-logo.png"));

  // White version for the navy footer: flatten every visible pixel to white
  // and keep the alpha, so the shape survives without the brightness hack.
  const { data: td, info: ti } = await sharp(trimmed)
    .resize({ height: 220, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const white = Buffer.alloc(td.length);
  for (let i = 0; i < td.length; i += 4) {
    white[i] = white[i + 1] = white[i + 2] = 255;
    white[i + 3] = td[i + 3];
  }
  await sharp(white, {
    raw: { width: ti.width, height: ti.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "diwa-logo-white.png"));

  // Favicon source: the droplet alone, square, on the brand indigo.
  await sharp(trimmed)
    .extract({
      left: 0,
      top: 0,
      width: Math.round(trimMeta.height * 0.72),
      height: trimMeta.height,
    })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "diwa-mark.png"));

  const size = (f) =>
    Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + " KB";

  console.log(`source          : ${meta.width}x${meta.height}  alpha=${meta.hasAlpha}`);
  console.log(`after trim      : ${trimMeta.width}x${trimMeta.height}  alpha=true`);
  console.log(`diwa-logo.png   : ${size("diwa-logo.png")}`);
  console.log(`diwa-logo-white : ${size("diwa-logo-white.png")}`);
  console.log(`diwa-mark.png   : ${size("diwa-mark.png")}`);
})();
