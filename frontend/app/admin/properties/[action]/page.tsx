"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PropertyForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = params.action as string;
  const slug = searchParams.get("slug");
  const isEdit = action === "edit" && slug;

  const [form, setForm] = useState({
    name: "", slug: "", location: "", type: "apartment", price: "", priceText: "",
    bhk: "", rating: "", category: "", image: "", description: "",
    amenitiesCount: "", reraApproved: false, developer: "", possession: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!isEdit);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/categories?status=active`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}/properties/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.property) {
            const p = data.property;
            setForm({
              name: p.name || "", slug: p.slug || "", location: p.location || "",
              type: p.type || "apartment", price: String(p.price || ""),
              priceText: p.priceText || "", bhk: p.bhk || "",
              rating: String(p.rating || ""), category: p.category || "",
              image: p.image || "", description: p.description || "",
              amenitiesCount: String(p.amenitiesCount || ""),
              reraApproved: p.reraApproved || false,
              developer: p.developer || "", possession: p.possession || "",
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        amenitiesCount: Number(form.amenitiesCount),
      };

      const url = isEdit ? `${API_URL}/properties/${slug}` : `${API_URL}/properties`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/properties");
      } else {
        const data = await res.json();
        alert(data.message || "Error saving property");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors";
  const labelClass = "text-gray-400 text-sm font-medium mb-1 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">
        {isEdit ? "Edit Property" : "Add Property"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Property Name *</label>
            <input className={inputClass} value={form.name} onChange={(e) => {
              const name = e.target.value;
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              setForm({ ...form, name, slug });
            }} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={`${inputClass} opacity-60 cursor-not-allowed`} value={form.slug} readOnly required />
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Type *</label>
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="plot">Plot</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Price (Number) *</label>
            <input type="number" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Price Display Text *</label>
            <input className={inputClass} value={form.priceText} onChange={(e) => setForm({ ...form, priceText: e.target.value })} required placeholder="e.g. ₹ 1.2 Cr+" />
          </div>
          <div>
            <label className={labelClass}>BHK *</label>
            <input className={inputClass} value={form.bhk} onChange={(e) => setForm({ ...form, bhk: e.target.value })} required placeholder="e.g. 3 BHK" />
          </div>
          <div>
            <label className={labelClass}>Rating</label>
            <input type="number" step="0.1" min="0" max="5" className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Image URL *</label>
            <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Developer</label>
            <input className={inputClass} value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Possession</label>
            <input className={inputClass} value={form.possession} onChange={(e) => setForm({ ...form, possession: e.target.value })} placeholder="e.g. Dec 2025" />
          </div>
          <div>
            <label className={labelClass}>Amenities Count</label>
            <input type="number" className={inputClass} value={form.amenitiesCount} onChange={(e) => setForm({ ...form, amenitiesCount: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="rera" checked={form.reraApproved} onChange={(e) => setForm({ ...form, reraApproved: e.target.checked })} className="w-5 h-5 accent-amber-500" />
            <label htmlFor="rera" className="text-gray-300">RERA Approved</label>
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass}>Description</label>
          <textarea className={`${inputClass} h-28 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Update Property" : "Create Property"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
