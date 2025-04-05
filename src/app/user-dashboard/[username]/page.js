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
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h2>
      <p className="mb-2 font-medium">Wallet Balance: {user?.walletBalance.toFixed(2)} Coins</p>
      <p className="mb-2">Manager: {user?.manager?.username}</p>

      <div className="mb-6">
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
          className="border p-2 rounded mr-2 w-40"
        />
        <button
          onClick={sendCoinsToManager}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send to Manager
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-green-700">Good Products</h3>
        {goodProducts.length > 0 ? (
          <ul className="space-y-2">
            {goodProducts.map((product, index) => (
              <li key={index} className="border p-3 rounded bg-green-50 text-black">
                {product.productId} - Price: {product.price.toFixed(1)} Coins - Quantity:{" "}
                {product.goodUnits.toFixed(2)} - Total: {(product.price * product.goodUnits).toFixed(1)} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No good products owned.</p>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-red-700">Bad Products</h3>
        {badProducts.length > 0 ? (
          <ul className="space-y-2">
            {badProducts.map((product, index) => (
              <li key={index} className="border p-3 rounded bg-red-50 text-black">
                {product.productId} - Price: {product.price.toFixed(1)} Coins - Quantity:{" "}
                {product.badUnits.toFixed(2)} - Total: {(product.price * product.badUnits).toFixed(1)} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bad products owned.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push(`/products/${username}`)}
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
        >
          Go to Product Page
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
