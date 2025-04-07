// export default function Navbar() {
//     return (
//       <nav className="bg-blue-500 p-4 flex justify-between items-center">
//         <span className="text-white text-xl font-bold">Crypto Market</span>
//         <a href="/login" className="text-white text-lg">Login</a>
//       </nav>
//     );
//   }
  
// components/Navbar.js

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-extrabold text-white tracking-wide">
          Crypto Market
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Login
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 bg-gray-100 text-black rounded-lg shadow-lg w-44 z-10 overflow-hidden">
              <Link
                href="/admin"
                className="block px-4 py-2 hover:bg-gray-200 transition"
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
              <Link
                href="/manager-login"
                className="block px-4 py-2 hover:bg-gray-200 transition"
                onClick={() => setIsOpen(false)}
              >
                Manager Login
              </Link>
              <Link
                href="/user-login"
                className="block px-4 py-2 hover:bg-gray-200 transition"
                onClick={() => setIsOpen(false)}
              >
                User Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
