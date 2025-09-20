import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="p-10 ">
      <div className="">
        <Link
          href="/"
          className="bg-teal-600 p-4 text-white w-auto rounded-md font-semibold"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
