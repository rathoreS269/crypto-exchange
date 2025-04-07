'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userUsername", username);
      router.push(`/user-dashboard/${username}`);
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">User Login</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
