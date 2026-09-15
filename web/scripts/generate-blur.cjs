/**
 * Generates the low-quality placeholders used by <Img>.
 *
 * Next.js can show a blurred stand-in while the real image loads, but for
 * images referenced by path (rather than statically imported) it needs an
 * explicit `blurDataURL`. Rather than hand-write those, this walks
 * public/images and emits a path -> data-URI map.
 *
 * Each placeholder is a 14px-wide JPEG, normally 300-600 bytes, so the whole
 * manifest is a few KB and ships inside the HTML. Run it whenever images are
 * added — it is wired into `npm run build` via the prebuild script.
 *
 *   npm run blur
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const OUT = path.join(__dirname, "..", "src", "lib", "blur-data.json");

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return EXT.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
  });
}

(async () => {
  const files = walk(IMAGES_DIR).sort();
  const map = {};

  for (const file of files) {
    // Key by the public URL the components actually reference.
    const key =
      "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");

    const buf = await sharp(fs.readFileSync(file))
      .resize(14, null, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toBuffer();

    map[key] = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(map, null, 2));

  const bytes = fs.statSync(OUT).size;
  console.log(`placeholders : ${files.length}`);
  console.log(`manifest     : ${Math.round(bytes / 1024)} KB`);
  console.log(`average      : ${Math.round(bytes / files.length)} bytes each`);
})();
