import NextImage, { type ImageProps } from "next/image";
import blurData from "@/lib/blur-data.json";

const BLUR: Record<string, string> = blurData;

/**
 * next/image with the low-quality placeholder wired up automatically.
 *
 * Next can render a blurred stand-in while the full image downloads, but for
 * images referenced by path it needs an explicit `blurDataURL`. Those are
 * pre-generated into src/lib/blur-data.json by scripts/generate-blur.cjs, so
 * every image on the site gets a placeholder without anyone remembering to
 * pass one.
 *
 * Falls back to a plain image if the path has no entry — a missing
 * placeholder should never be the reason a picture fails to render.
 */
export function Img({ src, alt, ...rest }: ImageProps) {
  const placeholder = typeof src === "string" ? BLUR[src] : undefined;

  return (
    <NextImage
      src={src}
      alt={alt}
      {...(placeholder
        ? { placeholder: "blur" as const, blurDataURL: placeholder }
        : {})}
      {...rest}
    />
  );
}
