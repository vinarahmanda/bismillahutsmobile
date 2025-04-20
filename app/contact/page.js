"use client";
import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nMessage: ${message}`);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-pink-600">
          Contact Me
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Silakan hubungi saya melalui form ini atau langsung melalui kontak di bawah.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your message"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition flex justify-center items-center gap-2"
          >
            Submit ✈️
          </button>
        </form>

        <div className="text-center text-gray-700 mt-6">
          <p>📌 WhatsApp: 0864554621345</p>
          <p>📷 Instagram: @vinaricantik</p>
          <p>📧 Email: vinacantik@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
