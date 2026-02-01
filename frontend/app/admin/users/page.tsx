"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/admin/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (id: string, role: string) => {
    try {
      await fetch(`${API_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`${API_URL}/admin/users/${id}`, { method: "DELETE" });
      fetchUsers();
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
      <h1 className="text-2xl font-bold text-white mb-8">Users Management</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Username</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Role</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Joined</th>
              <th className="text-left text-gray-400 font-medium px-6 py-4 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role || "user"}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className={`border-0 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none cursor-pointer ${
                      user.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-gray-500 py-12">No users found</p>
        )}
      </div>
    </div>
  );
}
