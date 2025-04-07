"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ManagerDashboard = () => {
  const params = useParams(); 
const [username, setUsername] = useState('');
const [manager, setManager] = useState(null);
const [users, setUsers] = useState([]);
const [managerWallet, setManagerWallet] = useState(0);
const [selectedUser, setSelectedUser] = useState("");
const [coinsToAdd, setCoinsToAdd] = useState("");
const [newUsername, setNewUsername] = useState("");
const [newPassword, setNewPassword] = useState("");

// ✅ Step 1: Move fetchUsers OUTSIDE useEffect()
const fetchUsers = async () => {
  try {
    const res = await fetch(`/api/users/get-by-manager/${username}`);
    const data = await res.json();
    console.log("API Response:", data);
    if (res.ok) {
      console.log("Users fetched:", data.users); // ✅ Debugging ke liye
      setUsers(data.users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

useEffect(() => {
  async function unwrapParams() {
    if (!params) return;
    const resolvedParams = await params;
    setUsername(resolvedParams.username);
  }
  unwrapParams();
}, [params]);

useEffect(() => {
  if (!username) return;
  
  const fetchManagerData = async () => {
    try {
      const res = await fetch(`/api/managers/${username}`);
      if (!res.ok) throw new Error("Failed to fetch manager");
      const data = await res.json();

      if (!data.manager) throw new Error("Manager data is missing");

      setManager(data.manager);
      
      const assigned = data.manager.coinsAssigned || 0;
      const used = data.manager.coinsUsed || 0;

      setManagerWallet(assigned - used);
    } catch (error) {
      console.error("Error fetching manager:", error);
    }
  };

  fetchManagerData();
  fetchUsers(); // ✅ Step 2: Use fetchUsers properly here
}, [username]);

const addUser = async () => {
  if (newUsername && newPassword) {
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, managerUsername: username })
    });

    if (res.ok) {
      const newUser = await res.json();
      console.log("User created:", newUser);

      setNewUsername("");
      setNewPassword("");

      fetchUsers();  // ✅ Step 3: Remove `await`, just call fetchUsers
    }
  }
};

const addCoins = async () => {
  if (selectedUser && coinsToAdd && managerWallet >= parseInt(coinsToAdd)) {
    const res = await fetch(`/api/managers/add-coins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, user: selectedUser, coins: parseInt(coinsToAdd) })
    });

    if (res.ok) {
      setManagerWallet(managerWallet - parseInt(coinsToAdd)); // ✅ Manager ka wallet update ho raha hai
      
      // ✅ User ke coins bhi update ho
      setUsers(users.map(user => 
        user.username === selectedUser 
          ? { ...user, walletBalance: user.walletBalance + parseInt(coinsToAdd) } 
          : user
      ));
      await fetchUsers();
    }
  }
};


return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-6 sm:p-8 flex flex-col items-center text-white">
    <h1 className="text-4xl sm:text-5xl font-bold mb-2">👤</h1>
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Manager Dashboard</h2>

    <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-1">
      Manager: {manager?.username}
    </h3>
    <p className="text-base sm:text-lg mb-1">Wallet Balance: {managerWallet} Coins</p>
    <p className="text-base sm:text-lg mb-6">Total Users Under You: {users.length}</p>

    <div className="w-full max-w-2xl space-y-6">
      {/* Create User */}
      <div className="bg-gray-800 shadow-lg rounded-xl p-5">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Create User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 rounded-md p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUser}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
        >
          Add User
        </button>
      </div>

      {/* Send Coins */}
      <div className="bg-gray-800 shadow-lg rounded-xl p-5">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Send Coins</h3>
        <select
          className="w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.username} value={user.username}>
              {user.username} - {user.coins} Coins
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Enter Coins"
          value={coinsToAdd}
          onChange={(e) => setCoinsToAdd(e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCoins}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Add Coins
        </button>
      </div>
    </div>

    {/* Users List */}
    <div className="mt-6 w-full max-w-2xl bg-gray-800 shadow-lg rounded-xl p-5">
      <h3 className="text-lg font-semibold text-blue-300 mb-3">Users Under You</h3>
      {users.length > 0 ? (
        <ul className="divide-y divide-gray-700">
          {users.map((user) => (
            <li
              key={user.username}
              className="py-2 flex justify-between text-white"
            >
              <span className="font-semibold">{user.username}</span>
              <span className="text-sm text-gray-300">
                {user.walletBalance.toFixed(2)} Coins
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No users assigned yet.</p>
      )}
    </div>
  </div>
);

};

export default ManagerDashboard;
