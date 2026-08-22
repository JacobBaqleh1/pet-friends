import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import dogImage from "public/dog-image.jpg";
export const meta: MetaFunction = () => {
  return [
    { title: "Pet Friends - Find Your Forever Companion" },
    { name: "description", content: "Discover and adopt amazing pets from organizations in your area. Find your perfect furry friend today!" },
  ];
};

export default function Component() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent leading-tight mb-6">
                Adopt a{" "}
                <span className="relative text-black/80">
                  forever friend
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-accent-400 opacity-60"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,8 Q50,0 100,8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                today!
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                Connect with amazing pets from trusted organizations in your area.
                Every pet deserves a loving home, and every home deserves a loyal companion.
              </p>
            </div>

            {/* CTA Button */}
            <Form method="get" action="/dashboard">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-large hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="inline-block ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
            </Form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Happy Adoptions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Partner Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-3xl opacity-20 blur-lg"></div>
              <div className="relative">
                <img
                  alt="Happy dog waiting for adoption"
                  src={dogImage}
                  className="w-full h-auto rounded-3xl shadow-large object-cover"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-medium max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Find Love Today</p>
                      <p className="text-sm text-gray-600">Thousands waiting for homes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
