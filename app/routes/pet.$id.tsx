import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { useState } from "react";
import Navbar from "../components/navbar";
import { getAnimalDetail } from "../lib/petfinder-graphql.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.animal
      ? `${data.animal.name} | Pet Friends`
      : "Pet Details | Pet Friends",
  },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) {
    throw new Response("Pet ID is required", { status: 400 });
  }

  const animal = await getAnimalDetail(id);
  return json({ animal });
}

export default function PetDetails() {
  const { animal } = useLoaderData<typeof loader>();
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = animal.photoUrls.length
    ? animal.photoUrls
    : animal.photoUrl
      ? [animal.photoUrl]
      : [];
  const currentPhoto = photos[activePhoto] ?? photos[0];
  const orgLocation = [animal.organization.city, animal.organization.state]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50"
            >
              ← Back to results
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-10">
            <div>
              <div className="bg-white rounded-3xl shadow-large overflow-hidden border border-gray-100">
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={animal.name}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                    No photo available
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      className={`rounded-xl overflow-hidden border-2 ${
                        index === activePhoto
                          ? "border-primary-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${animal.name} photo ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-large border border-gray-100 p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 mb-2">
                {animal.animalType ?? "Pet"}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {animal.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {animal.breed}
                {orgLocation ? ` · ${orgLocation}` : ""}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <Stat label="Age" value={animal.age} />
                <Stat label="Size" value={animal.size} />
                <Stat label="Gender" value={animal.gender ?? "Unknown"} />
                <Stat label="Color" value={animal.color ?? "Unknown"} />
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">
                  {animal.description ||
                    `${animal.name} is a ${animal.age.toLowerCase()} ${animal.breed.toLowerCase()} looking for a loving home. Reach out through Petfinder to learn more about adopting.`}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={animal.petfinderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                >
                  Contact / Adopt on Petfinder
                </a>
                {animal.organization.website && (
                  <a
                    href={animal.organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-white border-2 border-primary-200 text-primary-700 font-semibold rounded-xl hover:bg-primary-50"
                  >
                    Visit organization website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-large border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Organization
            </h2>
            <p className="text-lg font-semibold text-primary-600 mb-4">
              {animal.organization.name ?? "Petfinder partner organization"}
            </p>
            {orgLocation && (
              <p className="text-gray-600 mb-2">{orgLocation}</p>
            )}
            {animal.organization.postalCode && (
              <p className="text-gray-500 mb-4">
                {animal.organization.postalCode}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {animal.organization.email && (
                <a
                  href={`mailto:${animal.organization.email}?subject=Interested in adopting ${animal.name}`}
                  className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium"
                >
                  {animal.organization.email}
                </a>
              )}
              {animal.organization.phone && (
                <a
                  href={`tel:${animal.organization.phone}`}
                  className="px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium"
                >
                  {animal.organization.phone}
                </a>
              )}
              {animal.organization.socialUrls.slice(0, 2).map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  Social link
                </a>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Pet details stay on Pet Friends. Final adoption inquiries go through
              Petfinder or the organization so shelters get your request.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pet not found</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/dashboard"
            className="inline-flex justify-center items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Search for pets
          </Link>
        </div>
      </div>
    </>
  );
}
