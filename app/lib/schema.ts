import { z } from "zod";

/**
 * content.json schema for StudioDeck portfolios.
 * Item URL = `${media.publicBaseUrl}/${item.key}` — never put secrets here.
 */
export const socialSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const mediaItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["image", "video"]),
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

export const contentSchema = z.object({
  version: z.literal(1),
  site: z.object({
    title: z.string().min(1),
    bio: z.string(),
    socials: z.array(socialSchema),
  }),
  media: z.object({
    publicBaseUrl: z.string(),
    items: z.array(mediaItemSchema),
  }),
});

export type Social = z.infer<typeof socialSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
export type Content = z.infer<typeof contentSchema>;

/** Resolve a media item's public URL from content.json fields. */
export function mediaItemUrl(
  publicBaseUrl: string,
  key: string,
): string {
  const base = publicBaseUrl.replace(/\/$/, "");
  const path = key.replace(/^\//, "");
  return `${base}/${path}`;
}
