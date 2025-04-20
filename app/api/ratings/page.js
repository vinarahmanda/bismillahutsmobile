"use client";
import { useEffect, useState } from "react";

export default function RatingPage() {
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetch("/api/ratings")
      .then((res) => res.json())
      .then((data) => {
        setAverage(data.average.toFixed(1));
        setTotal(data.total);
      });
  }, []);

  const handleRating = async (rating) => {
    setUserRating(rating);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });

    // Update rating setelah vote
    const res = await fetch("/api/ratings");
    const data = await res.json();
    setAverage(data.average.toFixed(1));
    setTotal(data.total);
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">Beri Rating Website Ini</h2>
      <div className="flex justify-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-4xl transition-all ${
              userRating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-gray-700 text-sm">
        Rating <strong>{average}</strong> (from <strong>{total}</strong> voters)
      </p>
    </div>
  );
}
