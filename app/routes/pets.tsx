import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Navbar from "../components/navbar";
import PetfinderWidget from "../components/petfinder-widget";
import {
  getPetfinderWidgetConfig,
  isPetfinderWidgetConfigured,
} from "../lib/petfinder-config.server";

export const meta: MetaFunction = () => [
  { title: "Browse Pets | Pet Friends" },
  {
    name: "description",
    content:
      "Browse adoptable pets from Petfinder partner organizations near you.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const config = getPetfinderWidgetConfig();
  return json({
    config,
    isConfigured: isPetfinderWidgetConfigured(config),
    widgetSetupUrl:
      "https://www.petfinder.com/tools-widgets/custom-pet-list/getting-started/",
  });
}

export default function PetsPage() {
  const { config, isConfigured, widgetSetupUrl } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-4">
              Find Your Perfect Companion
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse adoptable pets from trusted Petfinder organizations. Use
              the filters below to narrow your search.
            </p>
          </div>

          {!isConfigured ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-large border border-amber-200 p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl" aria-hidden="true">
                  ⚙️
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Widget setup required
              </h2>
              <p className="text-gray-600 mb-6">
                Pet Friends now uses Petfinder&apos;s Custom Pet List Widget.
                Generate your widget code from Petfinder, then set{" "}
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  PETFINDER_ORGANIZATION_IDS
                </code>{" "}
                in your environment (for example{" "}
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  [&quot;NY123&quot;]
                </code>
                ).
              </p>
              <a
                href={widgetSetupUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-medium"
              >
                Open Petfinder Widget Setup
              </a>
              <p className="text-sm text-gray-500 mt-6">
                See <code>.env.example</code> for all supported configuration
                options.
              </p>
            </div>
          ) : (
            <PetfinderWidget config={config} />
          )}

          <div className="text-center mt-10">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary-200 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 shadow-soft"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
