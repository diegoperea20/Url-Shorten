'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import Link from 'next/link';

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shortCode = searchParams.get('shortCode');

  useEffect(() => {
    if (shortCode) {
      redirectToLongUrl(shortCode);
    }
  }, [shortCode]);

  const redirectToLongUrl = async (code) => {
    try {
      const response = await fetch(`/api/shorten?shortCode=${code}`);
      if (!response.ok) {
        throw new Error('URL not found');
      }
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const handleShorten = async () => {
    if (!longUrl) {
      alert('Please enter a URL');
      return;
    }
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: longUrl }),
      });
      if (!response.ok) {
        throw new Error('Error al acortar la URL');
      }
      const data = await response.json();
      setShortUrl(`${window.location.origin}?shortCode=${data.shortCode}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al acortar la URL');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  if (shortCode) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="url-shortener">
      <input
        type="text"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter the URL"
      />
      <button onClick={handleShorten}>Shorten</button>
      
      {shortUrl && (
        <div className="result">
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="shortened-url">
            {shortUrl}
          </a>
          <button onClick={handleCopy}>
            {isCopied ? <FaCheck /> : <FaRegCopy /> }
          </button>
        </div>
      )}

<div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
    </div>
  );
}