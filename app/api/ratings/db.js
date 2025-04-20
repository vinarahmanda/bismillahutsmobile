import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'ratings.json');

export async function readRatings() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function addRating(rating) {
  const ratings = await readRatings();
  ratings.push(rating);
  await fs.writeFile(filePath, JSON.stringify(ratings));
}
