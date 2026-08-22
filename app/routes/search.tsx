import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useRouteError,
  useSearchParams,
  isRouteErrorResponse,
} from "@remix-run/react";
import Navbar from "../components/navbar";
import { geocodeLocation } from "../lib/geocode.server";
import {
  searchAnimalsNearPoint,
  type AnimalSearchFilters,
} from "../lib/petfinder-graphql.server";

const AGE_OPTIONS = ["Baby", "Young", "Adult", "Senior"] as const;
const SEX_OPTIONS = ["Female", "Male"] as const;
const SIZE_OPTIONS = ["Small", "Medium", "Large", "Extra Large"] as const;
const COAT_OPTIONS = ["Short", "Medium", "Long"] as const;

const CAT_COLORS = [
  "Black",
  "White",
  "Orange / Red",
  "Gray / Blue / Silver",
  "Brown / Chocolate",
  "Buff / Tan / Fawn",
  "Calico",
  "Tortoiseshell",
  "Dilute Calico",
  "Dilute Tortoiseshell",
  "Tabby (Brown / Chocolate)",
  "Tabby (Gray / Blue / Silver)",
  "Tabby (Orange / Red)",
  "Tabby (Buff / Tan / Fawn)",
  "Lilac Point",
  "Seal Point",
  "Flame Point",
] as const;

const DOG_COLORS = [
  "Black",
  "White",
  "Brown / Chocolate",
  "Gray / Blue / Silver",
  "Buff / Tan / Fawn",
  "Red / Golden / Orange / Chestnut",
  "Yellow / Tan / Blond / Fawn",
  "Tricolor (Tan/Brown & Black & White)",
  "Bicolor",
  "Brindle",
  "Merle (Blue)",
  "Merle (Red)",
] as const;

function readOptional(param: string | null) {
  const value = param?.trim();
  return value ? value : null;
}

function readBooleanFlag(param: string | null): boolean | null {
  if (param === "true") return true;
  if (param === "false") return false;
  return null;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data
      ? `Pets near ${data.locationLabel} | Pet Friends`
      : "Search Results | Pet Friends",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const location =
    url.searchParams.get("location") ||
    url.searchParams.get("zipcode") ||
    "";
  const petType = url.searchParams.get("pet") || "dog";
  const page = Number(url.searchParams.get("page") || "1");
  const distance = Number(url.searchParams.get("distance") || "25");
  const limit = Number(process.env.PETFINDER_LIMIT ?? "12");

  const filters: AnimalSearchFilters = {
    age: readOptional(url.searchParams.get("age")),
    sex: readOptional(url.searchParams.get("sex")),
    size: readOptional(url.searchParams.get("size")),
    color: readOptional(url.searchParams.get("color")),
    coatLength: readOptional(url.searchParams.get("coat")),
    houseTrained: readBooleanFlag(url.searchParams.get("house_trained")),
    specialNeeds: readBooleanFlag(url.searchParams.get("special_needs")),
    declawed:
      petType.toLowerCase() === "cat"
        ? readBooleanFlag(url.searchParams.get("declawed"))
        : null,
  };

  if (!location) {
    throw new Response("Please enter a zipcode or town to search.", {
      status: 400,
    });
  }

  if (!["dog", "cat"].includes(petType.toLowerCase())) {
    throw new Response("Please choose dogs or cats.", { status: 400 });
  }

  const geo = await geocodeLocation(location);
  const results = await searchAnimalsNearPoint({
    latitude: geo.latitude,
    longitude: geo.longitude,
    distanceMiles: Number.isFinite(distance) ? distance : 25,
    petType: petType.toLowerCase(),
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 12,
    filters,
  });

  return json({
    animals: results.animals,
    totalCount: results.totalCount,
    totalPages: results.totalPages,
    page: results.page,
    locationLabel: geo.label,
    searchParams: {
      location,
      petType: petType.toLowerCase(),
      distance: String(Number.isFinite(distance) ? distance : 25),
      age: filters.age ?? "",
      sex: filters.sex ?? "",
      size: filters.size ?? "",
      color: filters.color ?? "",
      coat: filters.coatLength ?? "",
      houseTrained: filters.houseTrained == null ? "" : String(filters.houseTrained),
      specialNeeds:
        filters.specialNeeds == null ? "" : String(filters.specialNeeds),
      declawed: filters.declawed == null ? "" : String(filters.declawed),
    },
  });
}

export default function SearchResults() {
  const {
    animals,
    totalCount,
    totalPages,
    page,
    locationLabel,
    searchParams,
  } = useLoaderData<typeof loader>();
  const [params, setSearchParams] = useSearchParams();
  const isCat = searchParams.petType === "cat";
  const colorOptions = isCat ? CAT_COLORS : DOG_COLORS;

  const activeFilterCount = [
    searchParams.age,
    searchParams.sex,
    searchParams.size,
    searchParams.color,
    searchParams.coat,
    searchParams.houseTrained,
    searchParams.specialNeeds,
    searchParams.declawed,
  ].filter(Boolean).length;

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(params);
    for (const key of [
      "age",
      "sex",
      "size",
      "color",
      "coat",
      "house_trained",
      "special_needs",
      "declawed",
      "page",
    ]) {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
              {isCat ? "Cats" : "Dogs"} near {locationLabel}
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl">
              Found {totalCount.toLocaleString()} adoptable pets within{" "}
              {searchParams.distance} miles
              {activeFilterCount > 0
                ? ` · ${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied`
                : ""}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-xl border-2 border-primary-200 bg-white px-6 py-3 font-semibold text-primary-600 shadow-soft transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
            >
              Search again
            </Link>
          </div>

          {/* Filters */}
          <Form
            method="get"
            className="mb-8 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur sm:p-6"
          >
            <input type="hidden" name="location" value={searchParams.location} />
            <input type="hidden" name="pet" value={searchParams.petType} />
            <input type="hidden" name="distance" value={searchParams.distance} />
            <input type="hidden" name="page" value="1" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {isCat ? "Filter cats" : "Filter pets"}
                </h2>
                <p className="text-sm text-slate-500">
                  Narrow results to match what you need
                </p>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  Age
                </span>
                <select
                  name="age"
                  defaultValue={searchParams.age}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any age</option>
                  {AGE_OPTIONS.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  Sex
                </span>
                <select
                  name="sex"
                  defaultValue={searchParams.sex}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any</option>
                  {SEX_OPTIONS.map((sex) => (
                    <option key={sex} value={sex}>
                      {sex}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  Size
                </span>
                <select
                  name="size"
                  defaultValue={searchParams.size}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any size</option>
                  {SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  Color
                </span>
                <select
                  name="color"
                  defaultValue={searchParams.color}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any color</option>
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>

              {isCat && (
                <label className="block text-sm">
                  <span className="mb-1.5 block font-semibold text-slate-700">
                    Coat length
                  </span>
                  <select
                    name="coat"
                    defaultValue={searchParams.coat}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  >
                    <option value="">Any coat</option>
                    {COAT_OPTIONS.map((coat) => (
                      <option key={coat} value={coat}>
                        {coat}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  House trained
                </span>
                <select
                  name="house_trained"
                  defaultValue={searchParams.houseTrained}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-700">
                  Special needs
                </span>
                <select
                  name="special_needs"
                  defaultValue={searchParams.specialNeeds}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Any</option>
                  <option value="false">No special needs</option>
                  <option value="true">Special needs OK</option>
                </select>
              </label>

              {isCat && (
                <label className="block text-sm">
                  <span className="mb-1.5 block font-semibold text-slate-700">
                    Declawed
                  </span>
                  <select
                    name="declawed"
                    defaultValue={searchParams.declawed}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  >
                    <option value="">Any</option>
                    <option value="false">Not declawed</option>
                    <option value="true">Declawed</option>
                  </select>
                </label>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 text-sm font-semibold text-white shadow-medium transition hover:from-primary-600 hover:to-secondary-600"
              >
                Apply filters
              </button>
            </div>
          </Form>

          {animals.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white py-20 text-center shadow-soft">
              <h3 className="mb-4 text-2xl font-bold text-gray-800">
                No pets found
              </h3>
              <p className="mx-auto mb-8 max-w-md text-gray-600">
                Try clearing filters, widening the distance, or searching a
                nearby town.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center rounded-xl border-2 border-primary-200 bg-white px-6 py-3 font-semibold text-primary-600"
                  >
                    Clear filters
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-semibold text-white"
                >
                  New search
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {animals.map((animal) => (
                  <Link
                    key={animal.id}
                    to={`/pet/${animal.id}`}
                    className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-medium"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={animal.photoUrl ?? ""}
                        alt={`${animal.name} - ${animal.breed}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-200 group-hover:text-primary-600">
                        {animal.name}
                      </h3>
                      <p className="mb-1 text-sm text-gray-600">
                        {animal.breed}
                      </p>
                      <p className="mb-4 text-sm text-gray-500">
                        {animal.locationLabel}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-700">
                          {animal.age}
                        </span>
                        <span className="rounded-full bg-secondary-100 px-3 py-1 text-secondary-700">
                          {animal.size}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-medium text-primary-600">
                        Meet {animal.name} →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? typeof error.data === "string"
      ? error.data
      : error.statusText
    : error instanceof Error
      ? error.message
      : "Unexpected error";

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-large">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Search error</h2>
          <p className="mb-6 text-gray-600">{message}</p>
          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-semibold text-white"
          >
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
