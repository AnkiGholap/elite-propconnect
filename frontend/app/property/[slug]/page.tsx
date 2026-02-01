"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FloorPlan {
  type: string;
  area: string;
  price: string;
  image?: string;
}

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
  description: string;
  amenitiesCount: number;
  reraApproved: boolean;
  developer: string;
  possession: string;
  galleryImages: string[];
  amenities: string[];
  floorPlans: FloorPlan[];
  highlights: string[];
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ name: "", email: "", phone: "", date: "", time: "", message: "" });
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`${API_URL}/properties/${slug}`);
      const data = await res.json();
      if (res.ok) {
        setProperty(data.property);
        setError("");
      } else {
        setError(data.message || "Property not found");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The property you are looking for does not exist."}</p>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-amber-500 text-black rounded-md font-semibold hover:bg-amber-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "gallery", label: "Gallery" },
    { id: "amenities", label: "Amenities" },
    { id: "floor-plans", label: "Floor Plans" },
    { id: "highlights", label: "Highlights" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/home")}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold">{property.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{property.location}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        className="relative h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url('${property.galleryImages[selectedImage] || property.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              <p className="text-gray-300 text-sm mb-2">Starting From</p>
              <h2 className="text-5xl font-bold text-amber-400 mb-6">{property.priceText}</h2>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>{property.bhk} {property.type === "villa" ? "Villa" : property.type === "penthouse" ? "Penthouse" : "Apartments"}</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>{property.amenitiesCount}+ Amenities</span>
                </div>
                {property.reraApproved && (
                  <div className="flex items-center gap-3 text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>RERA Approved</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowScheduleModal(true); setScheduleSuccess(false); setScheduleForm({ name: "", email: "", phone: "", date: "", time: "", message: "" }); }}
                  className="px-8 py-3 bg-amber-500 text-black rounded-md font-semibold hover:bg-amber-600 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "gallery" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="h-80 rounded-xl bg-cover bg-center cursor-pointer shadow-lg"
                style={{ backgroundImage: `url('${property.galleryImages[selectedImage] || property.image}')` }}
              ></div>
              <div className="grid grid-cols-2 gap-4">
                {property.galleryImages.slice(1).map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index + 1)}
                    className={`h-[152px] rounded-xl bg-cover bg-center cursor-pointer shadow-md hover:opacity-90 transition border-2 ${
                      selectedImage === index + 1 ? "border-amber-500" : "border-transparent"
                    }`}
                    style={{ backgroundImage: `url('${img}')` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Amenities <span className="text-amber-500">({property.amenitiesCount}+)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 hover:shadow-lg transition">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "floor-plans" && (
          <div>
            <div className="bg-gray-900 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Compare Floor Plans</h3>
                <div className="flex gap-4 text-sm">
                  {property.floorPlans.map((plan, index) => (
                    <label key={index} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                      <input type="radio" name="floorplan" defaultChecked={index === 0} className="accent-amber-500" />
                      <span>{plan.type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.floorPlans.map((plan, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition">
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-white text-center mb-4">{plan.type}</h4>
                      <div className="bg-white rounded-lg h-48 flex items-center justify-center mb-4 overflow-hidden">
                        {plan.image ? (
                          <img src={plan.image} alt={plan.type} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-center p-4">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <p className="text-gray-400 text-xs">Floor Plan Image</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-4 pb-5 space-y-3">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-amber-400">›</span>
                        <span>Area: <span className="text-white font-semibold">{plan.area}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-amber-400">›</span>
                        <span>Price: <span className="text-amber-400 font-semibold">{plan.price}</span></span>
                      </div>
                      <button
                        onClick={() => { setSelectedFloorPlan(plan); setFormSuccess(false); setLeadForm({ name: "", email: "", phone: "" }); }}
                        className="w-full mt-3 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-md font-bold hover:from-amber-400 hover:to-amber-500 transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Brochure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "highlights" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4">Key Features</h4>
                <div className="space-y-3">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4">Project Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Developer</span>
                    <span className="font-semibold text-gray-900">{property.developer}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold text-gray-900">{property.location}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">RERA Status</span>
                    <span className={`font-semibold ${property.reraApproved ? "text-green-600" : "text-red-500"}`}>
                      {property.reraApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Possession</span>
                    <span className="font-semibold text-gray-900">{property.possession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-semibold text-amber-600">⭐ {property.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Section */}
      <section className="bg-white py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">About {property.name}</h3>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>
        </div>
      </section>

      {/* Property Gallery Slider */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${sliderIndex * 280}px)` }}
            >
              {property.galleryImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => { setSelectedImage(index); setActiveTab("gallery"); }}
                  className="flex-shrink-0 w-64 h-44 rounded-xl bg-cover bg-center cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url('${img}')` }}
                ></div>
              ))}
            </div>
          </div>
          {sliderIndex > 0 && (
            <button
              onClick={() => setSliderIndex(sliderIndex - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-500 hover:text-black transition z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {sliderIndex < property.galleryImages.length - 3 && (
            <button
              onClick={() => setSliderIndex(sliderIndex + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-500 hover:text-black transition z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Lead Capture Modal */}
      {selectedFloorPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedFloorPlan(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gray-900 px-6 py-5 relative">
              <button onClick={() => setSelectedFloorPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Download Brochure</h3>
                  <p className="text-gray-400 text-sm">{selectedFloorPlan.type} &middot; {selectedFloorPlan.area}</p>
                </div>
              </div>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-500 mb-6">Your brochure is ready for download.</p>
                <a
                  href={selectedFloorPlan.image || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 bg-amber-500 text-black rounded-md font-bold hover:bg-amber-600 transition text-center"
                  onClick={() => setTimeout(() => setSelectedFloorPlan(null), 500)}
                >
                  Download Now
                </a>
                <p className="text-xs text-gray-400 mt-3">Our team will also contact you shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormSubmitting(true);
                  try {
                    await fetch(`${API_URL}/leads`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...leadForm,
                        propertySlug: property.slug,
                        propertyName: property.name,
                        type: "brochure",
                      }),
                    });
                    setFormSuccess(true);
                  } catch { /* still show success */ setFormSuccess(true); }
                  setFormSubmitting(false);
                }}
                className="p-6 space-y-4"
              >
                <p className="text-gray-600 text-sm">Please fill in your details to download the brochure for <span className="font-semibold text-gray-900">{selectedFloorPlan.type}</span>.</p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-bold hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Get Brochure
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">By submitting, you agree to receive updates about this project.</p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Schedule a Visit Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 px-6 py-5 relative">
              <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Schedule a Visit</h3>
                  <p className="text-gray-400 text-sm">{property.name} &middot; {property.location}</p>
                </div>
              </div>
            </div>

            {scheduleSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Visit Scheduled!</h4>
                <p className="text-gray-500 mb-2">We have received your request.</p>
                <p className="text-sm text-gray-400 mb-6">Our team will call you to confirm the visit details.</p>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-full py-3 bg-amber-500 text-black rounded-md font-bold hover:bg-amber-600 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setScheduleSubmitting(true);
                  try {
                    await fetch(`${API_URL}/leads`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: scheduleForm.name,
                        email: scheduleForm.email,
                        phone: scheduleForm.phone,
                        propertySlug: property.slug,
                        propertyName: property.name,
                        type: "visit",
                        date: scheduleForm.date,
                        time: scheduleForm.time,
                        message: scheduleForm.message,
                      }),
                    });
                    setScheduleSuccess(true);
                  } catch { setScheduleSuccess(true); }
                  setScheduleSubmitting(false);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={scheduleForm.email}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                      placeholder="Your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={scheduleForm.phone}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time *</label>
                    <select
                      required
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900"
                    >
                      <option value="">Select time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message (Optional)</label>
                  <textarea
                    value={scheduleForm.message}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                    placeholder="Any specific requirements..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-gray-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={scheduleSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-bold hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {scheduleSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Confirm Visit
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
