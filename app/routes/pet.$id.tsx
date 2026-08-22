import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
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

/** Soften ALL CAPS blocks Petfinder often returns, while keeping normal sentences. */
function softenAllCaps(chunk: string) {
  const letters = chunk.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 12) return chunk;

  const upperRatio =
    letters.replace(/[^A-Z]/g, "").length / Math.max(letters.length, 1);
  if (upperRatio < 0.7) return chunk;

  const urls: string[] = [];
  const withPlaceholders = chunk.replace(/https?:\/\/\S+/gi, (url) => {
    urls.push(url);
    return `__URL_${urls.length - 1}__`;
  });

  const softened = withPlaceholders
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());

  return softened.replace(/__URL_(\d+)__/g, (_, index) => urls[Number(index)]);
}

function formatDescription(text: string) {
  return text
    .split(/(\n+)/)
    .map((part) => (/^\n+$/.test(part) ? part : softenAllCaps(part)))
    .join("");
}

export default function PetDetails() {
  const { animal } = useLoaderData<typeof loader>();
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = animal.photoUrls.length
    ? animal.photoUrls
    : animal.photoUrl
      ? [animal.photoUrl]
      : [];
  const orgLocation = [animal.organization.city, animal.organization.state]
    .filter(Boolean)
    .join(", ");
  const hasContact =
    Boolean(animal.organization.email) || Boolean(animal.organization.phone);
  const aboutText = animal.description?.trim()
    ? formatDescription(animal.description.trim())
    : `${animal.name} is a ${animal.age.toLowerCase()} ${animal.breed.toLowerCase()} looking for a loving home. Browse their photos here, then reach out through Petfinder to start the adoption conversation.`;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/30 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(100vw,36rem)] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-300/30 via-secondary-300/20 to-accent-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-soft backdrop-blur transition hover:bg-white hover:text-primary-700 sm:px-4"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
            <span className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-soft">
              Available
            </span>
          </div>

          <section className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Gallery — photos get their own space, no text overlays */}
            <PhotoGallery
              photos={photos}
              name={animal.name}
              activePhoto={activePhoto}
              onPhotoChange={setActivePhoto}
            />

            {/* Details */}
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-large backdrop-blur sm:rounded-[2rem] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600 sm:text-sm sm:tracking-[0.18em]">
                  {animal.animalType ?? "Pet"}
                </p>
                <h1 className="mt-1.5 bg-gradient-to-r from-primary-700 via-secondary-600 to-accent-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:mt-2 sm:text-4xl lg:text-5xl">
                  {animal.name}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-lg sm:leading-7">
                  <span className="font-medium text-slate-800">
                    {animal.breed}
                  </span>
                  {orgLocation ? (
                    <>
                      <span className="mx-1.5 text-slate-300 sm:mx-2">·</span>
                      <span className="break-words">{orgLocation}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-4 sm:gap-3">
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

                <div className="mt-5 sm:mt-8">
                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    About {animal.name}
                  </h2>
                  <p className="mt-2.5 whitespace-pre-line break-words text-[15px] leading-7 text-slate-600 sm:mt-3 sm:text-base sm:leading-8">
                    {aboutText}
                  </p>
                </div>

                <div className="mt-6 hidden gap-3 sm:mt-8 sm:flex sm:flex-col">
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

              <div className="rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white via-white to-primary-50/60 p-4 shadow-large sm:rounded-[2rem] sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Organization
                    </p>
                    <h2 className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                      {animal.organization.name ??
                        "Petfinder partner organization"}
                    </h2>
                    {(orgLocation || animal.organization.postalCode) && (
                      <p className="mt-2 break-words text-sm text-slate-600 sm:text-base">
                        {[orgLocation, animal.organization.postalCode]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex w-fit shrink-0 items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Verified listing
                  </div>
                </div>

                {(hasContact || animal.organization.socialUrls.length > 0) && (
                  <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap">
                    {animal.organization.email && (
                      <a
                        href={`mailto:${animal.organization.email}?subject=Interested in adopting ${animal.name}`}
                        className="inline-flex max-w-full items-center justify-center break-all rounded-xl bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-primary-200"
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

                <p className="mt-4 text-sm leading-6 text-slate-500 sm:mt-5">
                  Browse and learn about {animal.name} on Pet Friends. Final
                  adoption requests go through Petfinder so the shelter gets
                  your inquiry directly.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Mobile sticky adopt bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur sm:hidden">
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
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-3 text-sm font-semibold text-white shadow-medium"
            >
              Adopt
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function PhotoGallery({
  photos,
  name,
  activePhoto,
  onPhotoChange,
}: {
  photos: string[];
  name: string;
  activePhoto: number;
  onPhotoChange: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const syncFromScroll = useRef(false);
  const hasPhotos = photos.length > 0;
  const hasMultiple = photos.length > 1;

  // Keep the snap carousel aligned when thumbnails / arrows change the index.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || syncFromScroll.current) {
      syncFromScroll.current = false;
      return;
    }
    const slide = scroller.children[activePhoto] as HTMLElement | undefined;
    if (!slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, [activePhoto]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) return;
    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    const clamped = Math.max(0, Math.min(photos.length - 1, next));
    if (clamped !== activePhoto) {
      syncFromScroll.current = true;
      onPhotoChange(clamped);
    }
  };

  const showPrev = () =>
    onPhotoChange(activePhoto === 0 ? photos.length - 1 : activePhoto - 1);
  const showNext = () =>
    onPhotoChange(
      activePhoto === photos.length - 1 ? 0 : activePhoto + 1
    );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-slate-100 shadow-large sm:rounded-[2rem]">
        {hasPhotos ? (
          <div className="relative">
            {/* Native swipe carousel on touch devices */}
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:aspect-square lg:aspect-[5/6] [&::-webkit-scrollbar]:hidden"
              aria-label={`${name} photo gallery`}
              role="region"
            >
              {photos.map((photo, index) => (
                <div
                  key={photo}
                  className="flex h-full w-full shrink-0 snap-center snap-always items-center justify-center bg-slate-100"
                >
                  <img
                    src={photo}
                    alt={`${name} photo ${index + 1} of ${photos.length}`}
                    draggable={false}
                    className="h-full w-full object-contain select-none"
                  />
                </div>
              ))}
            </div>

            {/* Desktop / tablet arrows only — mobile uses finger swipe */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white sm:flex"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white sm:flex"
                >
                  ›
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-slate-100 text-slate-400 sm:aspect-square">
            No photo available
          </div>
        )}
      </div>

      {hasMultiple && (
        <>
          <div className="flex items-center justify-between gap-3 px-0.5">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              Photo {activePhoto + 1} of {photos.length}
              <span className="ml-2 text-slate-400 sm:hidden">· swipe</span>
            </p>
            <div className="flex gap-1.5">
              {photos.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === activePhoto}
                  onClick={() => onPhotoChange(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activePhoto
                      ? "w-5 bg-primary-500"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((photo, index) => (
              <button
                key={`thumb-${photo}`}
                type="button"
                onClick={() => onPhotoChange(index)}
                aria-label={`View photo ${index + 1}`}
                aria-current={index === activePhoto}
                className={`relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:h-24 sm:w-24 sm:rounded-2xl ${
                  index === activePhoto
                    ? "border-primary-500 shadow-medium"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
      className={`min-w-0 rounded-2xl border px-2.5 py-3 text-center shadow-soft sm:px-3.5 sm:py-3.5 ${tones[tone]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70 sm:text-[11px] sm:tracking-[0.14em]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold leading-snug sm:text-[15px] sm:leading-tight">
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
