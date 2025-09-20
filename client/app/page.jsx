import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full p-12">
      <div className="text-center text-3xl font-bold">
        Brian's AI Game Creation World
      </div>
      <div className="">

          <Link
            className="w-auto bg-teal-600 py-3 px-4 rounded-md text-white font-semibold"
            href="/tic-tac-toe"
          >
            Tic-Tac-Toe
          </Link>
     
      </div>
    </main>
  );
}
