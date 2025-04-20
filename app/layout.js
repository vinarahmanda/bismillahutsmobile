"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Gunakan usePathname
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css"; // jangan lupa ini juga

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();  // Gunakan usePathname untuk mendapatkan path saat ini

  useEffect(() => {
    AOS.init({ once: true });
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Pengecekan rute, jika berada di halaman detail proyek, tidak menampilkan Navbar
  const isProjectDetailPage = pathname.includes('portfolio');  // Sesuaikan dengan rute halaman detail proyek

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vina Portfolio</title>
      </head>
      <body className={`${theme} font-sans transition-colors duration-300`}>
        {/* Navbar hanya ditampilkan jika bukan di halaman portfolio detail */}
        {!isProjectDetailPage && <Navbar theme={theme} toggleTheme={toggleTheme} />}
        
        {/* Wrapper dengan padding-top agar isi tidak ketabrak Navbar */}
        <main className="pt-24 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
