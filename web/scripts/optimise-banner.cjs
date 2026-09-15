/**
 * One-off: the Bons Plans banner came off kapiconsult.tg at 10.5 MB, which is
 * far past anything a hero background needs. Resize and recompress in place.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "..",
  "public",
  "images",
  "bons-plans",
  "banner_articles.jpg",
);

(async () => {
  const before = fs.statSync(file).size;
  const meta = await sharp(file).metadata();

  // Read into memory first: sharp keeps a handle on the source file, and
  // writing back to the same path while it is open fails on Windows.
  const source = fs.readFileSync(file);

  const buf = await sharp(source)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 68, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(file, buf);

  console.log(`source : ${meta.width}x${meta.height}  ${Math.round(before / 1024)} KB`);
  console.log(`output : 1920 wide          ${Math.round(buf.length / 1024)} KB`);
  console.log(`saved  : ${Math.round((1 - buf.length / before) * 100)}%`);
})();
