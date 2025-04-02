export default function Navbar() {
    return (
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <span className="text-white text-xl font-bold">Crypto Market</span>
        <a href="/login" className="text-white text-lg">Login</a>
      </nav>
    );
  }
  