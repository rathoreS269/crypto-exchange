"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [managers, setManagers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [coinsToAdd, setCoinsToAdd] = useState("");

  useEffect(() => {
    fetchManagers(); // ✅ Initial managers fetch
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await fetch("/api/managers/get-all");
      const data = await res.json();
      setManagers(data.managers); // ✅ Properly updating state with fetched data
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const addManager = async () => {
    if (username && password) {
      const res = await fetch("/api/managers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        fetchManagers(); // ✅ Refresh manager list after adding
        setUsername("");
        setPassword("");
      }
    }
  };

  const addCoinsToManager = async () => {
    if (selectedManager && coinsToAdd) {
      const res = await fetch("/api/managers/add-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: selectedManager, coins: coinsToAdd })
      });

      if (res.ok) {
        fetchManagers(); // ✅ Refresh manager list after adding coins
        setCoinsToAdd("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-6 sm:p-8 flex flex-col items-center text-white">
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">👤</h1>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
  
      <div className="w-full max-w-2xl space-y-6">
        {/* Add Manager */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-5">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Add Manager</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addManager}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Add Manager
          </button>
        </div>
  
        {/* Send Coins */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-5">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Send Coins to Manager</h3>
          <select
            className="w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.username} value={manager.username}>
                {manager.username} (Coins: {manager.coinsAssigned})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter Coins"
            value={coinsToAdd}
            onChange={(e) => setCoinsToAdd(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCoinsToManager}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Add Coins
          </button>
        </div>
  
        {/* Manager List */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-5">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Managers List</h3>
          {managers.length === 0 ? (
            <p className="text-gray-400">No managers added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {managers.map((manager) => (
                <li key={manager.username} className="py-2 flex justify-between text-white">
                  <span className="font-medium">{manager.username}</span>
                  <span className="text-sm text-gray-400">
                    Coins: {manager.coinsAssigned - manager.coinsUsed}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
  
}
