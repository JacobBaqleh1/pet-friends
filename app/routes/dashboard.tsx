import { Form, Outlet, useRouteError, useNavigation } from "@remix-run/react";
import Navbar from "../components/navbar";

export default function Component() {
  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting" && navigation.formAction === "/search";
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-secondary-500/10 to-accent-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-6">
                Find Your Perfect Companion
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Discover amazing pets from trusted organizations in your area.
                Every search brings you closer to your new best friend.
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">          <Form
          method="get"
          action="/search"
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-large border border-white/20 p-8"
        >
          <div className="space-y-6">
            {/* Location Input */}
            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                📍 Your Location
              </label>
              <input
                type="text"
                name="zipcode"
                placeholder="Enter your zipcode..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white/50"
              />
            </div>

            {/* Pet Type Selection */}
            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-4">
                🐾 What type of companion are you looking for?
              </span>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="pet"
                    value="dog"
                    className="sr-only peer"
                  />
                  <div className="flex items-center justify-center p-4 rounded-xl border-2 border-gray-200 peer-checked:border-primary-400 peer-checked:bg-primary-50 hover:border-primary-300 transition-all duration-200 bg-white/50">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🐕</div>
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
                      <div className="text-2xl mb-2">🐱</div>
                      <div className="font-medium text-gray-700">Cats</div>
                    </div>
                  </div>
                </label>
              </div>            </div>

            {/* Distance Selection */}
            <div className="mb-6">
              <label htmlFor="distance" className="block text-sm font-semibold text-gray-700 mb-3">
                🌍 Search Distance
              </label>
              <select
                id="distance"
                name="distance"
                defaultValue="25"
                className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200 px-4 bg-white/50 backdrop-blur-sm"
              >
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
                <option value="500">Anywhere</option>
              </select>
            </div>            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-4 rounded-xl shadow-medium hover:shadow-large hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-200 text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center">
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Searching for pets...
                  </>
                ) : (
                  <>
                    Find My Perfect Match
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
          <input type="hidden" name="page" value="1" />
        </Form>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-soft">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Organizations</h3>
              <p className="text-gray-600">All our partner shelters are verified and trusted</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-soft">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfect Matches</h3>
              <p className="text-gray-600">Find pets that match your lifestyle and preferences</p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-soft">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ongoing Support</h3>
              <p className="text-gray-600">Get help throughout your adoption journey</p>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMessage = error instanceof Error && error.message;
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-large p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 14c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but an unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">Error: {errorMessage}</p>
          </div>
        )}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
