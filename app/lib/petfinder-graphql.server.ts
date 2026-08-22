const DEFAULT_API_BASE = "https://psl.petfinder.com/graphql";
const DEFAULT_S3_URL = "https://dbw3zep4prcju.cloudfront.net/";
const DEFAULT_PETFINDER_URL = "https://www.petfinder.com/";

const SEARCH_ANIMAL_QUERY = `query SearchAnimal($pagination: PaginationInfoInput!, $filters: AnimalSearchFiltersInput!) {
  searchAnimal(
    pagination: $pagination
    sort: { field: "animal_type", order: "desc" }
    filters: $filters
  ) {
    totalCount
    animals {
      animalId
      animalName
      primaryPhotoId
      physical {
        size { label }
        breed { primary mixed }
        age { label value }
      }
      _contact {
        address { city state }
      }
      publicUrl { url }
    }
  }
}`;

export type PetfinderAnimal = {
  id: string;
  name: string;
  photoUrl: string | null;
  breed: string;
  age: string;
  size: string;
  city: string | null;
  state: string | null;
  locationLabel: string;
  petfinderUrl: string;
};

export type PetSearchResult = {
  animals: PetfinderAnimal[];
  totalCount: number;
  totalPages: number;
  page: number;
};

type GraphQLAnimal = {
  animalId: string;
  animalName: string;
  primaryPhotoId: string | null;
  physical?: {
    size?: { label?: string | null } | null;
    breed?: { primary?: string | null; mixed?: boolean | null } | null;
    age?: { label?: string | null; value?: string | null } | null;
  } | null;
  _contact?: {
    address?: { city?: string | null; state?: string | null } | null;
  } | null;
  publicUrl?: { url?: string | null } | null;
};

function getApiBase() {
  return process.env.PETFINDER_API_BASE ?? DEFAULT_API_BASE;
}

function getS3Url() {
  return process.env.PETFINDER_S3_URL ?? DEFAULT_S3_URL;
}

function getPetfinderUrl() {
  return process.env.PETFINDER_URL ?? DEFAULT_PETFINDER_URL;
}

function locationFromPublicUrl(path: string | null | undefined): {
  city: string | null;
  state: string | null;
} {
  if (!path) return { city: null, state: null };
  // e.g. dog/name-id/ca/whittier/org-slug
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 4) {
    const state = parts[2]?.toUpperCase() ?? null;
    const citySlug = parts[3] ?? null;
    const city = citySlug
      ? citySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : null;
    return { city, state };
  }
  return { city: null, state: null };
}

function mapAnimal(animal: GraphQLAnimal): PetfinderAnimal {
  const fromUrl = locationFromPublicUrl(animal.publicUrl?.url);
  const city = animal._contact?.address?.city ?? fromUrl.city;
  const state = animal._contact?.address?.state ?? fromUrl.state;
  const relative = animal.publicUrl?.url ?? "";
  const absolute = relative.startsWith("http")
    ? relative
    : `${getPetfinderUrl().replace(/\/$/, "")}/${relative.replace(/^\//, "")}`;

  return {
    id: animal.animalId,
    name: animal.animalName,
    photoUrl: animal.primaryPhotoId
      ? `${getS3Url().replace(/\/?$/, "/")}${animal.primaryPhotoId}`
      : null,
    breed: animal.physical?.breed?.primary
      ? `${animal.physical.breed.primary}${animal.physical.breed.mixed ? " Mix" : ""}`
      : "Breed unknown",
    age: animal.physical?.age?.label ?? "Unknown",
    size: animal.physical?.size?.label ?? "Unknown",
    city,
    state,
    locationLabel: [city, state].filter(Boolean).join(", ") || "Location unavailable",
    petfinderUrl: absolute,
  };
}

export async function searchAnimalsNearPoint(options: {
  latitude: number;
  longitude: number;
  distanceMiles: number;
  petType?: string | null;
  page?: number;
  limit?: number;
}): Promise<PetSearchResult> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(48, Math.max(1, options.limit ?? 12));
  const distance = `${options.distanceMiles}mi`;

  const filters: Record<string, unknown> = {
    adoption_status: "adoptable",
    point: {
      lat: options.latitude,
      lon: options.longitude,
      distance,
    },
  };

  if (options.petType) {
    filters.animal_type = [options.petType.toLowerCase()];
  }

  const response = await fetch(getApiBase(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://www.petfinder.com",
      Referer: "https://www.petfinder.com/",
    },
    body: JSON.stringify({
      query: SEARCH_ANIMAL_QUERY,
      variables: {
        pagination: {
          fromPage: page - 1,
          pageSize: limit,
        },
        filters,
      },
    }),
  });

  if (!response.ok) {
    throw new Response("Petfinder search is temporarily unavailable.", {
      status: 502,
    });
  }

  const payload = (await response.json()) as {
    data?: {
      searchAnimal?: {
        totalCount?: number;
        animals?: GraphQLAnimal[];
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    console.error("Petfinder GraphQL errors:", payload.errors);
    throw new Response("Petfinder search failed. Please try again.", {
      status: 502,
    });
  }

  const totalCount = payload.data?.searchAnimal?.totalCount ?? 0;
  const animals = (payload.data?.searchAnimal?.animals ?? [])
    .map(mapAnimal)
    .filter((animal) => animal.photoUrl);

  return {
    animals,
    totalCount,
    totalPages: Math.max(1, Math.min(99, Math.ceil(totalCount / limit))),
    page,
  };
}
