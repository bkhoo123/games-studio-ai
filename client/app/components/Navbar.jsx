import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="p-10">
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-teal-600 p-4 text-white w-auto rounded-md font-semibold hover:bg-teal-700 transition duration-300"
        >
          Home
        </Link>
        <Link
          href="/tic-tac-toe"
          className="bg-orange-600 p-4 text-white w-auto rounded-md font-semibold hover:bg-orange-700 transition duration-300"
        >
          Tic-Tac-Toe
        </Link>
        <Link
          href="/connect-4"
          className="bg-yellow-600 p-4 text-white w-auto rounded-md font-semibold hover:bg-yellow-700 transition duration-300"
        >
          Connect-4
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
