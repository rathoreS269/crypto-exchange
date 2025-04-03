"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 

const ProductPage = () => {
  const { username } = useParams();
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [wallet, setWallet] = useState(1000);
  const [products, setProducts] = useState([]);
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );
        const data = await response.json();
        const formattedProducts = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          price: coin.current_price,
          image: coin.image,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
          change1h: coin.price_change_percentage_1h_in_currency,
          change24h: coin.price_change_percentage_24h_in_currency,
          change7d: coin.price_change_percentage_7d_in_currency,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };
    
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.username === username);

    if (foundUser) {
      setWallet(foundUser.coins);
      setOwnedProducts(foundUser.products || []);
    }
  }, [username]);

  const handleAmountChange = (productId, value) => {
    setAmounts((prev) => ({ ...prev, [productId]: value }));
  };

  const buyProduct = (product) => {
    const amount = parseFloat(amounts[product.id]) || 0;
    const quantity = amount / product.price;
    if (wallet >= amount && quantity > 0) {
        const updatedWallet = wallet - amount;
        const updatedOwnedProducts = [...ownedProducts];
        const existingProduct = updatedOwnedProducts.find((p) => p.id === product.id);
        
        if (existingProduct) {
            existingProduct.quantity += quantity; // Add to the quantity if product is already owned
            existingProduct.totalCost = existingProduct.quantity * product.price; // Update total cost
        } else {
            updatedOwnedProducts.push({ ...product, quantity, totalCost: quantity * product.price });
        }

        setWallet(updatedWallet);
        setOwnedProducts(updatedOwnedProducts);

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map((u) =>
            u.username === username
                ? { ...u, coins: updatedWallet, products: updatedOwnedProducts }
                : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    } else {
        alert("Not enough coins or invalid amount!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Market</h2>
      <p className="mb-4">Wallet Balance: {wallet} coins</p>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          const enteredAmount = parseFloat(amounts[product.id]) || 0;
          const purchasableQuantity = enteredAmount / product.price;
          return (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white text-black">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover text-black" />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">Price: ₹{product.price}</p>
              <p className={product.change1h > 0 ? "text-green-500" : "text-red-500"}>1h: {product.change1h?.toFixed(2)}%</p>
              <p className={product.change24h > 0 ? "text-green-500" : "text-red-500"}>24h: {product.change24h?.toFixed(2)}%</p>
              <p className={product.change7d > 0 ? "text-green-500" : "text-red-500"}>7d: {product.change7d?.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Market Cap: ₹{product.marketCap.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Volume: ₹{product.volume.toLocaleString()}</p>
              <input
                type="number"
                placeholder="Enter amount"
                value={amounts[product.id] || ""}
                onChange={(e) => handleAmountChange(product.id, e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg text-black"
              />
              <p className="text-gray-700 mt-1">You will get: {purchasableQuantity.toFixed(2)} units</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => buyProduct(product)}
                  className="w-1/2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                  disabled={wallet < enteredAmount || enteredAmount <= 0}
                >
                  Y(₹{product.price})
                </button>
                <button
                  onClick={() => buyProduct(product)}
                  className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                  disabled={wallet < enteredAmount || enteredAmount <= 0}
                >
                   N(₹{product.price})
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