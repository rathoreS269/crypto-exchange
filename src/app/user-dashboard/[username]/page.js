"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
const UserDashboard = () => {
  const params = useParams(); // ✅ params object direct hota hai, await ki zaroorat nahi
  const [username, setUsername] = useState("");
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [coinsToSend, setCoinsToSend] = useState("");
  const [ownedProducts, setOwnedProducts] = useState([]);

  useEffect(() => {
    if (params?.username) {
      setUsername(params.username); // ✅ Directly set without async/await
    }
  }, [params]);


  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`/api/users/${params.username}`);
  
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
  
        const data = await res.json(); // ✅ JSON parse karo
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUserData();
  }, [params.username]);

  const sendCoinsToManager = async () => {
    if (!user || coinsToSend <= 0 || user.walletBalance < coinsToSend) {
      alert("Not enough coins or invalid amount!");
      return;
    }
    console.log("🟡 Sending request to API with: ", {
      user: username,
      manager: user?.manager?.username, 
      coins: parseInt(coinsToSend),
    });
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
      console.log("🔵 API Response:", res);
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h2>
      <p className="mb-2">Wallet Balance: {user?.walletBalance} Coins</p>
      <p className="mb-2">Manager: {user?.manager?.username}</p>

      <div className="mb-4">
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
          className="border p-2 mr-2"
        />
        <button
          onClick={sendCoinsToManager}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Send to Manager
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-4">Owned Products</h3>
      {ownedProducts.length > 0 ? (
        <ul>
          {ownedProducts.map((product, index) => (
            <li key={index} className="border p-2 mt-2">
              {product.name} - Price: {product.price.toFixed(1)} Coins - Quantity:{" "}
              {product.quantity.toFixed(1)} - Total:{" "}
              {(product.price * product.quantity).toFixed(1)} Coins
            </li>
          ))}
        </ul>
      ) : (
        <p>No products owned.</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push(`/products/${username}`)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Go to Product Page
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
