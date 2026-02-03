"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName("");
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || "Error adding category");
      }
    } catch { alert("Error adding category"); }
    setAdding(false);
  };

  const updateCategory = async (id: string, update: { name?: string; status?: string }) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      setEditId(null);
      fetchCategories();
    } catch { alert("Error updating category"); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch { alert("Error deleting category"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Categories Master</h1>

      {/* Add Category */}
      <form onSubmit={addCategory} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new category name"
          className="flex-1 max-w-md bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {adding ? "Adding..." : "+ Add Category"}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">#</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Category Name</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Status</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Created</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    {editId === cat._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500"
                          autoFocus
                        />
                        <button
                          onClick={() => updateCategory(cat._id, { name: editName })}
                          className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded text-sm hover:bg-green-500/30"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-white font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={cat.status}
                      onChange={(e) => updateCategory(cat._id, { status: e.target.value })}
                      className={`border-0 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none cursor-pointer ${
                        cat.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditId(cat._id); setEditName(cat.name); }}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
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
          {categories.length === 0 && (
            <p className="text-center text-gray-500 py-12">No categories found. Add one above.</p>
          )}
        </div>
      )}
    </div>
  );
}
