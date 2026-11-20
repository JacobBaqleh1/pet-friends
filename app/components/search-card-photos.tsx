import { Link } from "@remix-run/react";
import { useState, type MouseEvent } from "react";

type SearchCardPhotosProps = {
  photos: string[];
  name: string;
  breed: string;
  href: string;
};

export default function SearchCardPhotos({
  photos,
  name,
  breed,
  href,
}: SearchCardPhotosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = photos.length > 1;
  const safeIndex = Math.min(activeIndex, Math.max(photos.length - 1, 0));
  const currentPhoto = photos[safeIndex] ?? "";

  const showPrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((index) => Math.max(0, index - 1));
  };

  const showNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((index) => Math.min(photos.length - 1, index + 1));
  };

  if (!currentPhoto) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-slate-100 text-sm text-slate-400">
        No photo available
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-slate-100">
      <Link
        to={href}
        tabIndex={-1}
        className="absolute inset-0 block"
        aria-label={`View ${name}`}
      >
        <img
          src={currentPhoto}
          alt={
            hasMultiple
              ? `${name} - ${breed}, photo ${safeIndex + 1} of ${photos.length}`
              : `${name} - ${breed}`
          }
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={showPrev}
            disabled={safeIndex === 0}
            aria-label={`Previous photo of ${name}`}
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-lg leading-none text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white disabled:cursor-default disabled:opacity-0"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={showNext}
            disabled={safeIndex === photos.length - 1}
            aria-label={`Next photo of ${name}`}
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-lg leading-none text-slate-700 shadow-medium backdrop-blur transition hover:scale-105 hover:bg-white disabled:cursor-default disabled:opacity-0"
          >
            ›
          </button>

          <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
            {photos.map((_, index) => (
              <span
                key={`${name}-dot-${index}`}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all ${
                  index === safeIndex ? "w-3 bg-white" : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
