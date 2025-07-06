import { NextResponse } from "next/server";

// Simulamos una base de datos en memoria (en producción usarías una base de datos real)
const urlDatabase = new Map();

// Función para generar códigos cortos únicos
function generateShortCode() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Función para validar URLs
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

// Función para normalizar URLs
function normalizeUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validaciones
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return NextResponse.json(
        { error: "URL cannot be empty" },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);

    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    // Verificar si la URL ya existe
    for (const [existingCode, existingUrl] of urlDatabase.entries()) {
      if (existingUrl === normalizedUrl) {
        return NextResponse.json({
          shortCode: existingCode,
          message: "URL already shortened",
        });
      }
    }

    // Generar código único
    let shortCode;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      attempts++;
      if (attempts > maxAttempts) {
        return NextResponse.json(
          { error: "Unable to generate unique short code. Please try again." },
          { status: 500 }
        );
      }
    } while (urlDatabase.has(shortCode));

    // Guardar en la base de datos
    urlDatabase.set(shortCode, normalizedUrl);

    // Log para debugging (en producción usarías un logger real)
    console.log(`URL shortened: ${normalizedUrl} -> ${shortCode}`);

    return NextResponse.json({
      shortCode,
      originalUrl: normalizedUrl,
      message: "URL shortened successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/shorten:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get("shortCode");

    if (!shortCode || typeof shortCode !== "string") {
      return NextResponse.json(
        { error: "Short code is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedCode = shortCode.trim();
    if (!trimmedCode) {
      return NextResponse.json(
        { error: "Short code cannot be empty" },
        { status: 400 }
      );
    }

    const longUrl = urlDatabase.get(trimmedCode);

    if (!longUrl) {
      return NextResponse.json(
        { error: "URL not found for the provided short code" },
        { status: 404 }
      );
    }

    // Log para debugging
    console.log(`URL accessed: ${trimmedCode} -> ${longUrl}`);

    return NextResponse.json({
      url: longUrl,
      shortCode: trimmedCode,
    });
  } catch (error) {
    console.error("Error in GET /api/shorten:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Endpoint adicional para obtener estadísticas (opcional)
export async function PUT(request) {
  try {
    const stats = {
      totalUrls: urlDatabase.size,
      databaseSize: JSON.stringify(urlDatabase).length,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error in PUT /api/shorten:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
