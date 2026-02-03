"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Property {
  _id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  priceText: string;
  bhk: string;
  rating: number;
  reraApproved: boolean;
}

export default function PropertiesManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = () => {
    setLoading(true);
    fetch(`${API_URL}/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await fetch(`${API_URL}/properties/${slug}`, { method: "DELETE" });
      fetchProperties();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Properties Management</h1>
        <Link
          href="/admin/properties/add"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          + Add Property
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Name</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Location</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Type</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Price</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">BHK</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">RERA</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-6 py-4 text-white font-medium">{p.name}</td>
                <td className="px-6 py-4 text-gray-300">{p.location}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs capitalize">{p.type}</span>
                </td>
                <td className="px-6 py-4 text-amber-400 font-medium">{p.priceText}</td>
                <td className="px-6 py-4 text-gray-300">{p.bhk}</td>
                <td className="px-6 py-4">
                  {p.reraApproved ? (
                    <span className="text-green-400 text-sm">✓ Yes</span>
                  ) : (
                    <span className="text-gray-500 text-sm">No</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/properties/edit?slug=${p.slug}`}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.slug)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <p className="text-center text-gray-500 py-12">No properties found</p>
        )}
      </div>
    </div>
  );
}
