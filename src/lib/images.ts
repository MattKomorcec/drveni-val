import type { ImageMetadata } from 'astro';

/**
 * Content images live in src/assets/images so Astro can optimize them (WebP, responsive sizes).
 * They are referenced by their old public path, e.g. '/images/hero_image.png', which keeps
 * products.json and component code readable.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{png,jpg,jpeg}', {
  eager: true,
});

const images: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.replace('/src/assets', ''), mod.default]),
);

export function resolveImage(src: string): ImageMetadata {
  const image = images[src];
  if (!image) throw new Error(`Image not found in src/assets: ${src}`);
  return image;
}
