"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = ({ theme }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      ${theme === "light" 
        ? "bg-gradient-to-r from-teal-300 via-sky-300 to-pink-300 text-gray-800 border border-pink-200" 
        : "bg-gradient-to-r from-teal-700 via-sky-700 to-purple-700 text-white border border-purple-900"
      } px-6 py-3 rounded-full shadow-lg transition-all duration-500 w-[90%] md:w-auto backdrop-blur-md`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Menu toggle button for mobile */}
        <button
          className={`md:hidden ${theme === "light" ? "text-gray-800" : "text-white"} text-3xl transition duration-300 hover:text-pink-500`}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Navigation Menu */}
        <ul
          className={`md:flex space-x-8 ${open ? "absolute top-full left-0 right-0 mt-2 p-4 rounded-lg shadow-lg flex flex-col space-y-3 space-x-0 " + 
                  (theme === "light" ? "bg-white/90 border border-pink-200" : "bg-gray-900/90 border border-purple-900") : 
                  "hidden"
          } md:relative md:flex md:space-y-0 md:p-0 md:shadow-none md:bg-transparent md:border-0`}
        >
          <li>
            <Link 
              href="#home" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="#about" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="#skills" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Skills
            </Link>
          </li>
          <li>
            <Link 
              href="#portfolio" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link 
              href="#contact" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link 
              href="#komentar" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Komentar
            </Link>
          </li>
          <li>
            <Link 
              href="#ratings" 
              className={`hover:text-pink-500 transition duration-300 text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}
              onClick={() => setOpen(false)}
            >
              Ratings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
