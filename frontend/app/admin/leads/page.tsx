"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  propertySlug: string;
  type: "brochure" | "visit";
  status: "new" | "contacted" | "converted";
  date: string;
  time: string;
  message: string;
  createdAt: string;
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set("type", filterType);
    if (filterStatus) params.set("status", filterStatus);

    fetch(`${API_URL}/admin/leads?${params}`)
      .then((res) => res.json())
      .then((data) => setLeads(data.leads || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, [filterType, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchLeads();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await fetch(`${API_URL}/admin/leads/${id}`, { method: "DELETE" });
      fetchLeads();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const statusColors: Record<string, string> = {
    new: "bg-amber-500/20 text-amber-400",
    contacted: "bg-blue-500/20 text-blue-400",
    converted: "bg-green-500/20 text-green-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Leads Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
        >
          <option value="">All Types</option>
          <option value="brochure">Brochure Downloads</option>
          <option value="visit">Visit Requests</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Name</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Contact</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Property</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Type</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Status</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Date</th>
                <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300 text-sm">{lead.email}</div>
                    <div className="text-gray-500 text-xs">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{lead.propertyName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${lead.type === "visit" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                      {lead.type === "visit" ? "Site Visit" : "Brochure"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      className={`${statusColors[lead.status]} border-0 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none cursor-pointer`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <p className="text-center text-gray-500 py-12">No leads found</p>
          )}
        </div>
      )}
    </div>
  );
}
