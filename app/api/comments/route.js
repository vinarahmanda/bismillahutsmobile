import { getComments, addComment } from "./db.js";

export async function GET() {
  const data = getComments();
  return Response.json(data);
}

export async function POST(request) {
  const { name, comment } = await request.json();

  if (!name || !comment) {
    return Response.json({ error: "Nama dan komentar wajib diisi" }, { status: 400 });
  }

  addComment({ name, comment, date: new Date().toISOString() });

  return Response.json({ message: "Komentar berhasil ditambahkan" });
}
