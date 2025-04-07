"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const UserDashboard = () => {
  const params = useParams();
  const [username, setUsername] = useState("");
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [coinsToSend, setCoinsToSend] = useState("");
  const [ownedProducts, setOwnedProducts] = useState([]);

  useEffect(() => {
    if (params?.username) {
      setUsername(params.username);
    }
  }, [params]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`/api/users/${params.username}`);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setUser(data.user);
        setOwnedProducts(data.user.ownedProducts || []);
        console.log("user in UP", user)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUserData();
  }, [params.username]);
   
  // useEffect(() => {
  //   if (user) {
  //     console.log("Updated user:", user);
  //   }
  // }, [user]);

  const sendCoinsToManager = async () => {
    if (!user || coinsToSend <= 0 || user.walletBalance < coinsToSend) {
      alert("Not enough coins or invalid amount!");
      return;
    }

    try {
      const res = await fetch(`/api/users/transfer-coins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: username,
          manager: user.manager.username,
          coins: parseInt(coinsToSend),
        }),
      });

      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance - parseInt(coinsToSend),
        }));
        alert(`${coinsToSend} coins sent to Manager ${user.manager}!`);
        setCoinsToSend("");
      } else {
        alert("Failed to send coins!");
      }
    } catch (error) {
      console.error("Error sending coins:", error);
    }
  };

  const goodProducts = ownedProducts.filter((p) => p.goodUnits > 0);
  const badProducts = ownedProducts.filter((p) => p.badUnits > 0);
  //  console.log("good is", goodProducts)
  //  console.log("bad products is", badProducts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-6 sm:p-8 text-white flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">👤</h1>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Welcome, {user?.username}
      </h2>
      <p className="text-base sm:text-lg mb-1">Wallet Balance: {user?.walletBalance.toFixed(2)} Coins</p>
      <p className="text-base sm:text-lg mb-6">Manager: {user?.manager?.username}</p>
  
      {/* Send Coins */}
      <div className="w-full max-w-xl mb-8 bg-gray-800 p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Send Coins to Manager</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter coins to send"
            value={coinsToSend}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setCoinsToSend(value);
              }
            }}
            className="border border-gray-600 bg-gray-700 text-white rounded-md p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendCoinsToManager}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Send to Manager
          </button>
        </div>
      </div>
  
      {/* Good Products */}
      <div className="w-full max-w-xl mb-8 bg-gray-800 p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Good Products</h3>
        {goodProducts.length > 0 ? (
          <ul className="space-y-3">
            {goodProducts.map((product, index) => (
              <li key={index} className="bg-green-900 text-white p-3 rounded-md">
                {product.productId} - Price: {product.price.toFixed(1)} Coins - Quantity: {product.goodUnits.toFixed(2)} - Total: {(product.price * product.goodUnits).toFixed(1)} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No good products owned.</p>
        )}
      </div>
  
      {/* Bad Products */}
      <div className="w-full max-w-xl mb-8 bg-gray-800 p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-red-400 mb-3">Bad Products</h3>
        {badProducts.length > 0 ? (
          <ul className="space-y-3">
            {badProducts.map((product, index) => (
              <li key={index} className="bg-red-900 text-white p-3 rounded-md">
                {product.productId} - Price: {product.price.toFixed(1)} Coins - Quantity: {product.badUnits.toFixed(2)} - Total: {(product.price * product.badUnits).toFixed(1)} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No bad products owned.</p>
        )}
      </div>
  
      {/* Button to Product Page */}
      <div className="mt-4">
        <button
          onClick={() => router.push(`/products/${username}`)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
        >
          Go to Product Page
        </button>
      </div>
    </div>
  );
  
};

export default UserDashboard;
