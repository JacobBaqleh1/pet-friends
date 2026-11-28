export default function MarketingHome() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        StudioDeck
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
        Portfolio builder for artists
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600">
        Open-source control plane and Astro template. Connect your GitHub and
        Cloudflare — you keep the keys. Dashboard, OAuth, and provisioning come
        in later phases.
      </p>
    </main>
  );
}
