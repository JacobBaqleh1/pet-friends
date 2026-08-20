export interface PetfinderWidgetConfig {
  scriptUrl: string;
  apiBase: string;
  s3Url: string;
  petfinderUrl: string;
  organization: string[];
  status: string;
  limit: number;
  hideBreed: string;
  petListTitle: string;
  type: string[];
  age: string[];
}

function parseJsonArray(value: string | undefined, fallback: string[] = []): string[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return fallback;
  }
}

export function getPetfinderWidgetConfig(): PetfinderWidgetConfig {
  return {
    scriptUrl:
      process.env.PETFINDER_SCRIPT_URL ??
      "https://www.petfinder.com/pet-scroller.bundle.js",
    apiBase:
      process.env.PETFINDER_API_BASE ?? "https://psl.petfinder.com/graphql",
    s3Url:
      process.env.PETFINDER_S3_URL ??
      "https://dbw3zep4prcju.cloudfront.net/",
    petfinderUrl: process.env.PETFINDER_URL ?? "https://www.petfinder.com/",
    organization: parseJsonArray(process.env.PETFINDER_ORGANIZATION_IDS),
    status: process.env.PETFINDER_STATUS ?? "adoptable",
    limit: Number(process.env.PETFINDER_LIMIT ?? "24"),
    hideBreed: process.env.PETFINDER_HIDE_BREED ?? "false",
    petListTitle: process.env.PETFINDER_LIST_TITLE ?? "",
    type: parseJsonArray(process.env.PETFINDER_TYPES),
    age: parseJsonArray(process.env.PETFINDER_AGES),
  };
}

export function isPetfinderWidgetConfigured(config: PetfinderWidgetConfig): boolean {
  return config.organization.length > 0;
}
