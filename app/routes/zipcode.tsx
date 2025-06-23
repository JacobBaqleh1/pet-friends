export default function Zipcode() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-large p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                    Location Services
                </h2>
                <p className="text-gray-600 mb-8">
                    This page helps you find pets in your specific area. Enter your zipcode to discover amazing companions nearby!
                </p>
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-700 mb-4">
                        🗺️ Find pets within your radius
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                        📍 Location-based search results
                    </p>
                    <p className="text-sm text-gray-700">
                        ❤️ Connect with local shelters
                    </p>
                </div>
            </div>
        </main>
    );
}