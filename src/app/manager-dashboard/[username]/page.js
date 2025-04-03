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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Manager Dashboard</h1>
      <h2 className="text-xl font-semibold  text-black">Manager: {manager?.username}</h2>
      <p className="text-lg  text-black">Wallet Balance: {managerWallet} Coins</p>
      <p className="text-lg  text-black">Total Users Under You: {users.length}</p>

      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Create User</h2>
          <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-2 text-black" />
          <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-2  text-black" />
          <button onClick={addUser} className="w-full bg-green-500 text-white py-2 rounded-md">Add User</button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Send Coins</h2>
          <select className="w-full border border-gray-300  text-black rounded-md p-2 mb-2" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>{user.username} - {user.coins} Coins</option>
            ))}
          </select>
          <input type="number" placeholder="Enter Coins" value={coinsToAdd} onChange={(e) => setCoinsToAdd(e.target.value)} className="w-full border  text-black border-gray-300 rounded-md p-2 mb-2" />
          <button onClick={addCoins} className="w-full bg-blue-500 text-white py-2 rounded-md">Add Coins</button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-lg bg-white shadow-md rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">Users Under You</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.username} className="border-b border-gray-200 py-2  text-black">
                <span className="font-semibold">{user.username}</span> - {user. walletBalance} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p className=" text-black">No users assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
