let ratings = [];
let totalRatings = 0;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Mengambil rating
    const average = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    return res.status(200).json({ average, total: ratings.length });
  }

  if (req.method === 'POST') {
    // Menambahkan rating baru
    const { rating } = req.body;
    ratings.push(rating);
    totalRatings++;

    // Menghitung rata-rata rating
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return res.status(201).json({ average: average.toFixed(1), total: totalRatings });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
