import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'ratings.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const ratings = JSON.parse(data);
    const total = ratings.length;
    const average = total === 0 ? 0 : ratings.reduce((a, b) => a + b, 0) / total;
    return Response.json({ average, total });
  } catch (err) {
    return Response.json({ average: 0, total: 0 });
  }
}

export async function POST(request) {
  const { rating } = await request.json();

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const ratings = JSON.parse(data);
    ratings.push(rating);
    await fs.writeFile(filePath, JSON.stringify(ratings));
    return Response.json({ message: 'Rating saved' });
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify([rating]));
    return Response.json({ message: 'Rating file created and saved' });
  }
}
