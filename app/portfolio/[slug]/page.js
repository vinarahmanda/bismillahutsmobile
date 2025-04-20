"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation"; // Import useParams to access dynamic route params
import gsap from "gsap"; // Import GSAP for animations

const portfolioData = [
  {
    year: "2025",
    title: "Web Skripsi Online",
    description: "Platform untuk mengelola, mengunggah, dan berbagi skripsi mahasiswa.",
    icon: "📑",
    technologies: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    duration: "30 menit",
    role: "Full Stack Developer",
    slug: "web-skripsi-online",
    longDesc:
      "Web Skripsi Online adalah platform yang memungkinkan mahasiswa untuk mengunggah, mengelola, dan berbagi skripsi mereka secara online. Dilengkapi dengan fitur pencarian skripsi, pengelolaan kategori skripsi, serta sistem autentikasi yang aman.",
    liveUrl: "https://c5-gray.vercel.app/",
  },
  {
    year: "2025",
    title: "CV Online",
    description: "Website CV interaktif dengan animasi modern dan responsif.",
    icon: "📄",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    duration: "1 hari",
    role: "Front-end Developer",
    slug: "cv-online",
    longDesc:
      "CV online interaktif yang menampilkan informasi profil, pengalaman, dan keahlian dalam format yang menarik. Dibuat dengan Next.js dan Tailwind CSS, dilengkapi dengan animasi smooth scrolling dan transisi halus menggunakan Framer Motion.",
    liveUrl: "https://txt-theta.vercel.app/",
  },
  {
    year: "2024",
    title: "CV Online (Scroll Version)",
    description: "CV online dengan fitur scroll parallax dan animasi interaktif.",
    icon: "🖥️",
    technologies: ["React", "Next.js", "GSAP", "Tailwind CSS"],
    duration: "2 hari",
    role: "UI/UX & Front-end Developer",
    slug: "cv-scroll",
    longDesc:
      "CV online dengan tampilan unik berbasis scroll, dibuat dengan Next.js dan GSAP untuk animasi parallax. Menampilkan informasi profesional dalam format yang kreatif dengan animasi smooth scroll dan efek parallax yang menarik.",
    liveUrl: "https://onscrol-xo9c.vercel.app/",
  },
];

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = useParams(); // Use useParams to access slug
  const project = portfolioData.find((p) => p.slug === slug);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check for stored theme in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("light"); // Default theme
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // GSAP animations
    if (theme === "light" && project) {
      gsap.fromTo(
        ".long-desc",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [theme, project]);

  if (!project) return notFound(); // Handle case where project is not found

  return (
    <main
      className={`min-h-screen transition-all duration-500 relative z-10 ${theme === "light" ? "bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 text-gray-900" : "bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white"}`}
    >
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {theme === "light" ? (
          <>
            <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-800 to-pink-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-900 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </>
        )}
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 left-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 ${theme === "light" ? "bg-white text-gray-900 border border-gray-200" : "bg-gray-800 text-white border border-gray-700"}`}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Content */}
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
          <span>{project.icon}</span> {project.title}
        </h1>
        <p className="mb-6 text-lg leading-relaxed">{project.longDesc}</p>

        <div className="long-desc text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600 mb-6">
          {project.longDesc}
        </div>

        <div className="mb-4">
          <p><strong>Peran:</strong> {project.role}</p>
          <p><strong>Durasi:</strong> {project.duration}</p>
          <p><strong>Teknologi:</strong> {project.technologies.join(", ")}</p>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            className="inline-block mt-4 text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg shadow transition"
            target="_blank"
            rel="noreferrer"
          >
            🔗 Lihat Live Project
          </a>
        )}
        <br />
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </main>
  );
}
