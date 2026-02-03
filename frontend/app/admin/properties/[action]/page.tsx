"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

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
    galleryImages: [] as string[],
    amenities: [] as string[],
    floorPlans: [] as { type: string; area: string; price: string; image: string }[],
    banner: "",
    highlights: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!isEdit);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [newAmenity, setNewAmenity] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

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
              galleryImages: p.galleryImages || [],
              amenities: p.amenities || [],
              floorPlans: p.floorPlans || [],
              banner: p.banner || "",
              highlights: p.highlights || [],
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, slug]);

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleImageUpload = async (key: "image" | "banner", file: File) => {
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, [key]: url }));
    } catch { alert("Upload failed"); }
    setUploading((u) => ({ ...u, [key]: false }));
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploading((u) => ({ ...u, gallery: true }));
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ...urls] }));
    } catch { alert("Upload failed"); }
    setUploading((u) => ({ ...u, gallery: false }));
  };

  const handleFloorPlanImageUpload = async (index: number, file: File) => {
    setUploading((u) => ({ ...u, [`fp-${index}`]: true }));
    try {
      const url = await uploadFile(file);
      setForm((f) => {
        const plans = [...f.floorPlans];
        plans[index] = { ...plans[index], image: url };
        return { ...f, floorPlans: plans };
      });
    } catch { alert("Upload failed"); }
    setUploading((u) => ({ ...u, [`fp-${index}`]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        amenitiesCount: form.amenities.length,
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
  const sectionClass = "mt-8 border-t border-gray-800 pt-6";
  const btnSmall = "bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors";
  const btnRemove = "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors";

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
            <label className={labelClass}>Developer</label>
            <input className={inputClass} value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Possession</label>
            <input className={inputClass} value={form.possession} onChange={(e) => setForm({ ...form, possession: e.target.value })} placeholder="e.g. Dec 2025" />
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

        {/* Main Image Upload */}
        <div className={sectionClass}>
          <label className={labelClass}>Main Image *</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL or upload below" required />
              <input
                type="file"
                accept="image/*"
                className="mt-2 text-sm text-gray-400"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("image", file);
                }}
              />
              {uploading.image && <p className="text-amber-400 text-sm mt-1">Uploading...</p>}
            </div>
            {form.image && (
              <img src={form.image} alt="Main" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
            )}
          </div>
        </div>

        {/* Banner Image Upload */}
        <div className={sectionClass}>
          <label className={labelClass}>Banner Image</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input className={inputClass} value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} placeholder="Banner URL or upload below" />
              <input
                type="file"
                accept="image/*"
                className="mt-2 text-sm text-gray-400"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("banner", file);
                }}
              />
              {uploading.banner && <p className="text-amber-400 text-sm mt-1">Uploading...</p>}
            </div>
            {form.banner && (
              <img src={form.banner} alt="Banner" className="w-32 h-20 object-cover rounded-lg border border-gray-700" />
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div className={sectionClass}>
          <label className={labelClass}>Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="text-sm text-gray-400"
            onChange={(e) => {
              if (e.target.files?.length) handleGalleryUpload(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading.gallery && <p className="text-amber-400 text-sm mt-2">Uploading...</p>}
          {form.galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {form.galleryImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((_, j) => j !== i) }))}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className={sectionClass}>
          <label className={labelClass}>Amenities</label>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="e.g. Swimming Pool"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newAmenity.trim()) {
                    setForm((f) => ({ ...f, amenities: [...f.amenities, newAmenity.trim()] }));
                    setNewAmenity("");
                  }
                }
              }}
            />
            <button
              type="button"
              className={btnSmall}
              onClick={() => {
                if (newAmenity.trim()) {
                  setForm((f) => ({ ...f, amenities: [...f.amenities, newAmenity.trim()] }));
                  setNewAmenity("");
                }
              }}
            >
              Add
            </button>
          </div>
          {form.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.amenities.map((a, i) => (
                <span key={i} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {a}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, amenities: f.amenities.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-300">x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Highlights */}
        <div className={sectionClass}>
          <label className={labelClass}>Highlights</label>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="e.g. Near Metro Station"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newHighlight.trim()) {
                    setForm((f) => ({ ...f, highlights: [...f.highlights, newHighlight.trim()] }));
                    setNewHighlight("");
                  }
                }
              }}
            />
            <button
              type="button"
              className={btnSmall}
              onClick={() => {
                if (newHighlight.trim()) {
                  setForm((f) => ({ ...f, highlights: [...f.highlights, newHighlight.trim()] }));
                  setNewHighlight("");
                }
              }}
            >
              Add
            </button>
          </div>
          {form.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.highlights.map((h, i) => (
                <span key={i} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {h}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, highlights: f.highlights.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-300">x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Floor Plans */}
        <div className={sectionClass}>
          <label className={labelClass}>Floor Plans</label>
          <button
            type="button"
            className={btnSmall}
            onClick={() => setForm((f) => ({ ...f, floorPlans: [...f.floorPlans, { type: "", area: "", price: "", image: "" }] }))}
          >
            + Add Floor Plan
          </button>
          {form.floorPlans.map((fp, i) => (
            <div key={i} className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm font-medium">Floor Plan {i + 1}</span>
                <button type="button" className={btnRemove} onClick={() => setForm((f) => ({ ...f, floorPlans: f.floorPlans.filter((_, j) => j !== i) }))}>
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Type</label>
                  <input className={inputClass} value={fp.type} placeholder="e.g. 2 BHK" onChange={(e) => {
                    const plans = [...form.floorPlans];
                    plans[i] = { ...plans[i], type: e.target.value };
                    setForm({ ...form, floorPlans: plans });
                  }} />
                </div>
                <div>
                  <label className={labelClass}>Area</label>
                  <input className={inputClass} value={fp.area} placeholder="e.g. 850 sqft" onChange={(e) => {
                    const plans = [...form.floorPlans];
                    plans[i] = { ...plans[i], area: e.target.value };
                    setForm({ ...form, floorPlans: plans });
                  }} />
                </div>
                <div>
                  <label className={labelClass}>Price</label>
                  <input className={inputClass} value={fp.price} placeholder="e.g. 40 lakhs" onChange={(e) => {
                    const plans = [...form.floorPlans];
                    plans[i] = { ...plans[i], price: e.target.value };
                    setForm({ ...form, floorPlans: plans });
                  }} />
                </div>
              </div>
              <div className="mt-3 flex gap-3 items-center">
                <div className="flex-1">
                  <label className={labelClass}>Floor Plan Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-gray-400"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFloorPlanImageUpload(i, file);
                    }}
                  />
                  {uploading[`fp-${i}`] && <p className="text-amber-400 text-sm mt-1">Uploading...</p>}
                </div>
                {fp.image && (
                  <img src={fp.image} alt={`Floor plan ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                )}
              </div>
            </div>
          ))}
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
