let comments = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Mengambil daftar komentar
    return res.status(200).json(comments);
  }

  if (req.method === 'POST') {
    // Menambahkan komentar baru
    const { name, comment } = req.body;
    const newComment = { name, comment, id: Date.now() }; // Memberikan ID untuk setiap komentar
    comments.push(newComment);
    
    return res.status(201).json(newComment); // Mengembalikan komentar yang baru saja ditambahkan
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
