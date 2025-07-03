import { NavLink, useNavigation } from "@remix-run/react";

export default function Navbar() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>Pet Friends</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                }`
              }
            >
              Home
            </NavLink>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>          </div>
        </div>
      </div>      {/* Loading bar */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200/50 overflow-hidden">
          {/* Animated fill bar */}
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 relative overflow-hidden"
            style={{
              animation: 'fillWidth 2s ease-in-out infinite'
            }}
          >
            {/* Moving shimmer effect */}
            <div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                animation: 'shimmer 1.5s ease-in-out infinite'
              }}
            ></div>
          </div>
          {/* Glowing effect */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-400/30 via-secondary-400/30 to-accent-400/30 blur-sm"
            style={{
              animation: 'fillWidth 2s ease-in-out infinite'
            }}
          ></div>
        </div>
      )}
    </nav>
  );
}
