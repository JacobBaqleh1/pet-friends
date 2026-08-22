import { Form, useRouteError, Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "../components/navbar";

export const meta: MetaFunction = () => [
  { title: "Search Pets Near You | Pet Friends" },
  {
    name: "description",
    content:
      "Enter your zipcode or town to find adoptable pets from nearby Petfinder organizations.",
  },
];

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-secondary-500/10 to-accent-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-6">
                Find Pets Near Your Town
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Enter a zipcode or city to discover adoptable pets from shelters
                and rescues near you.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <Form
            method="get"
            action="/search"
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-large border border-white/20 p-8"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Your location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  required
                  placeholder='Zipcode or "City, ST" — e.g. 90210 or Austin, TX'
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white/50"
                />
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-4">
                  What are you looking for?
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="pet"
                      value="dog"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center p-4 rounded-xl border-2 border-gray-200 peer-checked:border-primary-400 peer-checked:bg-primary-50 hover:border-primary-300 transition-all duration-200 bg-white/50">
                      <div className="text-center">
                        <div className="text-2xl mb-2" aria-hidden="true">
                          🐕
                        </div>
                        <div className="font-medium text-gray-700">Dogs</div>
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="pet"
                      value="cat"
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center p-4 rounded-xl border-2 border-gray-200 peer-checked:border-secondary-400 peer-checked:bg-secondary-50 hover:border-secondary-300 transition-all duration-200 bg-white/50">
                      <div className="text-center">
                        <div className="text-2xl mb-2" aria-hidden="true">
                          🐱
                        </div>
                        <div className="font-medium text-gray-700">Cats</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Search distance
                </label>
                <select
                  id="distance"
                  name="distance"
                  defaultValue="25"
                  className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200 px-4 bg-white/50 backdrop-blur-sm"
                >
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                  <option value="100">Within 100 miles</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-4 rounded-xl shadow-medium hover:shadow-large hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
              >
                Find pets near me
              </button>
            </div>
            <input type="hidden" name="page" value="1" />
          </Form>
        </div>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-large p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h2>
          {errorMessage && (
            <p className="text-sm text-red-700 mb-6">{errorMessage}</p>
          )}
          <Link
            to="/dashboard"
            className="inline-flex justify-center items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
