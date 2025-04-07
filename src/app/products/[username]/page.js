"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ProductPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [randomStatus, setRandomStatus] = useState({});
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await fetch(`/api/users/${username}`);
  //     const data = await res.json();
  //     console.log('data is', data)
  //     setUser(data.user);
  //   };
  //   fetchUser();
  // }, [username]); //fetch user data
  const fetchUser = async () => {
    const res = await fetch(`/api/users/${username}`);
    const data = await res.json();
    console.log("data is", data);
    setUser(data.user);
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );
        const data = await response.json();
        const formatted = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          price: coin.current_price,
          image: coin.image,
        }));
        setProducts(formatted);
      } catch (err) {
        console.error("Crypto fetch error", err);
      }
    };
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []); //fetch product data

  useEffect(() => {
    const generateStatus = () => {
      const newStatus = {};
      products.forEach((p) => {
        newStatus[p.id] = Math.random() > 0.5 ? "good" : "bad";
      });
      setRandomStatus(newStatus);
    };

    generateStatus(); // ✅ Run once on load
    const interval = setInterval(generateStatus, 10000);
    return () => clearInterval(interval);
  }, [products]); //generate random status

  const handleAmountChange = (productId, value) => {
    setAmounts((prev) => ({ ...prev, [productId]: value }));
  }; //wallet balance update

  const buyProduct = async (product, type) => {
    const amount = parseFloat(amounts[product.id]) || 0;
    const quantity = amount / product.price;

    if (!user || amount <= 0 || user.walletBalance < amount) {
      alert("Invalid or insufficient balance");
      return;
    }

    const res = await fetch("/api/buy-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        productId: product.id,
        name: product.name, 
        price: product.price,
        quantity, 
        type,
      }),
    }); //buy product

    const data = await res.json();
    if (res.ok) {
      alert(`Bought ${quantity.toFixed(2)} units of ${product.name} (${type})`);
      setUser(data.user);
      await fetchUser();
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  // ✅ Process reward/loss logic
  const processRewards = async () => {
    try {
      const res = await fetch("/api/users/process-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          productStatusMap: randomStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Reward/Loss applied. ₹${data.walletUpdate.toFixed(2)} updated.`);
        setUser((prev) => ({
          ...prev,
          walletBalance: data.updatedBalance,
          ownedProducts: [], // Products are removed after processing
        }));
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Reward Process Error", err);
      alert("Reward processing failed.");
    }
  };

  console.log("user is", user);
  if (!user) {
    return (
      <div className="p-6 text-lg font-semibold text-gray-600">
        Loading user...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-6 sm:p-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">🛒 Product Market</h1>
      <p className="text-lg font-semibold text-green-300 mb-6 text-center">
        Wallet Balance: ₹{user.walletBalance.toFixed(2)}
      </p>
  
      {/* ✅ Reward Button */}
      <div className="text-center mb-8">
        <button
          onClick={processRewards}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Process Reward / Loss
        </button>
      </div>
  
      {/* ✅ Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product) => {
          const amount = parseFloat(amounts[product.id]) || 0;
          const units = amount / product.price;
  
          return (
            <div
              key={product.id}
              className="bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-300 mb-1">Price: ₹{product.price}</p>
              <p className="text-sm text-yellow-400 mb-3">
                Status: {randomStatus[product.id] || "Waiting..."}
              </p>
  
              <input
                type="number"
                placeholder="Enter amount"
                value={amounts[product.id] || ""}
                onChange={(e) => handleAmountChange(product.id, e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <p className="text-sm text-gray-400 mb-3">
                You will get: {units > 0 ? units.toFixed(2) : 0} units
              </p>
  
              <div className="flex gap-3">
                <button
                  onClick={() => buyProduct(product, "good")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
                  disabled={!user || amount > user.walletBalance || amount <= 0}
                >
                  Y (₹{product.price})
                </button>
                <button
                  onClick={() => buyProduct(product, "bad")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
                  disabled={!user || amount > user.walletBalance || amount <= 0}
                >
                  N (₹{product.price})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

export default ProductPage;
