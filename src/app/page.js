import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <Navbar />
      <div className="flex justify-center items-center h-full px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-relaxed">
          Welcome to Wallet Exchange
          <br />
          Log In to Proceed
        </h1>
      </div>
    </div>
  );
}
