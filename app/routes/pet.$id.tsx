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
  const hasContact =
    Boolean(animal.organization.email) || Boolean(animal.organization.phone);

  const showPrev = () =>
    setActivePhoto((index) => (index === 0 ? photos.length - 1 : index - 1));
  const showNext = () =>
    setActivePhoto((index) => (index === photos.length - 1 ? 0 : index + 1));

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/30 pb-28 sm:pb-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-300/30 via-secondary-300/20 to-accent-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-soft backdrop-blur transition hover:bg-white hover:text-primary-700"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
            <span className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-soft">
              Available
            </span>
          </div>

          <section className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-large sm:rounded-[2rem]">
                <div className="absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/40 to-transparent" />

                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={animal.name}
                    className="aspect-[4/5] w-full object-cover transition duration-500 sm:aspect-square lg:aspect-[5/6]"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-slate-100 text-slate-400 sm:aspect-square">
                    No photo available
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white sm:left-4"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white sm:right-4"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                      {photos.map((_, index) => (
                        <button
                          key={`dot-${index}`}
                          type="button"
                          aria-label={`Show photo ${index + 1}`}
                          onClick={() => setActivePhoto(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === activePhoto
                              ? "w-6 bg-white"
                              : "w-2 bg-white/55 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute left-4 top-4 z-20 max-w-[70%] sm:left-5 sm:top-5">
                  <p className="truncate text-sm font-medium text-white/90 drop-shadow">
                    {animal.animalType ?? "Pet"} · {animal.breed}
                  </p>
                  <h1 className="mt-1 truncate text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl lg:hidden">
                    {animal.name}
                  </h1>
                </div>
              </div>

              {photos.length > 1 && (
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {photos.map((photo, index) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition sm:h-24 sm:w-24 ${
                        index === activePhoto
                          ? "border-primary-500 shadow-medium"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${animal.name} photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-5 sm:space-y-6">
              <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-large backdrop-blur sm:rounded-[2rem] sm:p-8">
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
                    {animal.animalType ?? "Pet"}
                  </p>
                  <h1 className="mt-2 bg-gradient-to-r from-primary-700 via-secondary-600 to-accent-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    {animal.name}
                  </h1>
                </div>

                <p className="mt-1 text-base text-slate-600 sm:mt-3 sm:text-lg">
                  <span className="font-medium text-slate-800">{animal.breed}</span>
                  {orgLocation ? (
                    <>
                      <span className="mx-2 text-slate-300">·</span>
                      <span>{orgLocation}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-4">
                  <Stat label="Age" value={animal.age} tone="primary" />
                  <Stat label="Size" value={animal.size} tone="secondary" />
                  <Stat
                    label="Gender"
                    value={animal.gender ?? "Unknown"}
                    tone="accent"
                  />
                  <Stat
                    label="Color"
                    value={animal.color ?? "Unknown"}
                    tone="slate"
                  />
                </div>

                <div className="mt-6 sm:mt-8">
                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    About {animal.name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                    {animal.description ||
                      `${animal.name} is a ${animal.age.toLowerCase()} ${animal.breed.toLowerCase()} looking for a loving home. Browse their photos here, then reach out through Petfinder to start the adoption conversation.`}
                  </p>
                </div>

                <div className="mt-7 hidden gap-3 sm:mt-8 sm:flex sm:flex-col">
                  <a
                    href={animal.petfinderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-500 to-secondary-500 px-6 py-4 text-base font-semibold text-white shadow-medium transition hover:-translate-y-0.5 hover:shadow-large"
                  >
                    Contact / Adopt on Petfinder
                    <span aria-hidden="true">→</span>
                  </a>
                  {animal.organization.website && (
                    <a
                      href={animal.organization.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-primary-200 bg-white px-6 py-3.5 text-base font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50"
                    >
                      Visit organization website
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white via-white to-primary-50/60 p-5 shadow-large sm:rounded-[2rem] sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Organization
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {animal.organization.name ??
                        "Petfinder partner organization"}
                    </h2>
                    {(orgLocation || animal.organization.postalCode) && (
                      <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        {[orgLocation, animal.organization.postalCode]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Verified listing
                  </div>
                </div>

                {(hasContact || animal.organization.socialUrls.length > 0) && (
                  <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap">
                    {animal.organization.email && (
                      <a
                        href={`mailto:${animal.organization.email}?subject=Interested in adopting ${animal.name}`}
                        className="inline-flex items-center justify-center rounded-xl bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-primary-200"
                      >
                        {animal.organization.email}
                      </a>
                    )}
                    {animal.organization.phone && (
                      <a
                        href={`tel:${animal.organization.phone}`}
                        className="inline-flex items-center justify-center rounded-xl bg-secondary-100 px-4 py-2.5 text-sm font-medium text-secondary-800 transition hover:bg-secondary-200"
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
                        className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                      >
                        Social
                      </a>
                    ))}
                  </div>
                )}

                <p className="mt-5 text-sm leading-6 text-slate-500">
                  Browse and learn about {animal.name} on Pet Friends. Final
                  adoption requests go through Petfinder so the shelter gets
                  your inquiry directly.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Mobile sticky adopt bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/90 p-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {animal.name}
              </p>
              <p className="truncate text-xs text-slate-500">{animal.breed}</p>
            </div>
            <a
              href={animal.petfinderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-3 text-sm font-semibold text-white shadow-medium"
            >
              Adopt
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "secondary" | "accent" | "slate";
}) {
  const tones = {
    primary: "border-primary-100 bg-primary-50/80 text-primary-800",
    secondary: "border-secondary-100 bg-secondary-50/80 text-secondary-800",
    accent: "border-accent-100 bg-accent-50/80 text-accent-800",
    slate: "border-slate-100 bg-slate-50 text-slate-800",
  };

  return (
    <div
      className={`rounded-2xl border px-3 py-3 text-center shadow-soft sm:px-3.5 sm:py-3.5 ${tones[tone]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-tight sm:text-[15px]">
        {value}
      </p>
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-large">
          <h2 className="text-2xl font-bold text-slate-800">Pet not found</h2>
          <p className="mt-3 text-slate-600">{message}</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-semibold text-white"
          >
            Search for pets
          </Link>
        </div>
      </div>
    </>
  );
}
