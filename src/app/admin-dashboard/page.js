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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Dashboard</h1>
      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Add Manager</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300 text-black"
          />
          <button onClick={addManager} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
            Add Manager
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Send Coins to Manager</h2>
          <select
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300 text-black"
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
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300 text-black"
          />
          <button onClick={addCoinsToManager} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
            Add Coins
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Managers List</h2>
          {managers.length === 0 ? (
            <p className="text-gray-500">No managers added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {managers.map((manager) => (
                <li key={manager.username} className="py-2 flex justify-between text-gray-700">
                  <span className="font-medium">{manager.username}</span>
                  <span className="text-sm text-gray-500">Coins: {manager.coinsAssigned}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
