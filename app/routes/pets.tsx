import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Navbar from "../components/navbar";
import PetfinderWidget from "../components/petfinder-widget";
import { getPetfinderWidgetConfig } from "../lib/petfinder-config.server";

export const meta: MetaFunction = () => [
  { title: "Featured Pets | Pet Friends" },
  {
    name: "description",
    content:
      "Browse featured adoptable pets via Petfinder's Custom Pet List Widget.",
  },
];

export async function loader() {
  return json({
    config: getPetfinderWidgetConfig(),
  });
}

export default function PetsPage() {
  const { config } = useLoaderData<typeof loader>();
  const hasOrgs = config.organization.length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-4">
              Featured Pets
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {hasOrgs
                ? "Adoptable pets from our featured Petfinder organizations."
                : "A Petfinder widget feed of adoptable pets. For pets near your town, use location search instead."}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-medium"
            >
              Search by town or zipcode
            </Link>
          </div>

          <PetfinderWidget config={config} />
        </div>
      </main>
    </>
  );
}
