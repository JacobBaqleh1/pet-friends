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

const ANIMAL_DETAIL_QUERY = `query AnimalDetail($id: String!) {
  animal(id: $id) {
    animalId
    animalName
    description
    animalType
    physical {
      size { label }
      breed { primary mixed }
      age { label value }
      sex
      color { primary }
    }
    _media {
      mediaId
      mediaIndex
      mimeType
    }
    _organization {
      organizationId
      organizationName
    }
    _contact {
      email
      phone
      address { city state postalCode }
    }
    publicUrl { url }
  }
}`;

const ORGANIZATION_QUERY = `query Organization($id: String!, $idType: String!) {
  organization(id: $id, idType: $idType) {
    organizationId
    organizationName
    website
    socialUrl
    contacts { email phone }
    locations {
      address { city state postalCode }
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

export type PetfinderAnimalDetail = PetfinderAnimal & {
  description: string | null;
  animalType: string | null;
  gender: string | null;
  color: string | null;
  photoUrls: string[];
  organization: {
    id: string | null;
    name: string | null;
    website: string | null;
    socialUrls: string[];
    email: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
  };
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
  primaryPhotoId?: string | null;
  description?: string | null;
  animalType?: string | null;
  physical?: {
    size?: { label?: string | null } | null;
    breed?: { primary?: string | null; mixed?: boolean | null } | null;
    age?: { label?: string | null; value?: string | null } | null;
    sex?: string | null;
    color?: { primary?: string | null } | null;
  } | null;
  _media?: Array<{
    mediaId?: string | null;
    mediaIndex?: string | number | null;
    mimeType?: string | null;
  }> | null;
  _organization?: {
    organizationId?: string | null;
    organizationName?: string | null;
  } | null;
  _contact?: {
    email?: string | null;
    phone?: string | null;
    address?: {
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
    } | null;
  } | null;
  publicUrl?: { url?: string | null } | null;
};

type GraphQLOrganization = {
  organizationId?: string | null;
  organizationName?: string | null;
  website?: string | null;
  socialUrl?: string[] | null;
  contacts?: Array<{ email?: string | null; phone?: string | null }> | null;
  locations?: Array<{
    address?: {
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
    } | null;
  }> | null;
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

async function petfinderGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(getApiBase(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://www.petfinder.com",
      Referer: "https://www.petfinder.com/",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Response("Petfinder is temporarily unavailable.", { status: 502 });
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length || !payload.data) {
    console.error("Petfinder GraphQL errors:", payload.errors);
    throw new Response("Petfinder request failed. Please try again.", {
      status: 502,
    });
  }

  return payload.data;
}

function toAbsolutePetfinderUrl(path: string | null | undefined): string {
  const relative = path ?? "";
  if (!relative) return getPetfinderUrl();
  if (relative.startsWith("http")) return relative;
  const base = getPetfinderUrl().replace(/\/$/, "");
  const cleaned = relative.replace(/^\//, "");
  return `${base}/${cleaned}`;
}

function photoUrlFor(animalId: string, mediaId: string): string {
  return `${getS3Url().replace(/\/?$/, "/")}animal/${animalId}/image/${mediaId}.jpg`;
}

function mediaPhotoUrls(animal: GraphQLAnimal): string[] {
  const media = [...(animal._media ?? [])]
    .filter((item) => item.mediaId)
    .sort((a, b) => Number(a.mediaIndex ?? 99) - Number(b.mediaIndex ?? 99));

  const fromMedia = media.map((item) =>
    photoUrlFor(animal.animalId, String(item.mediaId))
  );

  if (fromMedia.length > 0) return fromMedia;

  if (animal.primaryPhotoId) {
    if (animal.primaryPhotoId.includes("/")) {
      return [`${getS3Url().replace(/\/?$/, "/")}${animal.primaryPhotoId}`];
    }
    return [photoUrlFor(animal.animalId, animal.primaryPhotoId)];
  }

  return [];
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
  const photos = mediaPhotoUrls(animal);
  const petfinderPath = animal.publicUrl?.url;
  const petfinderUrl = toAbsolutePetfinderUrl(
    petfinderPath ? `${petfinderPath.replace(/\/$/, "")}/details` : undefined
  );

  return {
    id: animal.animalId,
    name: animal.animalName,
    photoUrl: photos[0] ?? null,
    breed: animal.physical?.breed?.primary
      ? `${animal.physical.breed.primary}${animal.physical.breed.mixed ? " Mix" : ""}`
      : "Breed unknown",
    age: animal.physical?.age?.label ?? "Unknown",
    size: animal.physical?.size?.label ?? "Unknown",
    city,
    state,
    locationLabel:
      [city, state].filter(Boolean).join(", ") || "Location unavailable",
    petfinderUrl,
  };
}

function firstContactValue(
  contacts: Array<{ email?: string | null; phone?: string | null }> | null | undefined,
  key: "email" | "phone"
): string | null {
  for (const contact of contacts ?? []) {
    const value = contact[key];
    if (value) return value;
  }
  return null;
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

  const data = await petfinderGraphql<{
    searchAnimal?: {
      totalCount?: number;
      animals?: GraphQLAnimal[];
    };
  }>(SEARCH_ANIMAL_QUERY, {
    pagination: {
      fromPage: page - 1,
      pageSize: limit,
    },
    filters,
  });

  const totalCount = data.searchAnimal?.totalCount ?? 0;
  const animals = (data.searchAnimal?.animals ?? [])
    .map(mapAnimal)
    .filter((animal) => animal.photoUrl);

  return {
    animals,
    totalCount,
    totalPages: Math.max(1, Math.min(99, Math.ceil(totalCount / limit))),
    page,
  };
}

export async function getAnimalDetail(id: string): Promise<PetfinderAnimalDetail> {
  const data = await petfinderGraphql<{ animal?: GraphQLAnimal | null }>(
    ANIMAL_DETAIL_QUERY,
    { id }
  );

  const animal = data.animal;
  if (!animal?.animalId) {
    throw new Response("Pet not found", { status: 404 });
  }

  const mapped = mapAnimal(animal);
  const photos = mediaPhotoUrls(animal);

  let organization: PetfinderAnimalDetail["organization"] = {
    id: animal._organization?.organizationId ?? null,
    name: animal._organization?.organizationName ?? null,
    website: null,
    socialUrls: [],
    email: animal._contact?.email ?? null,
    phone: animal._contact?.phone ?? null,
    city: animal._contact?.address?.city ?? mapped.city,
    state: animal._contact?.address?.state ?? mapped.state,
    postalCode: animal._contact?.address?.postalCode ?? null,
  };

  if (animal._organization?.organizationId) {
    try {
      const orgData = await petfinderGraphql<{
        organization?: GraphQLOrganization | null;
      }>(ORGANIZATION_QUERY, {
        id: animal._organization.organizationId,
        idType: "organization_id",
      });

      const org = orgData.organization;
      if (org) {
        const location = org.locations?.[0]?.address;
        organization = {
          id: org.organizationId ?? organization.id,
          name: org.organizationName ?? organization.name,
          website: org.website ?? null,
          socialUrls: org.socialUrl ?? [],
          email: firstContactValue(org.contacts, "email") ?? organization.email,
          phone: firstContactValue(org.contacts, "phone") ?? organization.phone,
          city: location?.city ?? organization.city,
          state: location?.state ?? organization.state,
          postalCode: location?.postalCode ?? organization.postalCode,
        };
      }
    } catch (error) {
      console.error("Failed to load organization details", error);
    }
  }

  return {
    ...mapped,
    photoUrl: photos[0] ?? mapped.photoUrl,
    photoUrls: photos,
    description: animal.description ?? null,
    animalType: animal.animalType ?? null,
    gender: animal.physical?.sex ?? null,
    color: animal.physical?.color?.primary ?? null,
    organization,
  };
}
