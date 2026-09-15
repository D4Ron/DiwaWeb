# Extracted media — and a problem with it

`original/` holds all 35 files from the live WordPress media library
(`diwaindustries.tg/wp-json/wp/v2/media`), downloaded unmodified on
5 September 2026. Total 5.4 MB. Nothing was cropped, recompressed or renamed
here — this is the provenance archive.

The working copies used by the site live in `../web/public/images/`, renamed
and grouped by role.

## None of it is photography of the Blitta plant

This matters more than it might sound, so here is the evidence.

**Filenames read as image prompts, not photographs.** The library contains
`CO2-blue-cylider-with-co2-written-on-it.-.jpg`,
`CO2-cylinder-in-a-factory.-2-varieties.jpg`,
`Butane-or-LPG-Liquefied-Petroleum-Gas-Cylinders.jpg`,
`Several-butane-cylinders.jpg` and `blackman-factory.jpg`. Those are
descriptions of a desired image, typed by someone, not names a camera or a
photographer produces.

**The dimensions are generator defaults.** Eleven files are exactly
1120 × 1120, three are exactly 2048 × 2048, and `clininder.jpg` is
1472 × 832. Perfect squares at those sizes are characteristic output of
image generators, not of cameras.

**No camera metadata on any file.** Not one of the 35 carries an EXIF Make or
Model tag. WordPress strips EXIF when it resizes, but these are the original
uploads.

**The images themselves.** In `manu.jpg` the operator's fingers merge into one
another where they meet the valve, the pipework does not connect to anything,
and an orange light streak crosses the frame from no visible source. In
`factory.jpg` the cylinder hardware is not a coherent mechanism. These are
generation artefacts.

## What this means

Diwa has three ISO certifications, audits by TotalEnergies and Oryx, WLPGA
membership, a real plant at Blitta and a real production line. The site
currently illustrates all of that with synthetic images of a factory that does
not exist. For a manufacturer whose entire pitch is verifiable safety
compliance, that is a credibility risk — and it is the single highest-value
thing to fix in the whole rework. No amount of layout or motion work
compensates for it.

## Recommendation

**Commission a half-day photography shoot at Blitta.** The shot list a site
like this needs is short:

1. The production line running — wide, showing scale
2. A cylinder mid-manufacture on the line
3. The requalification bay, with cylinders in racks
4. The CO₂ plant
5. Two or three portraits of named staff, for the careers page testimonials
   (which currently pair real quotes with generated faces)
6. The building exterior with signage, for the contact page
7. Finished cylinders palletised, ready to ship

That is one photographer for one day, and it would replace every synthetic
image on the site with something no competitor can copy.

**If a shoot is genuinely not possible**, the honest fallback is to stop
depicting the plant at all: build the pages around typography, the production
figures, the certification marks and the partner logos, and use photography
only where it is real. A site with no factory photograph reads as reserved. A
site with a fake one reads as untrustworthy once someone notices — and the
buyers Diwa is courting are exactly the people who notice.

Generating replacement images was considered and is not recommended: it would
swap one set of synthetic factory pictures for another, leaving the
credibility problem exactly where it is.

## One real photograph — and its rights caveat

`web/public/images/facility/blitta-plant-visit-2021.jpg` is the exception to
everything above. It is a **genuine photograph of the actual Blitta
production hall**, taken during Minister Kodjo ADEDZE's visit on
9 February 2021 — real machinery, real hard hats, real people.

Source: the Togolese Ministry of Trade's own coverage,
`commerce.gouv.tg/wp-content/uploads/2021/02/IMG_8615-1024x683.jpg`
(resized to 1600px wide, quality 82). The same frame also appears on
Togo First.

It is used as the About page hero, in the About page's plant section with a
visible credit line, and on the news article about that visit.

**Before this goes live, confirm the rights.** The photograph is of Diwa's
facility but was published by the ministry; copyright sits with them or their
photographer, not automatically with Diwa. Two clean ways to resolve it:

1. Diwa's own comms team almost certainly has originals from that day — they
   hosted the visit. Swap in an original and the question disappears.
2. Or ask the ministry for permission to reuse. Government press photos of
   public events are often freely reusable with credit, which is why the
   caption already names the ministry.

Other public sources checked and rejected: the icilome article no longer
hosts its images, Togo Réveil was unreachable, and the only other real image
found — a still from Télé 7's coverage of the 19th Lomé trade fair — is a
low-resolution screengrab with a broadcaster's logo burned into it.

## Files excluded from the working set

Kept in `original/` for completeness, not copied into `web/public/`:

| File | Reason |
| --- | --- |
| `mt-sample-background.jpg` | Divi theme sample asset |
| `Erreur-404.jpg`, `Erreur-404-1-scaled.png` | Error-page artwork |
| `dd.jpeg` | Unused, unreferenced |
| `logo-1.png` | Byte-identical duplicate of `logo.png` |
| `cropped-fav.jpg` | WordPress-generated favicon crop |
| `cylinders.jpeg`, `cylinders_.jpg` | Near-duplicates of better copies |
| `gaz-cyinder-e1742378902172.jpeg` | WordPress edit artefact |

## Accessibility note

Not one of the 35 files has alt text set in WordPress. Alt text is written
fresh in the new components rather than carried over, and decorative images
are given `alt=""` deliberately.
