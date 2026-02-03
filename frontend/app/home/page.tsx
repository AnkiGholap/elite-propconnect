"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface Property {
  _id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  price: number;
  priceText: string;
  bhk: string;
  rating: number;
  category: string;
  image: string;
}

export default function HomePage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all properties and locations on page load
  useEffect(() => {
    fetchProperties();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_URL}/properties/locations`);
      const data = await res.json();
      if (res.ok) {
        setLocations(data.locations);
      }
    } catch {
      console.error("Failed to fetch locations");
    }
  };

  const fetchProperties = async (queryParams = "") => {
    try {
      const res = await fetch(`${API_URL}/properties${queryParams}`);
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
        setError("");
      } else {
        setError(data.message || "Failed to fetch properties");
      }
    } catch {
      setError("Database not connected. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Build query params for API
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);

    if (budget) {
      if (budget === "200+") {
        params.append("minPrice", "20000000");
      } else {
        const [min, max] = budget.split("-").map(Number);
        params.append("minPrice", String(min * 100000));
        params.append("maxPrice", String(max * 100000));
      }
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    await fetchProperties(queryString);
    setIsSearching(false);

    // Scroll to results
    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReset = async () => {
    setLocation("");
    setPropertyType("");
    setBudget("");
    setIsLoading(true);
    await fetchProperties();
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/city-bg.jpg')`,
        backgroundColor: "#1a1a2e",
      }}
    >
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-md text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <span className="text-amber-400 text-sm font-semibold tracking-wider">ELITE</span>
                <h1 className="text-white text-xl font-bold -mt-1">PropConnect</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="hover:text-amber-400 transition">Home</a>
              <a href="#" className="hover:text-amber-400 transition">Projects</a>
              <a href="#" className="hover:text-amber-400 transition">Properties</a>
              <a href="#" className="hover:text-amber-400 transition">About</a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-600 transition font-semibold"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-gray-200 text-center mb-10 text-lg">
            Exclusive Projects & Best Deals
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Location - Dynamic from DB */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-md border border-gray-200">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-md border border-gray-200">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-md border border-gray-200">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                >
                  <option value="">Budget</option>
                  <option value="0-50">Under 50 Lakhs</option>
                  <option value="50-100">50L - 1 Cr</option>
                  <option value="100-200">1 Cr - 2 Cr</option>
                  <option value="200+">Above 2 Cr</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-amber-500 text-black rounded-md font-semibold hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                {isSearching ? "Searching..." : "Search"}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-64 bg-cover bg-center transform hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 relative z-10">
                  <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Luxury Residences</h3>
                  <p className="text-sm text-gray-100 drop-shadow-md">Premium Properties</p>
                </div>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-64 bg-cover bg-center transform hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 relative z-10">
                  <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Affordable Homes</h3>
                  <p className="text-sm text-gray-100 drop-shadow-md">Budget Friendly</p>
                </div>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-64 bg-cover bg-center transform hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 relative z-10">
                  <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">New Launch Offers</h3>
                  <p className="text-sm text-gray-100 drop-shadow-md">Latest Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="results-section" className="py-12 px-6 bg-white/10 backdrop-blur-sm scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {location || propertyType || budget ? "Search Results" : "Featured Properties"}
              <span className="text-lg ml-3 text-amber-400">({properties.length})</span>
            </h2>
            {properties.length > 0 && (
              <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold drop-shadow-md">
                View More →
              </a>
            )}
          </div>

          {error && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-red-500/20 border border-red-500/50 backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-bold text-red-400 mb-2">{error}</h3>
                <p className="text-gray-300">Please make sure the backend server is running.</p>
              </div>
            </div>
          )}

          {isLoading || isSearching ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isSearching ? "Searching Properties..." : "Loading Properties..."}
                </h3>
                <p className="text-gray-600">Please wait while we fetch properties from database</p>
              </div>
            </div>
          ) : !error && properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-amber-500 text-black rounded-md font-semibold hover:bg-amber-600 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${property.image}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-gray-700">{property.location}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        ⭐ {property.rating}/5
                      </span>
                      <span className="text-xs text-gray-500">{property.bhk}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{property.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {property.priceText} • {property.category}
                    </p>
                    <button
                      onClick={() => router.push(`/property/${property.slug}`)}
                      className="w-full py-2 bg-amber-500 text-black rounded-md font-semibold hover:bg-amber-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md text-white py-8 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-300">© 2024 Elite PropConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
