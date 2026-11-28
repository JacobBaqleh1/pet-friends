import contentJson from "../../data/content.json";

export type Social = {
  label: string;
  url: string;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  key: string;
  title: string;
  description?: string;
  order: number;
  width?: number;
  height?: number;
};

export type Content = {
  version: 1;
  site: {
    title: string;
    bio: string;
    socials: Social[];
  };
  media: {
    publicBaseUrl: string;
    items: MediaItem[];
  };
};

export const content = contentJson as Content;

export function mediaItemUrl(publicBaseUrl: string, key: string): string {
  const base = publicBaseUrl.replace(/\/$/, "");
  const path = key.replace(/^\//, "");
  return `${base}/${path}`;
}

export function sortedMedia(items: MediaItem[]): MediaItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}
