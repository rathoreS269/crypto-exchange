import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="h-screen bg-gray-200">
      <Navbar />
      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-bold text-center text-black">
          Welcome to Wallet Exchange, Log In to Proceed
        </h1>
      </div>
    </div>
  );
}
