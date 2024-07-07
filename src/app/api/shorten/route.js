import { NextResponse } from 'next/server';

// Simulamos una base de datos en memoria
const urlDatabase = new Map();

function generateShortCode() {
  return Math.random().toString(36).substring(2, 7);
}

export async function POST(request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let shortCode = generateShortCode();
  while (urlDatabase.has(shortCode)) {
    shortCode = generateShortCode();
  }

  urlDatabase.set(shortCode, url);

  return NextResponse.json({ shortCode });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shortCode = searchParams.get('shortCode');

  if (!shortCode) {
    return NextResponse.json({ error: 'Short code is required' }, { status: 400 });
  }

  const longUrl = urlDatabase.get(shortCode);

  if (!longUrl) {
    return NextResponse.json({ error: 'URL not found' }, { status: 404 });
  }

  return NextResponse.json({ url: longUrl });
}