"use client";
import { useState } from "react";
import Navbar from "./components/navbar";

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>{children}</main>
    </div>
  );
}
