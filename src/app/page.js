"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRegCopy, FaCheck, FaLink, FaGithub } from "react-icons/fa";
import Link from "next/link";

function URLShortenerContent() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const shortCode = searchParams.get("shortCode");

  useEffect(() => {
    if (shortCode) {
      redirectToLongUrl(shortCode);
    }
  }, [shortCode]);

  const redirectToLongUrl = async (code) => {
    try {
      const response = await fetch(`/api/shorten?shortCode=${code}`);
      if (!response.ok) {
        throw new Error("URL not found");
      }
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error:", error);
      router.push("/");
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    setError("");
    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(longUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      if (!response.ok) {
        throw new Error("Error shortening URL");
      }

      const data = await response.json();
      const fullShortUrl = `${window.location.origin}?shortCode=${data.shortCode}`;
      setShortUrl(fullShortUrl);
    } catch (error) {
      console.error("Error:", error);
      setError("There was an error shortening the URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleShorten();
    }
  };

  if (shortCode) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="header">
          <FaLink className="header-icon" />
          <h1>URL Shortener</h1>
          <p>Shorten your long URLs into compact, shareable links</p>
        </div>

        <div className="url-shortener">
          <div className="input-group">
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your long URL here..."
              className="url-input"
              disabled={isLoading}
            />
            <button
              onClick={handleShorten}
              className="shorten-btn"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {shortUrl && (
            <div className="result">
              <div className="result-header">
                <h3>Your shortened URL:</h3>
              </div>
              <div className="shortened-url-container">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shortened-url"
                >
                  {shortUrl}
                </a>
                <button onClick={handleCopy} className="copy-btn">
                  {isCopied ? <FaCheck /> : <FaRegCopy />}
                </button>
              </div>
              {isCopied && (
                <div className="copy-feedback">URL copied to clipboard!</div>
              )}
            </div>
          )}
        </div>

        <div className="project-github">
          <p>This project is on GitHub</p>
          <Link
            href="https://github.com/diegoperea20/Url-Shorten"
            target="_blank"
          >
            <FaGithub className="github-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function URLShortener() {
  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      }
    >
      <URLShortenerContent />
    </Suspense>
  );
}
