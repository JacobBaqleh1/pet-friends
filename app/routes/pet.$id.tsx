import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import Navbar from "../components/navbar";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    let id = params.id;

    if (!id) {
        throw new Response("Pet ID is required", { status: 400 });
    }

    //fetching api token from the petfinder website
    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
            client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
        }),
    });
    const tokenData = await response.json();

    //fetching api data using the params and the api token
    const res = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });

    if (!res.ok) {
        throw new Response("Pet not found", { status: 404 });
    }

    const animalData = await res.json();

    //  code to fetch organization details
    const orgRes = await fetch(
        `https://api.petfinder.com/v2/organizations/${animalData.animal.organization_id}`,
        {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        }
    );
    const organization = await orgRes.json();

    return json({ animal: animalData.animal, organization: organization.organization });
};

export default function PetDetails() {
    const [activeTab, setActiveTab] = useState("about");
    const [showContactModal, setShowContactModal] = useState(false);
    const { animal, organization } = useLoaderData<typeof loader>();

    const handleTabSwitch = (tabName: string) => {
        setActiveTab(tabName);
    };

    const openContactModal = () => {
        setShowContactModal(true);
        document.body.style.overflow = "hidden";
    };

    const closeContactModal = () => {
        setShowContactModal(false);
        document.body.style.overflow = "auto";
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-soft"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Results
                        </button>
                    </div>

                    {/* Hero Section */}
                    <div className="relative bg-white rounded-3xl shadow-large overflow-hidden mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10"></div>

                        <div className="relative p-8 lg:p-12">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                {/* Pet Image */}
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 blur-lg"></div>
                                    <img
                                        src={animal.primary_photo_cropped?.small || ""}
                                        alt={`${animal.name} - ${animal.breeds.primary}`}
                                        className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white shadow-large"
                                    />
                                    {/* Status badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-medium">
                                        Available
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="flex-1 text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-4">
                                        Hi, I'm {animal.name}!
                                    </h1>

                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                                        <div className="flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-medium">{animal.breeds.primary}</span>
                                        </div>
                                        <div className="flex items-center bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">
                                                {animal.contact.address.city}, {animal.contact.address.state}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Health Status */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                                        {animal.attributes.shots_current && (
                                            <div className="flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium">Vaccinated</span>
                                            </div>
                                        )}
                                        {animal.attributes.spayed_neutered && (
                                            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium">Spayed/Neutered</span>
                                            </div>
                                        )}
                                        {animal.attributes.house_trained && (
                                            <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-2 rounded-lg">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium">House Trained</span>
                                            </div>
                                        )}
                                        {animal.attributes.special_needs && (
                                            <div className="flex items-center bg-orange-100 text-orange-700 px-3 py-2 rounded-lg">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium">Special Needs</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pet Stats */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-primary-500">
                                                <p className="text-sm text-gray-600 mb-1">Age</p>
                                                <p className="text-2xl font-bold text-gray-800">{animal.age}</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-secondary-500">
                                                <p className="text-sm text-gray-600 mb-1">Gender</p>
                                                <p className="text-2xl font-bold text-gray-800">{animal.gender}</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-accent-500">
                                                <p className="text-sm text-gray-600 mb-1">Size</p>
                                                <p className="text-2xl font-bold text-gray-800">{animal.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-3xl shadow-large overflow-hidden mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-8">
                                <button
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "about"
                                            ? "border-primary-500 text-primary-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleTabSwitch("about")}
                                >
                                    📝 About Me
                                </button>
                                <button
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === "gallery"
                                            ? "border-primary-500 text-primary-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleTabSwitch("gallery")}
                                >
                                    📷 Gallery
                                </button>
                            </nav>
                        </div>

                        <div className="p-8">
                            {activeTab === "about" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">About {animal.name}</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {animal.description || `${animal.name} is a wonderful ${animal.breeds.primary} looking for a loving home. This ${animal.age} ${animal.gender.toLowerCase()} would make a perfect addition to the right family.`}
                                        </p>
                                    </div>

                                    {animal.environment && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Perfect Home Environment</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {animal.environment.children && (
                                                    <div className="flex items-center bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Good with children</span>
                                                    </div>
                                                )}
                                                {animal.environment.dogs && (
                                                    <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Good with other dogs</span>
                                                    </div>
                                                )}
                                                {animal.environment.cats && (
                                                    <div className="flex items-center bg-purple-50 text-purple-700 px-4 py-3 rounded-lg">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Good with cats</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "gallery" && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Photo Gallery</h3>
                                    {animal.photos && animal.photos.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {animal.photos.map((photo: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="relative group overflow-hidden rounded-2xl shadow-medium hover:shadow-large transition-all duration-300"
                                                >
                                                    <img
                                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                                        src={photo.small}
                                                        alt={`${animal.name} photo ${index + 1}`}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-2 text-gray-500">No additional photos available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organization Info */}
                    <div className="bg-white rounded-3xl shadow-large overflow-hidden mb-8">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Meet the Organization</h3>
                                    <p className="text-lg font-semibold text-primary-600">{organization.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center text-gray-600 mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span>
                                            {organization.address.city}, {organization.address.state}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
                                <p className="text-gray-700 mb-4">
                                    This trusted organization is committed to finding loving homes for pets in need.
                                    They provide comprehensive care and support throughout the adoption process.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                        ✅ Verified Organization
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        💚 Non-Profit
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        🏆 5-Star Rating
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Adoption CTA */}
                    <div className="text-center">
                        <button
                            onClick={openContactModal}
                            className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white font-bold text-xl rounded-2xl shadow-large hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="relative z-10">
                                💕 Adopt {animal.name}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <svg
                                className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Contact Modal */}
                    {showContactModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact Organization</h3>
                                            <p className="text-gray-600">Ready to meet {animal.name}?</p>
                                        </div>
                                        <button
                                            onClick={closeContactModal}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        >
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 text-center">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                {organization.name}
                                            </h4>
                                            <p className="text-gray-600">
                                                Tell them about your interest in {animal.name}!
                                            </p>
                                        </div>

                                        {organization.email && (
                                            <div className="flex items-center bg-white border-2 border-gray-100 hover:border-primary-200 rounded-2xl p-4 transition-colors duration-200">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                                    <a
                                                        href={`mailto:${organization.email}?subject=Interested in adopting ${animal.name}&body=Hello! I'm interested in learning more about adopting ${animal.name}. Please let me know what the next steps would be.`}
                                                        className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                                    >
                                                        {organization.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {organization.phone && (
                                            <div className="flex items-center bg-white border-2 border-gray-100 hover:border-secondary-200 rounded-2xl p-4 transition-colors duration-200">
                                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">Phone</p>
                                                    <a
                                                        href={`tel:${organization.phone}`}
                                                        className="text-lg font-semibold text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
                                                    >
                                                        {organization.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <button
                                                onClick={closeContactModal}
                                                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 14c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Pet Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find the pet you're looking for. It may have been adopted or the listing may no longer be available.
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
                        Search for Pets
                    </Link>
                </div>
            </div>
        </>
    );
}
