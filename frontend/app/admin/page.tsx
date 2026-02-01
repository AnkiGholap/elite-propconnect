"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Stats {
  newLeads: number;
  siteVisits: number;
  totalLeads: number;
  brochureLeads: number;
  totalProperties: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "New Leads", value: stats?.newLeads || 0, color: "from-amber-500 to-orange-600", icon: "🔥" },
    { label: "Site Visits", value: stats?.siteVisits || 0, color: "from-blue-500 to-cyan-600", icon: "📍" },
    { label: "Total Properties", value: stats?.totalProperties || 0, color: "from-green-500 to-emerald-600", icon: "🏠" },
    { label: "Total Users", value: stats?.totalUsers || 0, color: "from-purple-500 to-pink-600", icon: "👥" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
            </div>
            <p className="text-4xl font-bold">{card.value}</p>
            <p className="text-white/80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Leads</span>
              <span className="text-white font-bold">{stats?.totalLeads || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Brochure Downloads</span>
              <span className="text-white font-bold">{stats?.brochureLeads || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Visit Requests</span>
              <span className="text-white font-bold">{stats?.siteVisits || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Properties Listed</span>
              <span className="text-white font-bold">{stats?.totalProperties || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">System Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform</span>
              <span className="text-amber-400 font-medium">Elite PropConnect</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Version</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">API Status</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
