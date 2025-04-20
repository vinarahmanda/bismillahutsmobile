"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

import { db } from "../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("light");
  const [selectedProject, setSelectedProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  // === Tambahan untuk fitur cuaca ===
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatVisible, setIsChatVisible] = useState(false); // State untuk menampilkan/menyembunyikan chat bubble
  const city = "Bandung";

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) {
          throw new Error(data.message || "Gagal mengambil data cuaca");
        }
        setWeather(data);
        setLoadingWeather(false);
      })
      .catch((err) => {
        console.error("Gagal fetch cuaca:", err);
        setLoadingWeather(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // === End fitur cuaca ===

  const fetchComments = async () => {
    setLoadingComments(true);
    const querySnapshot = await getDocs(collection(db, "comments"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setComments(data);
    setLoadingComments(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !newComment) {
      toast.error("Nama dan komentar tidak boleh kosong.");
      return;
    }

    try {
      setSendingComment(true);
      await addDoc(collection(db, "comments"), {
        name,
        comment: newComment,
        createdAt: new Date(),
      });
      setNewComment("");
      setName("");
      toast.success("Komentar berhasil dikirim!");
      fetchComments();
    } catch (error) {
      console.error("Gagal kirim komentar:", error);
      toast.error("Gagal mengirim komentar.");
    } finally {
      setSendingComment(false);
    }
  };

  const handleRating = async (rating) => {
    setUserRating(rating);
    try {
      await addDoc(collection(db, "ratings"), {
        rating,
        createdAt: new Date(),
      });
      fetchRatings();
      toast.success("Rating berhasil dikirim!");
    } catch (error) {
      console.error("Gagal kirim rating:", error);
      toast.error("Gagal mengirim rating.");
    }
  };

  const fetchRatings = async () => {
    const querySnapshot = await getDocs(collection(db, "ratings"));
    const ratings = querySnapshot.docs.map((doc) => doc.data().rating);
    const sum = ratings.reduce((acc, val) => acc + val, 0);
    const avg = ratings.length ? sum / ratings.length : 0;
    setAverage(avg.toFixed(1));
    setTotal(ratings.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Pesan terkirim, terima kasih telah meninggalkan pesan.");
    setEmail("");
    setMessage("");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === "") {
      toast.error("Pesan tidak boleh kosong.");
      return;
    }

    setMessages([...messages, { text: userInput, sender: "user" }]);

    try {
      const sendMessage = httpsCallable(functions, "chatbot");
      const result = await sendMessage({ userInput });
      setMessages([ 
        ...messages, 
        { text: userInput, sender: "user" }, 
        { text: result.data.reply, sender: "chatbot" }
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Error fetching chatbot reply:", error);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchComments();
    fetchRatings();

    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Format waktu
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const dateString = currentTime.toLocaleDateString("id-ID", options);
  const timeString = currentTime.toLocaleTimeString("id-ID");

  return (
    <main
      className={`min-h-screen transition-all duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100"
          : "bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950"
      }`}
    >
      {/* Background Decoration Elements - Different for each theme */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Light Theme Decorations */}
        {theme === "light" && (
          <>
            <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-yellow-300 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </>
        )}

        {/* Dark Theme Decorations */}
        {theme !== "light" && (
          <>
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-800 to-pink-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-full filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-900 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </>
        )}
      </div>

      {/* Theme Toggle Button - Updated with emoji */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 left-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 ${
          theme === "light"
            ? "bg-white text-gray-900 border border-gray-200"
            : "bg-gray-800 text-white border border-gray-700"
        }`}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <Navbar theme={theme} /> 

      {/* Section Home */}
      <section
        id="home"
        className="relative h-screen flex flex-col justify-center items-center text-center px-6 py-20 z-10"
      >
        <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-md ${
          theme === "light" 
            ? "bg-white/60 border border-pink-200" 
            : "bg-gray-900/60 border border-purple-900"
        }`}>
          <h1 className={`text-4xl sm:text-5xl font-bold ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`} data-aos="fade-down">
            <span className={`font-arabic text-5xl sm:text-6xl block mb-3 ${
              theme === "light" ? "text-pink-400" : "text-pink-200"
            }`}>بِسْمِ ٱللَّٰهِ</span>
            Welcome to My Personal Website
          </h1>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mt-8"
            data-aos="zoom-in"
          >
            <div className="relative">
              <div className={`absolute -inset-4 rounded-full opacity-50 ${
                theme === "light"
                  ? "bg-gradient-to-r from-pink-300 to-purple-300 animate-spin-slow"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 animate-spin-slow"
              }`}></div>
              <Image
                src="/v.jpg"
                alt="Vina's Photo"
                width={200}
                height={200}
                className={`rounded-full shadow-xl border-4 object-cover mx-auto relative z-10 ${
                  theme === "light" ? "border-white" : "border-gray-800"
                }`}
              />
            </div>
          </motion.div>

          <Link
            href="#contact"
            className={`mt-8 px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-block ${
              theme === "light"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "bg-gradient-to-r from-pink-600 to-purple-700 text-white"
            }`}
            data-aos="zoom-in"
          >
            Contact Me
          </Link>
        </div>
      </section>
      <>
  {/* Cuaca Button dan Bubble dibungkus bersama */}
  <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
    {/* Chat Bubble muncul di atas tombol */}
    {isChatVisible && (
      <div className="w-72 p-4 bg-white rounded-xl shadow-lg transition-all duration-300">
        <h1 className="text-2xl font-bold mb-2">🌤️ Info Cuaca</h1>
        <p className="text-sm text-gray-600">{dateString}</p>
        <p className="text-sm text-gray-600 mb-4">{timeString}</p>

        {loadingWeather ? (
          <p>Loading...</p>
        ) : weather ? (
          <>
            <p className="text-lg font-semibold">{weather.name}</p>
            <p className="text-xl">{weather.main.temp}°C</p>
            <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
            <p className="text-sm text-gray-500">Humidity: {weather.main.humidity}%</p>
          </>
        ) : (
          <p>Gagal memuat data cuaca</p>
        )}
      </div>
    )}

    {/* Tombol Icon Awan */}
    <button
      onClick={() => setIsChatVisible(!isChatVisible)}
      className="w-16 h-16 bg-orange-400 rounded-full shadow-lg flex justify-center items-center transition duration-300 hover:scale-110"
    >
      <img src="/awan.png" alt="Icon Awan" className="w-10 h-10 object-contain" />
    </button>
  </div>
</>

      {/* Section About */}
      <section id="about" className="relative min-h-screen py-20 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-8 shadow-xl backdrop-blur-md ${
            theme === "light" 
              ? "bg-white/70 border border-pink-200" 
              : "bg-gray-900/70 border border-purple-900"
          }`}>
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-2 ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`} data-aos="fade-up">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-10 rounded-full"></div>
            
            <div className={`rounded-2xl p-8 shadow-lg ${
              theme === "light"
                ? "bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100"
                : "bg-gradient-to-br from-gray-800 to-purple-900/30 border border-purple-800"
            }`} data-aos="fade-right">
              <p className={`text-lg leading-relaxed ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}>
                Aku Vina Rahmanda Indriyani, Mahasiswa Semester 4 jurusan Komputerisasi Akuntansi.
                Aku lulusan SMK Bhakti Putra Nagreg, jurusan Rekayasa Perangkat Lunak. Aku suka banget
                dunia IT dan bercita-cita menjadi seorang IT Expert!
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mt-10">
              <Image src="/sapi.png" alt="Cute Cow 1" width={100} height={100} className="animate-bounce" data-aos="zoom-in" />
              <Image src="/sapi.png" alt="Cute Cow 2" width={100} height={100} className="animate-bounce delay-150" data-aos="zoom-in" />
              <Image src="/sapi.png" alt="Cute Cow 3" width={100} height={100} className="animate-bounce delay-300" data-aos="zoom-in" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Skills */}
      <section id="skills" className="relative min-h-screen py-20 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-8 shadow-xl backdrop-blur-md ${
            theme === "light" 
              ? "bg-white/70 border border-pink-200" 
              : "bg-gray-900/70 border border-purple-900"
          }`}>
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-2 ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`} data-aos="fade-up">
              My Skills
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-10 rounded-full"></div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {[
                { name: "JavaScript", icon: "🌟" },
                { name: "React", icon: "⚛️" },
                { name: "Next.js", icon: "▲" },
                { name: "Node.js", icon: "🟢" },
                { name: "MySQL", icon: "🐬" },
                { name: "PHP", icon: "🐘" },
                { name: "HTML", icon: "🌐" },
                { name: "CSS", icon: "🎨" }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  className={`px-6 py-3 text-white rounded-xl shadow-md flex items-center gap-2 ${
                    theme === "light"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600"
                      : "bg-gradient-to-r from-pink-700 to-purple-800"
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  data-aos="zoom-in"
                  data-aos-delay={index * 50}
                >
                  <span>{skill.icon}</span>
                  {skill.name}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Portfolio */}
<section id="portfolio" className="relative min-h-screen py-20 px-4 z-10">
  <div className="max-w-6xl mx-auto">
    <div className={`rounded-3xl p-8 shadow-xl backdrop-blur-md ${
      theme === "light" 
        ? "bg-white/70 border border-pink-200" 
        : "bg-gray-900/70 border border-purple-900"
    }`}>
      <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-2 ${
        theme === "light" ? "text-gray-800" : "text-white"
      }`} data-aos="fade-up">
        My Portfolio
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-10 rounded-full"></div>
      
      {/* Timeline Portfolio */}
      <div className="mt-10 relative">
        {/* Timeline Line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600 z-0"></div>
        
        {/* Project Items */}
        {[
         { 
          year: "2025",  // Update tahun sesuai dengan proyek yang berjalan
          title: "Web Skripsi Online", 
          description: "Platform untuk mengelola, mengunggah, dan berbagi skripsi mahasiswa.",
          icon: "📑",  // Ikon yang relevan dengan skripsi
          technologies: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],  // Teknologi yang digunakan di platform ini
          duration: "4 bulan",  // Durasi pengerjaan proyek
          role: "Full Stack Developer",  // Peran kamu dalam proyek
          slug: "web-skripsi-online",  // Slug untuk URL proyek
          longDesc: "Web Skripsi Online adalah platform yang memungkinkan mahasiswa untuk mengunggah, mengelola, dan berbagi skripsi mereka secara online. Dilengkapi dengan fitur pencarian skripsi, pengelolaan kategori skripsi, serta sistem autentikasi yang aman. Platform ini memudahkan pengelolaan data skripsi dengan dukungan teknologi modern.",
          liveUrl: "https://c5-gray.vercel.app/"  // URL proyek yang sudah di-deploy
          },
          { 
            year: "2024",
            title: "CV Online", 
            description: "Website CV interaktif dengan animasi modern dan responsif.",
            icon: "📄",
            technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
            duration: "1 bulan",
            role: "Front-end Developer",
            slug: "cv-online",
            longDesc: "CV online interaktif yang menampilkan informasi profil, pengalaman, dan keahlian dalam format yang menarik. Dibuat dengan Next.js dan Tailwind CSS, dilengkapi dengan animasi smooth scrolling dan transisi halus menggunakan Framer Motion.",
            liveUrl: "https://txt-theta.vercel.app/"
          },
          { 
            year: "2024",
            title: "CV Online (Scroll Version)", 
            description: "CV online dengan fitur scroll parallax dan animasi interaktif.",
            icon: "🖥️",
            technologies: ["React", "Next.js", "GSAP", "Tailwind CSS"],
            duration: "2 minggu",
            role: "UI/UX & Front-end Developer",
            slug: "cv-scroll",
            longDesc: "CV online dengan tampilan unik berbasis scroll, dibuat dengan Next.js dan GSAP untuk animasi parallax. Menampilkan informasi profesional dalam format yang kreatif dengan animasi smooth scroll dan efek parallax yang menarik.",
            liveUrl: "https://onscrol-xo9c.vercel.app/"
          }
        ].map((project, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col md:flex-row md:items-center gap-8 mb-16 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
            data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
            data-aos-delay={index * 100}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg z-10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white"></div>
            </div>
            
            {/* Year Badge */}
            <div className={`absolute left-10 md:left-1/2 md:transform md:translate-x-8 ${index % 2 === 0 ? 'md:-translate-x-20' : 'md:translate-x-8'} top-0 px-4 py-1 rounded-full font-bold text-xs ${
              theme === "light" ? "bg-pink-500 text-white" : "bg-pink-700 text-white"
            }`}>
              {project.year}
            </div>
            
            {/* Content Card */}
            <motion.div 
              className={`w-full md:w-5/12 p-6 rounded-2xl shadow-lg ${
                theme === "light"
                  ? "bg-gradient-to-br from-white to-pink-50 border border-pink-100"
                  : "bg-gradient-to-br from-gray-800 to-purple-900/50 border border-purple-800"
              }`}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl mb-4">{project.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}>{project.title}</h3>
              <p className={
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }>{project.description}</p>
              
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 my-3">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex} 
                    className={`text-xs px-2 py-1 rounded-full ${
                      theme === "light" 
                        ? "bg-pink-100 text-pink-800" 
                        : "bg-purple-900 text-pink-200"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Project Info */}
              <div className={`text-sm mb-4 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                <p><strong>Durasi:</strong> {project.duration}</p>
                <p><strong>Peran:</strong> {project.role}</p>
              </div>
              
              <Link 
                href={`/portfolio/${project.slug}`}
                className={`mt-4 px-4 py-2 text-white rounded-lg text-sm transition-all duration-300 inline-flex items-center ${
                  theme === "light" ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-700 hover:bg-pink-800"
                }`}
              >
                Detail Project <span className="ml-1">→</span>
              </Link>
              
              {project.liveUrl && (
                <a 
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ml-2 mt-4 px-4 py-2 rounded-lg text-sm transition-all duration-300 inline-flex items-center ${
                    theme === "light" 
                      ? "bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-50" 
                      : "bg-transparent border border-pink-700 text-pink-400 hover:bg-purple-900/30"
                  }`}
                >
                  Lihat Live <span className="ml-1">↗</span>
                </a>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      
    </div>
  </div>
</section>

      {/* Section Contact */}
      <section id="contact" className="relative min-h-screen py-20 px-4 z-10">
        <div className="max-w-lg mx-auto">
          <div className={`rounded-3xl p-8 shadow-xl backdrop-blur-md ${
            theme === "light" 
              ? "bg-white/70 border border-pink-200" 
              : "bg-gray-900/70 border border-purple-900"
          }`}>
            <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-2 ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`} data-aos="fade-up">
              Contact Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-10 rounded-full"></div>
            
            <div className={`rounded-2xl p-8 shadow-lg ${
              theme === "light"
                ? "bg-gradient-to-br from-white to-pink-50 border border-pink-100"
                : "bg-gradient-to-br from-gray-800 to-purple-900/50 border border-purple-800"
            }`} data-aos="fade-up">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4"
              >
                <div>
                  <label htmlFor="email" className={`text-sm font-medium block mb-1 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      theme === "light" 
                        ? "bg-white text-gray-900 border-pink-200" 
                        : "bg-gray-800 text-white border-gray-600"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className={`text-sm font-medium block mb-1 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Write your message here..."
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-32 ${
                      theme === "light" 
                        ? "bg-white text-gray-900 border-pink-200" 
                        : "bg-gray-800 text-white border-gray-600"
                    }`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                <button 
                  type="submit" 
                  className={`px-6 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    theme === "light" 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                      : "bg-gradient-to-r from-pink-700 to-purple-800"
                  }`}
                >
                  Send Message
                </button>
              </form>
              {status && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                  theme === "light" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-green-900 text-green-100"
                }`}>
                  {status}
                </div>
              )}
            </div>
            
            <div className="mt-10 flex justify-center gap-6">
              {[
                { name: "GitHub", icon: "🐙" },
                { name: "LinkedIn", icon: "🔗" },
                { name: "Instagram", icon: "📸" },
                { name: "Email", icon: "✉️" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`p-3 rounded-full shadow-md flex items-center justify-center text-2xl transition-colors ${
                    theme === "light"
                      ? "bg-white hover:bg-pink-100 border border-pink-100"
                      : "bg-gray-800 hover:bg-gray-700 border border-purple-800"
                  }`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Formulir Komentar */}
<section id="komentar" className="max-w-2xl mx-auto px-4 py-10 rounded-lg text-center">
  <h2 className={`text-3xl font-semibold mb-6 ${theme === "light" ? "text-gray-800" : "text-white"}`}>Komentar</h2>

  <form onSubmit={handleCommentSubmit} className="space-y-6 mb-8">
    <div className="relative">
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full p-4 pl-12 border rounded-lg shadow-xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${
          theme === "light" ? "bg-white text-gray-900 border-gray-300" : "bg-gray-800 text-white border-gray-600"
        }`}
        required
      />
      <span className="absolute left-4 top-4 text-teal-500 text-lg">👤</span>
    </div>
    
    <div className="relative">
      <textarea
        placeholder="Tulis komentarmu..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className={`w-full p-4 pl-12 border rounded-lg shadow-xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 min-h-32 ${
          theme === "light" ? "bg-white text-gray-900 border-gray-300" : "bg-gray-800 text-white border-gray-600"
        }`}
        rows="4"
        required
      ></textarea>
      <span className="absolute left-4 top-4 text-teal-500 text-lg">💬</span>
    </div>

    <button
      type="submit"
      className={`px-8 py-3 rounded-lg font-semibold ${
        sendingComment ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
      } text-gray-800 transition-all duration-300 transform hover:scale-105`}
      disabled={sendingComment}
    >
      {sendingComment ? "Mengirim..." : "Kirim Komentar"}
    </button>

    
  </form>

  <div className="space-y-6">
    {loadingComments && <p className="text-gray-500 text-center">Memuat komentar...</p>}
    {!loadingComments && comments.length === 0 && <p className="text-center text-gray-500">Belum ada komentar.</p>}
    {!loadingComments && comments.map((comment, index) => (
      <div
        key={index}
        className={`p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          theme === "light" ? "bg-white text-gray-800 border-gray-300" : "bg-gray-800 text-gray-100 border-gray-600"
        }`}
      >
        <p className="font-semibold text-xl">{comment.name}</p>
        <p className="text-sm mt-2">{comment.comment}</p>
      </div>
    ))}
  </div>
</section>


{/* Rating Section */}
<section id="ratings" className="max-w-2xl mx-auto px-4 py-10 rounded-lg text-center">
  <h2 className={`text-2xl font-semibold mb-6 ${theme === "light" ? "text-gray-800" : "text-white"}`}>Beri Rating Website Ini</h2>
  <div className="flex justify-center mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => handleRating(star)}
        className={`text-5xl transition-all duration-300 transform ${
          userRating >= star
            ? "text-yellow-400 scale-110"
            : theme === "light"
            ? "text-gray-300 hover:text-yellow-300"
            : "text-gray-500 hover:text-yellow-400"
        }`}
      >
        ★
      </button>
    ))}
  </div>
  <p className={`text-lg mt-4 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
    Rating <strong>{average}</strong> (dari <strong>{total}</strong> pengguna)
  </p>
</section>



      {/* Footer */}
      <footer className={`py-6 text-center border-t backdrop-blur-sm relative z-10 ${
        theme === "light"
          ? "text-gray-800 border-pink-200 bg-white/60"
          : "text-gray-300 border-purple-900 bg-gray-900/60"
      }`}>
        <p>© 2025 Vina Rahmanda Indriyani. All rights reserved.</p>
      </footer>

      {/* Add animate-spin-slow class */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </main>
  );
}