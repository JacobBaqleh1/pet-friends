import { Form, useSearchParams, useNavigation } from "@remix-run/react";
import { useState } from "react";

export default function Filter({ breeds = [] }) {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const isFiltering = navigation.state === "submitting";

  // Get current filter values
  const currentAge = searchParams.get("age") || "";
  const currentBreed = searchParams.get("breed") || "";
  const currentGender = searchParams.get("gender") || "";
  const currentDistance = searchParams.get("distance") || "25";
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newSearchParams = new URLSearchParams();

    // Preserve essential search parameters
    const pet = searchParams.get("pet");
    const zipcode = searchParams.get("zipcode");
    if (pet) newSearchParams.set("pet", pet);
    if (zipcode) newSearchParams.set("zipcode", zipcode);

    // Update search params with form data
    const age = formData.get("age");
    const breed = formData.get("breed");
    const gender = formData.get("gender");
    const distance = formData.get("distance");

    if (age) newSearchParams.set("age", age);
    if (breed) newSearchParams.set("breed", breed);
    if (gender) newSearchParams.set("gender", gender);
    if (distance) newSearchParams.set("distance", distance);
    else newSearchParams.set("distance", "25"); // Default fallback

    // Reset to page 1 when filtering
    newSearchParams.set("page", "1");

    // Navigate with new search params
    window.location.search = newSearchParams.toString();
  };
  const clearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Preserve essential search parameters
    const pet = searchParams.get("pet");
    const zipcode = searchParams.get("zipcode");

    // Clear all search params and rebuild with essentials
    const clearedParams = new URLSearchParams();
    if (pet) clearedParams.set("pet", pet);
    if (zipcode) clearedParams.set("zipcode", zipcode);
    clearedParams.set("distance", "25"); // Reset to default
    clearedParams.set("page", "1");

    window.location.search = clearedParams.toString();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-medium border border-gray-100 overflow-hidden">
        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer select-none items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 lg:hidden hover:from-primary-100 hover:to-secondary-100 transition-colors duration-200"
        >
          <span className="text-sm font-semibold text-gray-700">🎯 Filter Options</span>
          <svg
            className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Filter Form */}
        <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
          <Form onSubmit={handleSubmit} className="border-t border-gray-100 lg:border-t-0">
            {/* Distance Filter */}
            <fieldset className="w-full">
              <legend className="block w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
                🌍 Search Distance
              </legend>
              <div className="px-6 py-4">
                <select
                  name="distance"
                  defaultValue={currentDistance}
                  className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200 px-4 bg-white"
                >
                  <option value="5">Within 5 miles</option>
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                  <option value="100">Within 100 miles</option>
                  <option value="500">Anywhere</option>
                </select>
              </div>
            </fieldset>

            {/* Age Filter */}
            <fieldset className="w-full border-t border-gray-100">
              <legend className="block w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
                🎂 Age Range
              </legend>
              <div className="px-6 py-4">
                <select
                  name="age"
                  defaultValue={currentAge}
                  className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 transition-colors duration-200 px-4 bg-white"
                >
                  <option value="">Any Age</option>
                  <option value="Baby">Baby</option>
                  <option value="Young">Young</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </fieldset>

            {/* Gender Filter */}
            <fieldset className="w-full border-t border-gray-100">
              <legend className="block w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
                ⚥ Gender
              </legend>
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      defaultChecked={currentGender === "Male"}
                      className="h-5 w-5 border-2 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-colors duration-200"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                      ♂️ Male
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      defaultChecked={currentGender === "Female"}
                      className="h-5 w-5 border-2 border-gray-300 text-secondary-600 focus:ring-secondary-500 focus:ring-2 transition-colors duration-200"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-secondary-600 transition-colors duration-200">
                      ♀️ Female
                    </span>
                  </label>
                </div>
                <label className="flex items-center cursor-pointer group mt-3">
                  <input
                    type="radio"
                    name="gender"
                    value=""
                    defaultChecked={currentGender === ""}
                    className="h-5 w-5 border-2 border-gray-300 text-accent-600 focus:ring-accent-500 focus:ring-2 transition-colors duration-200"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-accent-600 transition-colors duration-200">
                    Either
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Breed Filter */}
            {breeds.length > 0 && (
              <fieldset className="w-full border-t border-gray-100">
                <legend className="block w-full bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
                  🐾 Breed
                </legend>
                <div className="px-6 py-4">
                  <select
                    name="breed"
                    defaultValue={currentBreed}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors duration-200 px-4 bg-white"
                  >
                    <option value="">Any Breed</option>
                    {breeds.map((breed) => (
                      <option key={breed.name} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-100 p-6 space-y-3">              <button
              type="submit"
              disabled={isFiltering}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-medium hover:shadow-large disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isFiltering ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Filtering...
                </span>
              ) : (
                "🔍 Apply Filters"
              )}
            </button><button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearFilters();
              }}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
                🗑️ Clear All
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
