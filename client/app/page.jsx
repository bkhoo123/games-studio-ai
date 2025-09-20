import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col">
      {/* Links at the top */}
      <div className="p-4 flex gap-4">
        <Link
          className="w-auto bg-teal-600 py-3 px-4 rounded-md text-white font-semibold hover:bg-teal-700 transition duration-300"
          href="/tic-tac-toe"
        >
          Tic-Tac-Toe
        </Link>
        <Link
          className="w-auto bg-yellow-600 py-3 px-4 rounded-md text-white font-semibold hover:bg-yellow-700 transition duration-300"
          href="/connect-4"
        >
          Connect-4
        </Link>
      </div>

      {/* Centered title */}
      <div className="flex-1 flex items-center justify-center mb-20">
        <div className="text-center text-4xl font-bold">
          Brian's AI Game Studio Sandbox
        </div>
      </div>
    </main>
  );
}
