import {
    Link,
    useLoaderData,
    useRouteError,
    useSearchParams,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Navbar from "../components/navbar";
import Filter from "../components/filter";

interface Animal {
    id: number;
    name: string;
    photos: string[];
    primary_photo_cropped: {
        small: string;
    };
    breeds: {
        primary: string;
    };
    age: string;
    size: string;
    gender: string;
    contact: {
        address: {
            city: string;
            state: string;
        };
    };
}

export async function loader({ request }: LoaderFunctionArgs) {
    let { searchParams } = new URL(request.url);
    let petType = searchParams.get("pet");
    let zipcode = searchParams.get("zipcode");
    let pageNumber = searchParams.get("page") || "1";

    // Filter parameters
    let age = searchParams.get("age");
    let breed = searchParams.get("breed");
    let gender = searchParams.get("gender");
    let distance = searchParams.get("distance") || "25"; // Default 25 miles

    if (!petType || !zipcode) {
        throw new Response("Missing search parameters", { status: 400 });
    }

    // Fetch the API token
    const tokenResponse = await fetch(
        "https://api.petfinder.com/v2/oauth2/token",
        {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
                client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
            }),
        }
    );
    const tokenData = await tokenResponse.json();

    // Build API URL with filters
    let apiUrl = `https://api.petfinder.com/v2/animals?type=${petType}&location=${zipcode}&page=${pageNumber}&distance=${distance}`;

    if (age) apiUrl += `&age=${age}`;
    if (breed) apiUrl += `&breed=${breed}`;
    if (gender) apiUrl += `&gender=${gender}`;

    // Fetch animals
    const animalsResponse = await fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });
    const data = await animalsResponse.json();

    // Fetch breeds for the filter
    const breedsResponse = await fetch(
        `https://api.petfinder.com/v2/types/${petType}/breeds`,
        {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        }
    );
    const breedsData = await breedsResponse.json();

    return json({
        animals: data.animals || [],
        pagination: data.pagination || {},
        breeds: breedsData.breeds || [],
        searchParams: {
            petType,
            zipcode,
            age,
            breed,
            gender,
            distance,
        },
    });
}

export default function SearchResults() {
    const { animals, pagination, breeds, searchParams } = useLoaderData<typeof loader>();
    const [currentSearchParams, setSearchParams] = useSearchParams();
    const pageNumber = parseInt(currentSearchParams.get("page") || "1");

    const nextPage = () => {
        if (pageNumber < pagination.total_pages) {
            setSearchParams({
                ...Object.fromEntries(currentSearchParams),
                page: (pageNumber + 1).toString(),
            });
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setSearchParams({
                ...Object.fromEntries(currentSearchParams),
                page: (pageNumber - 1).toString(),
            });
        }
    };

    const filteredAnimals = animals.filter(
        (animal: Animal) =>
            animal.photos.length > 0 && animal.primary_photo_cropped
    );

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Search Info */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-4">
                            {searchParams.petType === 'dog' ? '🐕' : '🐱'} Amazing {searchParams.petType === 'dog' ? 'Dogs' : 'Cats'} Waiting for You
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Found {pagination.total_count || filteredAnimals.length} pets near {searchParams.zipcode}
                        </p>

                        {/* Search Again Button */}
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary-200 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 shadow-soft"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search Again
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filter Sidebar - Always visible */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-8">
                                <Filter breeds={breeds} />
                            </div>
                        </div>

                        {/* Results Content */}
                        <div className="lg:w-3/4">
                            {/* Active Filters Display */}
                            {(searchParams.age || searchParams.breed || searchParams.gender || searchParams.distance !== "25") && (
                                <div className="mb-6 p-4 bg-white rounded-2xl shadow-soft border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-700">Active Filters:</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {searchParams.distance !== "25" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                                📍 Within {searchParams.distance} miles
                                            </span>
                                        )}
                                        {searchParams.age && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                                                🎂 {searchParams.age}
                                            </span>
                                        )}
                                        {searchParams.gender && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                                                {searchParams.gender === 'Male' ? '♂️' : '♀️'} {searchParams.gender}
                                            </span>
                                        )}
                                        {searchParams.breed && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                🐾 {searchParams.breed}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {filteredAnimals.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Pets Found</h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        We couldn't find any {searchParams.petType}s matching your current filters. Try adjusting your search criteria using the filters on the left, or expand your search area.
                                    </p>                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams();
                                                newParams.set("pet", searchParams.petType);
                                                newParams.set("zipcode", searchParams.zipcode);
                                                newParams.set("distance", "25");
                                                newParams.set("page", "1");
                                                window.location.search = newParams.toString();
                                            }}
                                            className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 font-semibold rounded-xl hover:bg-primary-200 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2m-15.356 0H4" />
                                            </svg>
                                            Clear All Filters
                                        </button>
                                        <Link
                                            to="/dashboard"
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-medium"
                                        >
                                            New Search
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Grid */}
                                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-12">
                                        {filteredAnimals.map((animal: Animal) => (
                                            <Link
                                                key={animal.id}
                                                to={`/pet/${animal.id}`}
                                                className="group"
                                            >
                                                <div className="bg-white rounded-3xl shadow-soft hover:shadow-medium transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                                                    {/* Image Container */}
                                                    <div className="relative overflow-hidden aspect-square">
                                                        <img
                                                            src={animal.primary_photo_cropped?.small || ""}
                                                            alt={`${animal.name} - ${animal.breeds.primary}`}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                        {/* Heart Icon */}
                                                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
                                                                {animal.name}
                                                            </h3>
                                                            <div className="flex items-center space-x-1 text-accent-500">
                                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">4.9</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 mb-4">
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">{animal.breeds.primary}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-sm">{animal.contact.address.city}, {animal.contact.address.state}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                                                    {animal.age}
                                                                </span>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                                                                    {animal.size}
                                                                </span>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                                                                    {animal.gender}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <span className="text-sm text-gray-500">Ready for adoption</span>
                                                            <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                                                                <span>Meet {animal.name}</span>
                                                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.total_pages > 1 && (
                                        <div className="flex justify-center items-center space-x-4">
                                            <button
                                                onClick={prevPage}
                                                disabled={pageNumber <= 1}
                                                className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous
                                            </button>

                                            <div className="flex items-center space-x-2">
                                                <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-medium">
                                                    {pageNumber}
                                                </span>
                                                <span className="text-gray-500">of {pagination.total_pages}</span>
                                            </div>

                                            <button
                                                onClick={nextPage}
                                                disabled={pageNumber >= pagination.total_pages}
                                                className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                                            >
                                                Next
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const errorMessage = error instanceof Error && error.message;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-large p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Error</h2>
                    <p className="text-gray-600 mb-6">
                        Please enter a valid zipcode and select a pet type to search for your perfect companion.
                    </p>
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                    )}
                    <Link
                        to="/dashboard"
                        className="w-full inline-flex justify-center items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </>
    );
}
