import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useRouteError,
  useSearchParams,
  isRouteErrorResponse,
} from "@remix-run/react";
import Navbar from "../components/navbar";
import { geocodeLocation } from "../lib/geocode.server";
import { searchAnimalsNearPoint } from "../lib/petfinder-graphql.server";

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

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-4">
              {searchParams.petType === "dog" ? "Dogs" : "Cats"} near{" "}
              {locationLabel}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Found {totalCount.toLocaleString()} adoptable pets within{" "}
              {searchParams.distance} miles
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary-200 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 shadow-soft"
            >
              Search again
            </Link>
          </div>

          {animals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-soft border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No pets found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try a wider distance or a nearby town. Listings come from
                Petfinder partner organizations in that area.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl"
              >
                New search
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-12">
                {animals.map((animal) => (
                  <Link
                    key={animal.id}
                    to={`/pet/${animal.id}`}
                    className="group bg-white rounded-3xl shadow-soft hover:shadow-medium transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={animal.photoUrl ?? ""}
                        alt={`${animal.name} - ${animal.breed}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                        {animal.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{animal.breed}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {animal.locationLabel}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                          {animal.age}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-secondary-100 text-secondary-700">
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
                <div className="flex justify-center items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl disabled:opacity-50"
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
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl disabled:opacity-50"
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-large p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search error</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/dashboard"
            className="w-full inline-flex justify-center items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
