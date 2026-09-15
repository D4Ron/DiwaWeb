/**
 * One-off: install the one genuine photograph of the Blitta plant found in
 * public sources — the Togolese Ministry of Commerce's coverage of Minister
 * Kodjo ADEDZE's visit on 9 February 2021.
 *
 * Source: commerce.gouv.tg/wp-content/uploads/2021/02/IMG_8615-1024x683.jpg
 *
 * This is a real press photograph of the real production hall, unlike the
 * rest of the library. See assets/README.md for the rights caveat.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(
  "C:/Users/Ron4e/AppData/Local/Temp/claude",
  "C--Users-Ron4e-Desktop-Work-Intern-Kapi-Consult-Diwa-Industries",
  "ef9e86c2-f767-4ef0-99e0-144861a5ba53/scratchpad/press/gouv-visite.jpg",
);

const OUT_DIR = path.join(__dirname, "..", "public", "images", "facility");
const OUT = path.join(OUT_DIR, "blitta-plant-visit-2021.jpg");

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const source = fs.readFileSync(SRC);
  const meta = await sharp(source).metadata();

  const buf = await sharp(source)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(OUT, buf);
  console.log(`source : ${meta.width}x${meta.height}`);
  console.log(`output : ${path.basename(OUT)}  ${Math.round(buf.length / 1024)} KB`);
})();
