export type GeoPoint = {
  latitude: number;
  longitude: number;
  label: string;
};

function isZipcode(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

function parseCityState(value: string): { city: string; state: string } | null {
  const match = value
    .trim()
    .match(/^(.+?),\s*([A-Za-z]{2})$/);
  if (!match) return null;
  return { city: match[1].trim(), state: match[2].trim().toUpperCase() };
}

async function geocodeZip(zip: string): Promise<GeoPoint> {
  const postal = zip.slice(0, 5);
  const response = await fetch(`https://api.zippopotam.us/us/${postal}`);
  if (!response.ok) {
    throw new Response("We couldn't find that zipcode. Please try another.", {
      status: 400,
    });
  }

  const data = (await response.json()) as {
    places?: Array<{
      "place name": string;
      latitude: string;
      longitude: string;
      "state abbreviation": string;
    }>;
  };

  const place = data.places?.[0];
  if (!place) {
    throw new Response("We couldn't find that zipcode. Please try another.", {
      status: 400,
    });
  }

  return {
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    label: `${place["place name"]}, ${place["state abbreviation"]} ${postal}`,
  };
}

async function geocodeCityState(city: string, state: string): Promise<GeoPoint> {
  const response = await fetch(
    `https://api.zippopotam.us/us/${encodeURIComponent(state)}/${encodeURIComponent(city)}`
  );
  if (!response.ok) {
    throw new Response(
      'We couldn\'t find that town. Try a 5-digit zipcode or "City, ST" (e.g. Beverly Hills, CA).',
      { status: 400 }
    );
  }

  const data = (await response.json()) as {
    places?: Array<{
      "place name": string;
      latitude: string;
      longitude: string;
      "post code": string;
    }>;
    "state abbreviation"?: string;
  };

  const place = data.places?.[0];
  if (!place) {
    throw new Response(
      'We couldn\'t find that town. Try a 5-digit zipcode or "City, ST".',
      { status: 400 }
    );
  }

  return {
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    label: `${place["place name"]}, ${data["state abbreviation"] ?? state}`,
  };
}

/**
 * Resolve a user-entered location string to coordinates.
 * Accepts a 5-digit US zipcode or "City, ST".
 */
export async function geocodeLocation(location: string): Promise<GeoPoint> {
  const trimmed = location.trim();
  if (!trimmed) {
    throw new Response("Please enter a zipcode or town.", { status: 400 });
  }

  if (isZipcode(trimmed)) {
    return geocodeZip(trimmed);
  }

  const cityState = parseCityState(trimmed);
  if (cityState) {
    return geocodeCityState(cityState.city, cityState.state);
  }

  throw new Response(
    'Enter a 5-digit zipcode or "City, ST" (for example: 90210 or Austin, TX).',
    { status: 400 }
  );
}
